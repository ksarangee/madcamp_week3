import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScriptController } from './script.controller';
import { ScriptService } from './script.service';
import { Script, ScriptSchema } from 'src/schemas/Script.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Script.name, schema: ScriptSchema }]),
  ],
  controllers: [ScriptController],
  providers: [ScriptService],
})
export class ScriptModule {}
