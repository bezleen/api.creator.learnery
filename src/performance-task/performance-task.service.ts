import { Injectable } from '@nestjs/common';
import { CreatePerformanceTaskInput } from './dto/create-performance-task.input';
import { UpdatePerformanceTaskInput } from './dto/update-performance-task.input';

@Injectable()
export class PerformanceTaskService {
  create(createPerformanceTaskInput: CreatePerformanceTaskInput) {
    return 'This action adds a new performanceTask';
  }

  findAll() {
    return `This action returns all performanceTask`;
  }

  findOne(id: number) {
    return `This action returns a #${id} performanceTask`;
  }

  update(id: number, updatePerformanceTaskInput: UpdatePerformanceTaskInput) {
    return `This action updates a #${id} performanceTask`;
  }

  remove(id: number) {
    return `This action removes a #${id} performanceTask`;
  }
}
