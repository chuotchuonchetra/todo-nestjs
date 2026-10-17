import { Column, Entity, PrimaryColumn } from 'typeorm';

// single-user app: there is only ever one row, with id 1
@Entity()
export class UserProfile {
  @PrimaryColumn({ type: 'int', default: 1 })
  id: number;
  @Column()
  username: string;
  @Column()
  displayName: string;
  @Column({ default: '' })
  title: string;
  @Column({ default: '' })
  email: string;
  @Column({ type: 'text', default: '' })
  avatarUrl: string;
  @Column({ type: 'text', default: '' })
  bio: string;
}
