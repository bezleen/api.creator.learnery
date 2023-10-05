import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PerformanceTaskService } from './performance-task.service';
import { CreatePerformanceTaskInput } from './dto/create-performance-task.input';
import { UpdatePerformanceTaskInput } from './dto/update-performance-task.input';

@Resolver('PerformanceTask')
export class PerformanceTaskResolver {
  constructor(private readonly performanceTaskService: PerformanceTaskService) {}

  @Mutation('createPerformanceTask')
  create(@Args('createPerformanceTaskInput') createPerformanceTaskInput: CreatePerformanceTaskInput) {
    return this.performanceTaskService.create(createPerformanceTaskInput);
  }

  @Query('performanceTask')
  findAll() {
    return this.performanceTaskService.findAll();
  }

  @Query('performanceTask')
  findOne(@Args('id') id: number) {
    return this.performanceTaskService.findOne(id);
  }

  @Mutation('updatePerformanceTask')
  update(@Args('updatePerformanceTaskInput') updatePerformanceTaskInput: UpdatePerformanceTaskInput) {
    return this.performanceTaskService.update(updatePerformanceTaskInput.id, updatePerformanceTaskInput);
  }

  @Mutation('removePerformanceTask')
  remove(@Args('id') id: number) {
    return this.performanceTaskService.remove(id);
  }
}
