import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { User } from './entities/user.entity.js';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}
  async create(email: string, passwordHash: string) {
    if (await this.repo.existsBy({ email })) {
      throw new ConflictException('Email already registered');
    }
    return this.repo.save(this.repo.create({ email, passwordHash }));
  }
  // passwordHash is select:false, so ask for it explicitly
  findByEmailWithPassword(email: string) {
    return this.repo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }
  findOneByOrFail(where: FindOptionsWhere<User>) {
    return this.repo.findOneByOrFail(where);
  }
  // save (update) a user
  async save(user: User) {
    return this.repo.save(user);
  }
}
