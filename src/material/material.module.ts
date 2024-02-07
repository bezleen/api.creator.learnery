import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialResolver } from './material.resolver';
import { MaterialController } from './material.controller';

@Module({
  controllers: [MaterialController],
  providers: [MaterialResolver, MaterialService],
})
export class MaterialModule {}
