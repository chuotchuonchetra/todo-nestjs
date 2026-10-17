import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTodoDto } from './dto/create-todo.dto.js';
import { UpdateTodoDto } from './dto/update-todo.dto.js';
import { Todo } from './entities/todo.entity.js';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo)
    private repo: Repository<Todo>,
  ) {}
  findAll() {
    return this.repo.find({ order: { position: 'ASC', createdAt: 'DESC' } });
  }
  async findOne(id: string) {
    const todo = await this.repo.findOneBy({ id });
    if (!todo) throw new NotFoundException(`Todo ${id} not found`);
    return todo;
  }
  async create(dto: CreateTodoDto) {
    // new tasks go to the top of the list, like the UI prepends them
    const { min } = (await this.repo
      .createQueryBuilder('t')
      .select('MIN(t.position)', 'min')
      .getRawOne<{ min: number | null }>())!;
    const position = (min ?? 1) - 1;
    return this.repo.save(this.repo.create({ ...dto, position }));
  }
  async update(id: string, dto: UpdateTodoDto) {
    const todo = await this.findOne(id);
    return this.repo.save(Object.assign(todo, dto));
  }
  async remove(id: string) {
    const todo = await this.findOne(id);
    await this.repo.remove(todo);
  }
  // `ids` is the new order of a (possibly filtered) subset of the list: it is
  // dealt the positions that subset already holds, so other todos stay put.
  async reorder(ids: string[]) {
    await this.repo.manager.transaction(async (em) => {
      const todos = await em.findBy(Todo, { id: In(ids) });
      const slots = todos.map((t) => t.position).sort((a, b) => a - b);
      const known = new Set(todos.map((t) => t.id));
      const ordered = ids.filter((id) => known.has(id));
      await Promise.all(
        ordered.map((id, i) => em.update(Todo, id, { position: slots[i] })),
      );
    });
    return this.findAll();
  }
  async bulkStatus(ids: string[], status: string) {
    const { affected } = await this.repo.update({ id: In(ids) }, { status });
    return { updated: affected ?? 0 };
  }
  async bulkRemove(ids: string[]) {
    const { affected } = await this.repo.delete({ id: In(ids) });
    return { deleted: affected ?? 0 };
  }
}
