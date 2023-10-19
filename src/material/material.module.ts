import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialResolver } from './material.resolver';

@Module({
  providers: [MaterialResolver, MaterialService],
})
export class MaterialModule {}
