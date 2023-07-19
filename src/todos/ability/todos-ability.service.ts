import { ForbiddenError } from "@casl/ability";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { CaslAbilityFactory } from "../../casl/casl-ability.factory/casl-ability.factory";
import { Action } from "../../casl/enum/action.enum";

@Injectable()
export class TodosAbilityService {
  constructor(private readonly caslAbilityFactory: CaslAbilityFactory) {}
  async todosAbility(types: any, action: Action) {
    const ability = this.caslAbilityFactory.createForTodo(types);
    try {
      ForbiddenError
        .from(ability)
        .throwUnlessCan(action, 'all')
    } catch (error) {
      if (error instanceof ForbiddenError) {
        throw new ForbiddenException({ message: error.message })
      }
    }
  }
}