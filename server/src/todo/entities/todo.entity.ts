import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
}
