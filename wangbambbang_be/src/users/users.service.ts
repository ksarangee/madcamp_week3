import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from 'src/schemas/User.schema';
import { CreateUserDto } from './dto/CreateUser.dto';
import { SaveScoreDto } from './dto/SaveScore.dto';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as ffmpeg from 'fluent-ffmpeg';

ffmpeg.setFfmpegPath(
  'C:/Users/user/Downloads/ffmpeg-2024-07-10-git-1a86a7a48d-full_build/bin/ffmpeg.exe',
);

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

  // Function to compress audio and convert to base64
  private async compressAudio(
    inputFilePath: string,
    outputFilePath: string,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      ffmpeg(inputFilePath)
        .output(outputFilePath)
        .audioCodec('aac')
        .audioBitrate('64k')
        .on('end', () => {
          console.log('Audio compression finished.');
          resolve();
        })
        .on('error', (error) => {
          console.error('Error compressing audio:', error);
          reject(error);
        })
        .run();
    });
  }

  private async encodeAudioToBase64(audioFilePath: string): Promise<string> {
    const audioData = fs.readFileSync(audioFilePath);
    return audioData.toString('base64');
  }

  async evaluatePronunciation(audioFile: Buffer, script: string) {
    const accessKey = 'eb836333-d3fc-4fe1-ba18-d15dbf05d29d';
    const languageCode = 'korean';
    const openApiURL = 'http://aiopen.etri.re.kr:8000/WiseASR/Pronunciation';

    // Create a temporary file for the audio input
    const tempInputPath = path.join(__dirname, 'temp_audio.aac');
    const tempOutputPath = path.join(__dirname, 'compressed_audio.aac');

    // Save the audio buffer to a temporary file
    fs.writeFileSync(tempInputPath, audioFile);

    try {
      // Compress the audio file
      await this.compressAudio(tempInputPath, tempOutputPath);

      // Convert the compressed audio file to base64
      const audioData = await this.encodeAudioToBase64(tempOutputPath);

      const requestJson = {
        argument: {
          language_code: languageCode,
          script: script,
          audio: audioData,
        },
      };

      const options = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: accessKey,
        },
        timeout: 300000, // 타임아웃 설정
      };

      const response = await axios.post(openApiURL, requestJson, options);
      const score = response.data.return_object.score; // Assuming the score is in this field
      return { score };
    } catch (error) {
      console.error('Error evaluating pronunciation:', error);
      throw error;
    } finally {
      // Clean up temporary files if they exist
      if (fs.existsSync(tempInputPath)) {
        fs.unlinkSync(tempInputPath);
      }
      if (fs.existsSync(tempOutputPath)) {
        fs.unlinkSync(tempOutputPath);
      }
    }
  }

  async saveScore(saveScoreDto: SaveScoreDto) {
    const newUser = new this.userModel(saveScoreDto);
    return newUser.save();
  }
}
