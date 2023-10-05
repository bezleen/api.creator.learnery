import { Module } from '@nestjs/common';
import { PerformanceTaskService } from './performance-task.service';
import { PerformanceTaskResolver } from './performance-task.resolver';

@Module({
  providers: [PerformanceTaskResolver, PerformanceTaskService],
})
export class PerformanceTaskModule {}
