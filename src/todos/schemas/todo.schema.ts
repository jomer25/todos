import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type TodoDocument = HydratedDocument<Todo>

@Schema({ timestamps: true })
export class Todo {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ default: true, required: true })
  isAdmin: boolean;
}

export const TodoSchema = SchemaFactory.createForClass<Todo>(Todo);