import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { UserProfile } from './entities/user-profile.entity.js';
import { DEFAULT_USER } from './user.constants.js';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserProfile)
    private repo: Repository<UserProfile>,
  ) {}
  async get() {
    return (await this.repo.findOneBy({ id: 1 })) ?? this.reset();
  }
  async update(dto: UpdateUserDto) {
    const current = await this.get();
    return this.repo.save({ ...current, ...dto, id: 1 });
  }
  reset() {
    return this.repo.save({ ...DEFAULT_USER });
  }
}
