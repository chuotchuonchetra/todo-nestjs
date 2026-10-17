import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Todo } from '../todo/entities/todo.entity.js';
import { UserService } from '../user/user.service.js';

const HOUR = 3600000;

// same seed data as the frontend's INITIAL_TODOS
const DEMO_TODOS = [
  {
    title: 'Design intuitive onboarding flow for new users',
    description: 'Prepare wireframes and user interaction states in Figma',
    status: 'In Progress',
    priority: 'High',
    category: 'Design',
    starred: true,
    hoursAgo: 24,
  },
  {
    title: 'Implement local state CRUD operations for Todo list',
    description:
      'Support create, read, edit title & status, delete with instant feedback',
    status: 'Done',
    priority: 'High',
    category: 'Development',
    starred: true,
    hoursAgo: 48,
  },
  {
    title: 'Add drag-and-drop task reordering capability',
    description:
      'Allow fluid rearranging of todos with native HTML5 drag and drop',
    status: 'Done',
    priority: 'Medium',
    category: 'Feature',
    starred: false,
    hoursAgo: 12,
  },
  {
    title: 'Refactor profile drawer and user settings panel',
    description: 'Provide customizable username, avatar, and quick demo reset',
    status: 'In Progress',
    priority: 'Medium',
    category: 'Feature',
    starred: false,
    hoursAgo: 5,
  },
  {
    title: 'Prepare sprint demo presentation for stakeholders',
    description: 'Record walkthrough video and summarize key metrics',
    status: 'To Do',
    priority: 'High',
    category: 'Management',
    starred: true,
    hoursAgo: 2,
  },
  {
    title: 'Audit responsive layout on mobile screens',
    description:
      'Test touch targets and viewport handling across iOS & Android browsers',
    status: 'To Do',
    priority: 'Low',
    category: 'QA',
    starred: false,
    hoursAgo: 1,
  },
];

@Injectable()
export class DemoService {
  constructor(
    @InjectRepository(Todo)
    private todos: Repository<Todo>,
    private user: UserService,
  ) {}
  async reset() {
    await this.todos.clear();
    await this.todos.save(
      DEMO_TODOS.map(({ hoursAgo, ...todo }, position) =>
        this.todos.create({
          ...todo,
          position,
          createdAt: new Date(Date.now() - hoursAgo * HOUR),
        }),
      ),
    );
    return {
      todos: await this.todos.find({ order: { position: 'ASC' } }),
      user: await this.user.reset(),
    };
  }
}
