import { SetMetadata } from "@nestjs/common";
import { Subjects } from "src/casl/casl-ability.factory/casl-ability.factory";
import { Action } from "src/casl/enum/action.enum";

export interface roles {
  action: Action;
  subjects: Subjects;
}

export const key = 'key'

export const TodosAbility = (...roles: roles[]) =>
  SetMetadata(key, roles)

export class Manage implements roles {
  action: Action.Manage;
  subjects: Subjects;
}