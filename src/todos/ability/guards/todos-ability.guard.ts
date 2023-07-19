import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { key, roles } from "../decorators/todos-ability.decorator";
import { Todo } from "../../schemas/todo.schema";
import { CaslAbilityFactory } from "../../../casl/casl-ability.factory/casl-ability.factory";
import { ForbiddenError } from "@casl/ability";

@Injectable()
export class TodosAbilityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly caslAbilityFactory: CaslAbilityFactory,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requirements = this.reflector.getAllAndOverride<roles[]>(key, [
      context.getClass(),
      context.getHandler()
    ])

    if (requirements) {
      const todos: Todo = { title: 'Todo', content: 'My Content', isAdmin: true }
      const ability = await this.caslAbilityFactory.createForTodo(todos)

      try {
        requirements.forEach(required =>
          ForbiddenError
            .from(ability)
            .throwUnlessCan(required.action, required.subjects)  
        )
        return true;
      } catch (error) {
        if (error instanceof ForbiddenError) {
          throw new ForbiddenException({ message: error.message })
        }
      }
    }
    return false;
  }
}