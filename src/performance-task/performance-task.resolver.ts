import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { PerformanceTaskService } from './performance-task.service';
import { CreatePerformanceTaskInputDTO } from './dto/create-performance-task.input';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '@/auth/guard';
import { GetUserGraphql } from '@/auth/decorator';
import { UpdatePerformanceTaskInputDTO } from './dto/update-performance-task.input';

@Resolver('PerformanceTask')
export class PerformanceTaskResolver {
  constructor(private readonly performanceTaskService: PerformanceTaskService) { }

  @Mutation('createPerformanceTask')
  create(
    @Args('data') createPerformanceTaskInput: CreatePerformanceTaskInputDTO
  ) {
    return this.performanceTaskService.create(createPerformanceTaskInput);
  }

  @Query('performanceTasks')
  findAll() {
    return this.performanceTaskService.findAll();
  }

  @Query('performanceTask')
  findOne(@Args('id') id: string) {
    return this.performanceTaskService.findOne({id});
  }

  @Mutation('updatePerformanceTask')
  async update(@Args('id') id: string, @Args('data') updatePerformanceTaskInput: UpdatePerformanceTaskInputDTO) {
    const UpdatePerformanceTask = await this.performanceTaskService.update({id}, updatePerformanceTaskInput);
    return UpdatePerformanceTask
  }

  @Mutation('removePerformanceTask')
  remove(@Args('id') id: string) {
    return this.performanceTaskService.remove({id});
  }
}
