import { Module } from '@nestjs/common';
import { TodosService } from './todos.service';
import { TodosController } from './todos.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Todo, TodoSchema } from './schemas/todo.schema';
import { CacheModule } from '@nestjs/cache-manager';
import { CaslModule } from 'src/casl/casl.module';
import { TodosAbilityService } from './ability/todos-ability.service';

@Module({
  imports: [
    MongooseModule.forFeature([{name: Todo.name, schema: TodoSchema}]),
    CacheModule.register(),
    CaslModule
  ],
  controllers: [TodosController],
  providers: [TodosService, TodosAbilityService]
})
export class TodosModule {}
