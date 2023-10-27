import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MaterialService } from './material.service';
import { CreateQuizInputDTO, CreatePerformanceTaskInputDTO, CreateWorksheetInputDTO } from './dto/create-material.input';

@Resolver('Material')
export class MaterialResolver {
  constructor(private readonly materialService: MaterialService) {}

  @Mutation('createMaterialQuiz')
  createQuiz(@Args('data') createMaterialQuizInput: CreateQuizInputDTO) {
    return this.materialService.createQuiz(createMaterialQuizInput);
  }

  @Mutation('createMaterialPerformanceTask')
  createPerformanceTask(@Args('data') createMaterialPerformanceTaskInput: CreatePerformanceTaskInputDTO) {
    return this.materialService.createPerformanceTask(createMaterialPerformanceTaskInput);
  }

  @Mutation('createMaterialWorksheet')
  createWorksheet(@Args('data') createMaterialWorksheetInput: CreateWorksheetInputDTO) {
    return this.materialService.createWorksheet(createMaterialWorksheetInput);
  }

  @Query('materials')
  findAll() {
    return this.materialService.findAll();
  }

  @Query('material')
  findOne(@Args('id') id: string) {
    return this.materialService.findOne({id});
  }

  @Mutation('removeMaterial')
  remove(@Args('id') id: string) {
    return this.materialService.remove({id});
  }
}
