// dto/save-score.dto.ts
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SaveScoreDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsNumber()
  score: number;
}
