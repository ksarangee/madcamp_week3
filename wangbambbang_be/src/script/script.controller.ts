import { Controller, Get, Param } from '@nestjs/common';
import { ScriptService } from './script.service';
import { Script } from 'src/schemas/Script.schema';

@Controller('scripts')
export class ScriptController {
  constructor(private readonly scriptService: ScriptService) {}

  @Get()
  async findAll(): Promise<Script[]> {
    return this.scriptService.findAll();
  }

  @Get(':level')
  async findByLevel(@Param('level') level: number): Promise<Script[]> {
    return this.scriptService.findByLevel(level);
  }
}
