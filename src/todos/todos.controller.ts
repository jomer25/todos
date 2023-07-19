import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { TodosService } from './todos.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { Todo } from './schemas/todo.schema';
import { TodosAbilityGuard } from './ability/guards/todos-ability.guard';
import { Manage, TodosAbility } from './ability/decorators/todos-ability.decorator';
import { TodosAbilityService } from './ability/todos-ability.service';
import { Action } from '../casl/enum/action.enum';

@Controller('todos')
@UseGuards(TodosAbilityGuard)
@TodosAbility(new Manage())
export class TodosController {
  constructor(
    private readonly todosService: TodosService,
    private readonly todosAbilityService: TodosAbilityService
  ) {}

  @Post()
  async create(@Body() createTodoDto: CreateTodoDto): Promise<Todo> {
    await this.todosAbilityService.todosAbility(createTodoDto, Action.Create)
    return await this.todosService.create(createTodoDto);
  }

  @Get()
  async findAll(): Promise<Todo[]> {
    await this.todosAbilityService.todosAbility(new Todo, Action.Read)
    return await this.todosService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Todo> {
    await this.todosAbilityService.todosAbility(new Todo, Action.Read)
    return await this.todosService.findOne(id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateTodoDto: UpdateTodoDto): Promise<Todo> {
    await this.todosAbilityService.todosAbility(updateTodoDto, Action.Update)
    return await this.todosService.update(id, updateTodoDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.todosAbilityService.todosAbility(new Todo, Action.Delete)
    return await this.todosService.remove(id);
  }
}
