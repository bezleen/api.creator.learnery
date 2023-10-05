import { CreatePerformanceTaskInput } from './create-performance-task.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdatePerformanceTaskInput extends PartialType(CreatePerformanceTaskInput) {
  id: number;
}
