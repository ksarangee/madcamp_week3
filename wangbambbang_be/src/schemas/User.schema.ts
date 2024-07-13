import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User {
  @Prop({ unique: true, required: true }) //유저네임 안겹치게, 점수 저장시 유저네임 필수
  username: string;

  @Prop({ required: true }) //점수 저장시 필수
  score: number;

  @Prop({ default: Date.now }) //자동으로 현재 날짜와 시간 저장
  createdAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User); //returns schema
