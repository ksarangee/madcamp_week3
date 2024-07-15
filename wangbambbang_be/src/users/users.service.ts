// users.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { SaveScoreDto } from './dto/SaveScore.dto';
import axios from 'axios';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  // Methods to interact with database
  createUser(createUserDto: CreateUserDto) {
    const newUser = new this.userModel(createUserDto);
    return newUser.save(); // Save user to db
  }

  getUser() {
    return this.userModel.find();
  }

  async evaluatePronunciation(audioData: string, script: string) {
    const accessKey = 'eb836333-d3fc-4fe1-ba18-d15dbf05d29d';
    const languageCode = 'korean';
    const openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/PronunciationKor';

    const requestJson = {
      argument: {
        language_code: languageCode,
        script: script,
        audio: audioData,
      },
    };

    const options = {
      headers: { 'Content-Type': 'application/json', Authorization: accessKey },
      timeout: 120000, // 타임아웃 설정 (2분)
    };

    console.log('Sending request to ETRI API:', openApiURL);
    console.log('Request JSON:', JSON.stringify(requestJson));
    console.log('Request Headers:', options);

    try {
      const response = await this.retryRequest(
        () => axios.post(openApiURL, requestJson, options),
        3,
      );
      console.log('Response from ETRI API:', response.data);

      const score = response.data.return_object.score; // score is in this field
      return { score };
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      throw error;
    }
  }

  // Retry logic for handling request failures
  async retryRequest(fn, retries) {
    let lastError;
    for (let i = 0; i < retries; i++) {
      try {
        return await fn();
      } catch (error) {
        lastError = error;
        console.error(`Retry ${i + 1} failed:`, error);
        if (error.code !== 'ECONNABORTED') {
          break; // 다른 오류 코드가 발생하면 재시도 중단
        }
      }
    }
    throw lastError;
  }

  async saveScore(saveScoreDto: SaveScoreDto) {
    const newUser = new this.userModel(saveScoreDto);
    return newUser.save();
  }

  // createdAt 비교해서 다르면 db에서 delete all users (새로운 랭킹차트 보여줘야 하니깐)
  async deleteAllUsers() {
    return this.userModel.deleteMany({});
  }
}
