import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

export enum ScriptLevel {
  Easy = 1,
  Hard = 2,
}

@Schema()
export class Script {
  @Prop({ unique: true, required: true }) //문제 대본 안겹치게, 필수
  content: string;

  @Prop({ required: true, enum: ScriptLevel }) //문제 레벨 필수
  level: ScriptLevel;
}

export const ScriptSchema = SchemaFactory.createForClass(Script); //returns schema
