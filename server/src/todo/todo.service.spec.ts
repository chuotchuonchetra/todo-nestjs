import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException } from '@nestjs/common';
import { TodosService } from './todo.service.js';
import { Todo } from './entities/todo.entity.js';

describe('TodosService', () => {
  let service: TodosService;
  const repo = {
    find: vi.fn(),
    findOneBy: vi.fn(),
    create: vi.fn((x) => x),
    save: vi.fn((x) => x),
    remove: vi.fn(),
  };

  beforeEach(async () => {
    vi.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodosService,
        { provide: getRepositoryToken(Todo), useValue: repo },
      ],
    }).compile();

    service = module.get<TodosService>(TodosService);
  });

  it('updates an existing todo', async () => {
    repo.findOneBy.mockResolvedValue({ id: 1, title: 'a', status: 'TODO' });
    await expect(service.update(1, { status: 'DONE' })).resolves.toEqual({
      id: 1,
      title: 'a',
      status: 'DONE',
    });
  });

  it('throws NotFound when removing a missing todo', async () => {
    repo.findOneBy.mockResolvedValue(null);
    await expect(service.remove(99)).rejects.toBeInstanceOf(NotFoundException);
  });
});
