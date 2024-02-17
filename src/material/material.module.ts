import { Module } from '@nestjs/common';
import { MaterialService } from './material.service';
import { MaterialResolver } from './material.resolver';
import { MaterialController } from './material.controller';
import { StorageService } from './storage.service';

@Module({
  controllers: [MaterialController],
  providers: [MaterialResolver, MaterialService, StorageService],
})
export class MaterialModule {}
