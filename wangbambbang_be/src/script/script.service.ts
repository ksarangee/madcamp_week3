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
        //쉬운, 짧은 스크립트
        { content: '경찰청 쇠창살', level: ScriptLevel.Easy },
        { content: '홍천군청', level: ScriptLevel.Easy },
        { content: '챠프포프프', level: ScriptLevel.Easy },
        { content: '새우로얄뉴로얄', level: ScriptLevel.Easy },
        {
          content: '시골 찹쌀 챗찹쌀 도시 찹쌀 촌찹쌀',
          level: ScriptLevel.Easy,
        },
        //긴, 어려운 대본들
        {
          content: '저기 가는 저 상장사가 새 상 상장사냐 헌 상 상장사냐',
          level: ScriptLevel.Hard,
        },
        {
          content: '칠월칠일은 평창친구 친정 칠순 잔칫날',
          level: ScriptLevel.Hard,
        },
        { content: '신진 샹숑가수의 신춘 샹숑쇼우', level: ScriptLevel.Hard },
        {
          content: '서울특별시 특허허가과 허가과장 허과장',
          level: ScriptLevel.Hard,
        },
        {
          content: '청단풍잎 홍단풍잎 흑단풍잎 백단풍잎',
          level: ScriptLevel.Hard,
        },
      ]);
    }
  }
}
