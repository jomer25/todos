import { BadRequestException, Inject, Injectable, NotFoundException, UseInterceptors } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schemas/todo.schema';
import { Model, Types } from 'mongoose';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
@UseInterceptors(CacheInterceptor)
export class TodosService {
  constructor(
    @InjectModel(Todo.name)
    private readonly model: Model<Todo>,
    @Inject(CACHE_MANAGER)
    private readonly cache: Cache
  ) {}

  async create(createTodoDto: CreateTodoDto): Promise<Todo> {
    return await this.model.create(createTodoDto);
  }

  async findAll(): Promise<Todo[]> {
    const cacheKey = 'all_todos';
    let todos: Todo[] = await this.cache.get<Todo[]>(cacheKey);
    if (!todos) {
      todos = await this.model.find().exec();
      await this.cache.set(cacheKey, todos)
    }
    return todos;
  }

  async findOne(id: string): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({ message: 'Invalid ID' })
    }

    const cacheKey = `todo_${id}`;
    let todo: Todo = await this.cache.get<Todo>(cacheKey)
    if (!todo) {
      todo = await this.model.findOne({ _id: id }).exec() 
      if (!todo) {
        throw new NotFoundException({ message: 'Todo Not Found' })
      }

      await this.cache.set(cacheKey, todo)
    }
    return todo;
  }

  async update(id: string, updateTodoDto: UpdateTodoDto): Promise<Todo> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({ message: 'Invalid ID' })
    }

    const cacheKey = `todo_${id}`;
    const todo = await this.model.findOneAndUpdate({ _id: id }, updateTodoDto).exec()
    
    if (!todo) {
      throw new NotFoundException({ message: 'Todo Not Found' })
    }
    await this.cache.set(cacheKey, todo)
    return todo;
  }

  async remove(id: string): Promise<void> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException({ message: 'Invalid ID' })
    }

    const cacheKey = `todo_${id}`;
    const todo = await this.model.findOneAndDelete({ _id: id }).exec()

    if (!todo) {
      throw new NotFoundException({ message: 'Todo Not Found' })
    }
    await this.cache.del(cacheKey)
  }
}
