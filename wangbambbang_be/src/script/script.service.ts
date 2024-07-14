import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Script, ScriptLevel } from 'src/schemas/Script.schema';

@Injectable()
export class ScriptService {
  constructor(@InjectModel(Script.name) private scriptModel: Model<Script>) {}

  async findAll(): Promise<Script[]> {
    return this.scriptModel.find().exec();
  }

  async findByLevel(level: number): Promise<Script[]> {
    return this.scriptModel.find({ level }).exec();
  }

  async onModuleInit() {
    const count = await this.scriptModel.countDocuments();
    if (count === 0) {
      await this.scriptModel.insertMany([
        //쉬운 스크립트
        { content: '맑다', level: ScriptLevel.Easy },
        { content: '넓다', level: ScriptLevel.Easy },
        { content: '끝을', level: ScriptLevel.Easy },
        { content: '볶음밥', level: ScriptLevel.Easy },
        { content: '일요일', level: ScriptLevel.Easy },
        //어려운 대본들
        {
          content: '담임',
          level: ScriptLevel.Hard,
        },
        {
          content: '닭이',
          level: ScriptLevel.Hard,
        },
        { content: '읊다', level: ScriptLevel.Hard },
        {
          content: '여덟은',
          level: ScriptLevel.Hard,
        },
        {
          content: '흙에서',
          level: ScriptLevel.Hard,
        },
        {
          content: '무릎에',
          level: ScriptLevel.Hard,
        },
      ]);
    }
  }
}
