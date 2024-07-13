// dto/evaluate-pronunciation.dto.ts
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class EvaluatePronunciationDto {
  @IsOptional() // 필요시 Optional로 변경
  @Transform(({ value }) => value.buffer, { toClassOnly: true })
  audioFile: any;

  @IsNotEmpty()
  @IsString()
  script: string;
}
