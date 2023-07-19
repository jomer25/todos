import { Test, TestingModule } from "@nestjs/testing";
import { TodosController } from "./todos.controller";
import { TodosService } from "./todos.service";
import { MongooseModule } from "@nestjs/mongoose";
import { CacheModule } from "@nestjs/cache-manager";
import { CaslModule } from "../casl/casl.module";
import { TodosAbilityService } from "./ability/todos-ability.service";
import { Todo } from "./schemas/todo.schema";

describe('TodosController', () => {
  let controller: TodosController;
  let mockTodosService: Partial<TodosService>;

  beforeEach(async () => {
    mockTodosService = {
      create: jest.fn((createTodo: Todo) => Promise.resolve(createTodo)),
      findAll: jest.fn(() => Promise.resolve([])),
      findOne: jest.fn((id: string) => Promise.resolve(id as unknown as Todo)),
      update: jest.fn((id: string, updateDto: Todo) => Promise.resolve({ id, ...updateDto })),
      remove: jest.fn((id: string) => Promise.resolve())
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature(),
        CacheModule.register(),
        CaslModule
      ],
      controllers: [TodosController],
      providers: [
        { provide: TodosService, useValue: mockTodosService },
        TodosAbilityService
      ]
    }).compile();

    controller = module.get<TodosController>(TodosController);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create new todo', async () => {
      const createdTodo: Todo = { title: 'created todo', content: 'created content', isAdmin: true };
      const todo = await controller.create(createdTodo);

      expect(todo).toEqual(createdTodo);
    });
  });

  describe('findAll', () => {
    it('should return todos', async () => {
      const todos = await controller.findAll();

      expect(todos).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return todo', async () => {
      const id = 'id';
      const todo = await controller.findOne(id);

      expect(todo).toEqual(id);
    });
  });

  describe('update', () => {
    it('should update todo', async () => {
      const id = 'id';
      const updatedTodo: Todo = { title: 'updated todo', content: 'updated content', isAdmin: true };
      const todo = await controller.update(id, updatedTodo);

      expect(todo).toEqual({ id, ...updatedTodo })
    });
  });

  describe('remove', () => {
    it('should remove todo', async () => {
      const id = 'id';
      const todo = await controller.remove(id);

      expect(todo).toBeUndefined();
    });
  });
});
