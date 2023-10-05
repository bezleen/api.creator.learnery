import { Module } from '@nestjs/common';
import { WorksheetService } from './worksheet.service';
import { WorksheetResolver } from './worksheet.resolver';

@Module({
  providers: [WorksheetResolver, WorksheetService],
})
export class WorksheetModule {}
