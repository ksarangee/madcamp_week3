// dto/evaluate-pronunciation.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';

export class EvaluatePronunciationDto {
  @IsNotEmpty()
  @IsString()
  audioData: string;

  @IsNotEmpty()
  @IsString()
  script: string;
}
