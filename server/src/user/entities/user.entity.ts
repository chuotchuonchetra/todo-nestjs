import {
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { Todo } from '../../todo/entities/todo.entity.js';
import { Role } from '../role.enum.js';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  email: string;
  @Column({ select: false })
  passwordHash: string;
  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;
  @OneToMany(() => Todo, (t) => t.owner)
  todos: Relation<Todo>[];
}
