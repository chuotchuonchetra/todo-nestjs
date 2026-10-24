import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity.js';

@Entity()
export class RefreshToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  // sha256 of the refresh JWT: the raw token is never stored
  @Index({ unique: true })
  @Column()
  tokenHash: string;
  @Column({ default: false })
  revoked: boolean;
  @Column({ type: 'timestamptz' })
  expiresAt: Date;
  @CreateDateColumn()
  createdAt: Date;
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  user: User;
  @Column()
  userId: string;
}
