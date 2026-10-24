import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  type Relation,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

@Entity()
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ length: 200 })
  title: string;
  @Column({ type: 'text', default: '' })
  description: string;
  @Column({ default: 'To Do' })
  status: string;
  @Column({ default: 'Medium' })
  priority: string;
  @Column({ default: 'Development' })
  category: string;
  @Column({ default: false })
  starred: boolean;
  @Column({ type: 'int', default: 0 })
  position: number;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, (u) => u.todos)
  owner: Relation<User>;
  @Column()
  ownerId: string;
}
