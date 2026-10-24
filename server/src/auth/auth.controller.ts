import {
  Body,
  Controller,
  Get,
  HttpCode,
  Post,
  Req,
  Res,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { UserService } from '../user/user.service.js';
import { AuthService } from './auth.service.js';
import { cookieOpts, REFRESH_COOKIE } from './auth.constants.js';
import { CurrentUser } from './decorators/current-user.decorator.js';
import { Public } from './decorators/public.decorator.js';
import { CredentialsDto } from './dto/credentials.dto.js';
import type { AuthUser } from './jwt.strategy.js';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly users: UserService,
  ) {}
  @Public()
  @Post('register')
  register(
    @Body() dto: CredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    return this.auth.register(dto, res);
  }
  @Public()
  @HttpCode(200)
  @Post('login')
  async login(
    @Body() dto: CredentialsDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const u = await this.auth.validate(dto.email, dto.password);
    return this.auth.issueTokens(u, res);
  }
  // the access token expired; the cookie is the proof
  @Public()
  @HttpCode(200)
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.auth.useRefresh(req.cookies?.[REFRESH_COOKIE]);
    return this.auth.issueTokens(user, res);
  }
  @HttpCode(204)
  @Post('logout')
  async logout(
    @CurrentUser() user: AuthUser,
    @Res({ passthrough: true }) res: Response,
  ) {
    await this.auth.revokeAll(user.id);
    res.clearCookie(REFRESH_COOKIE, { ...cookieOpts, maxAge: undefined });
  }
  @Get('me')
  me(@CurrentUser() user: AuthUser) {
    return this.users.findOneByOrFail({ id: user.id });
  }
}
