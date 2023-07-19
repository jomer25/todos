import { Todo } from "src/todos/schemas/todo.schema";
import { AbilityBuilder, ExtractSubjectType, InferSubjects, MongoAbility, createMongoAbility } from "@casl/ability";
import { Action } from "../enum/action.enum";

export type Subjects = InferSubjects<typeof Todo> | 'all';

export type AppAbility = MongoAbility<[Action, Subjects]>;

export class CaslAbilityFactory {
  createForTodo(todo: Todo) {
    const { can, cannot, build } = new AbilityBuilder<
      AppAbility
    >(createMongoAbility);

    if(todo.isAdmin) {
      can(Action.Manage, 'all')
    } else {
      can(Action.Read, 'all')
      can(Action.Update, 'all')
      can(Action.Delete, 'all')
    }

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>
    })
  }
}
