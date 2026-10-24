import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon2 from 'argon2';
import { createHash, randomUUID } from 'node:crypto';
import type { Response } from 'express';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity.js';
import { UserService } from '../user/user.service.js';
import { cookieOpts, REFRESH_COOKIE } from './auth.constants.js';
import { CredentialsDto } from './dto/credentials.dto.js';
import { RefreshToken } from './entities/refresh-token.entity.js';

const REFRESH_TTL_MS = 7 * 24 * 3600 * 1000;
const sha256 = (s: string) => createHash('sha256').update(s).digest('hex');

@Injectable()
export class AuthService {
  private readonly refreshSecret: string;
  constructor(
    private readonly jwt: JwtService,
    private readonly users: UserService,
    cfg: ConfigService,
    @InjectRepository(RefreshToken) private tokens: Repository<RefreshToken>,
  ) {
    this.refreshSecret = cfg.getOrThrow<string>('JWT_REFRESH_SECRET');
  }
  async register(dto: CredentialsDto, res: Response) {
    const user = await this.users.create(
      dto.email,
      await argon2.hash(dto.password),
    );
    const savedUser = await this.users.save(user);
    return this.issueTokens(savedUser, res);
  }
  async validate(email: string, password: string) {
    const user = await this.users.findByEmailWithPassword(email);
    if (!user || !(await argon2.verify(user.passwordHash, password))) {
      throw new UnauthorizedException('Invalid email or password');
    }
    return user;
  }
  async issueTokens(user: User, res: Response) {
    const payload = { sub: user.id, role: user.role };
    const access = await this.jwt.signAsync(payload);
    const refresh = await this.jwt.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: '7d',
      jwtid: randomUUID(), // two tokens issued in the same second must differ
    });
    await this.saveRefresh(user.id, refresh);
    res.cookie(REFRESH_COOKIE, refresh, cookieOpts);
    return { accessToken: access };
  }
  private saveRefresh(userId: string, refresh: string) {
    return this.tokens.save(
      this.tokens.create({
        userId,
        tokenHash: sha256(refresh),
        expiresAt: new Date(Date.now() + REFRESH_TTL_MS),
      }),
    );
  }
  // verify + rotate: the old token is revoked, the caller issues a new one
  async useRefresh(token: string | undefined) {
    if (!token) throw new UnauthorizedException();
    try {
      await this.jwt.verifyAsync(token, { secret: this.refreshSecret });
    } catch {
      throw new UnauthorizedException();
    }
    const row = await this.tokens.findOneBy({ tokenHash: sha256(token) });
    if (!row || row.expiresAt < new Date()) throw new UnauthorizedException();
    if (row.revoked) {
      // an already-rotated token came back: assume it was copied
      await this.revokeAll(row.userId);
      throw new UnauthorizedException();
    }
    row.revoked = true;
    await this.tokens.save(row);
    return this.users.findOneByOrFail({ id: row.userId });
  }
  async revokeAll(userId: string) {
    await this.tokens.update({ userId, revoked: false }, { revoked: true });
  }
}
