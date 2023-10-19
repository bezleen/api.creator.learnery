import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { MaterialService } from './material.service';
import { CreateMaterialQuizInputDTO, CreateMaterialPerformanceTaskInputDTO, CreateMaterialWorksheetInputDTO } from './dto/create-material.input';

@Resolver('Material')
export class MaterialResolver {
  constructor(private readonly materialService: MaterialService) {}

  @Mutation('createMaterialQuiz')
  createQuiz(@Args('data') createMaterialQuizInput: CreateMaterialQuizInputDTO) {
    return this.materialService.createQuiz(createMaterialQuizInput);
  }

  @Mutation('createMaterialPerformanceTask')
  createPerformanceTask(@Args('data') createMaterialPerformanceTaskInput: CreateMaterialPerformanceTaskInputDTO) {
    return this.materialService.createPerformanceTask(createMaterialPerformanceTaskInput);
  }

  @Mutation('createMaterialWorksheet')
  createWorksheet(@Args('data') createMaterialWorksheetInput: CreateMaterialWorksheetInputDTO) {
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
