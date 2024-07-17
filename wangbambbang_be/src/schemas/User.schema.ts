import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type UserDocument = User & Document;

@Schema()
export class User {
  @Prop({ unique: true, required: true }) // 유저네임 안겹치게, 점수 저장시 유저네임 필수
  username: string;

  @Prop({ required: true }) // 점수 저장시 필수
  score: number;

  @Prop({ default: () => new Date().toISOString().split('T')[0] }) // 자동으로 현재 날짜 저장 (시간 제외)
  createdAt: string; // 날짜만 저장 (string 타입)
}

export const UserSchema = SchemaFactory.createForClass(User);

// Mongoose pre hook to format the createdAt field before saving
UserSchema.pre<UserDocument>('save', function (next) {
  this.createdAt = new Date().toISOString().split('T')[0];
  next();
});
