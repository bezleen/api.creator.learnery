import { Resolver, Query, Mutation, Args } from '@nestjs/graphql'
import { MaterialService } from './material.service'
import {
  CreateQuizInputDTO,
  CreatePerformanceTaskInputDTO,
  CreateWorksheetInputDTO,
} from './dto/create-material.input'
import { MaterialType } from '@prisma/client'
<<<<<<< HEAD
=======
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@/auth/guard/jwt.guard'
import { GetUserGraphql } from '@/auth/decorator/get-user.decorator'
>>>>>>> feature/authenticate

@UseGuards(GqlAuthGuard)
@Resolver('Material')
export class MaterialResolver {
  constructor(private readonly materialService: MaterialService) {}

  @Mutation('createMaterialQuiz')
<<<<<<< HEAD
  createQuiz(@Args('data') createMaterialQuizInput: CreateQuizInputDTO) {
    return this.materialService.createQuiz(createMaterialQuizInput)
=======
  createQuiz(
    @GetUserGraphql('id') userId: string,
    @Args('data') createMaterialQuizInput: CreateQuizInputDTO,
  ) {
    return this.materialService.createQuiz(createMaterialQuizInput, userId)
>>>>>>> feature/authenticate
  }

  @Mutation('createMaterialPerformanceTask')
  createPerformanceTask(
<<<<<<< HEAD
    @Args('data') createMaterialPerformanceTaskInput: CreatePerformanceTaskInputDTO,
  ) {
    return this.materialService.createPerformanceTask(createMaterialPerformanceTaskInput)
  }

  @Mutation('createMaterialWorksheet')
  createWorksheet(@Args('data') createMaterialWorksheetInput: CreateWorksheetInputDTO) {
    return this.materialService.createWorksheet(createMaterialWorksheetInput)
  }

  @Query('materials')
  findAll() {
    return this.materialService.findAll()
  }

  @Query('material')
  findOne(@Args('id') id: string) {
    return this.materialService.findOne({ id })
  }

  @Mutation('removeMaterial')
  remove(@Args('id') id: string) {
    return this.materialService.remove({ id })
  }

  @Query('materialsIsGeneratedPDF')
  findAllMaterialIsGeneratedPDF(@Args('type') type: MaterialType) {
    return this.materialService.findAllMaterialIsGeneratedPDF(type)
=======
    @GetUserGraphql('id') userId: string,
    @Args('data') createMaterialPerformanceTaskInput: CreatePerformanceTaskInputDTO,
  ) {
    return this.materialService.createPerformanceTask(
      createMaterialPerformanceTaskInput,
      userId,
    )
  }

  @Mutation('createMaterialWorksheet')
  createWorksheet(
    @GetUserGraphql('id') userId: string,
    @Args('data') createMaterialWorksheetInput: CreateWorksheetInputDTO,
  ) {
    return this.materialService.createWorksheet(createMaterialWorksheetInput, userId)
  }

  @Query('materials')
  findAll(@GetUserGraphql('id') userId: string) {
    return this.materialService.findAll({ userId })
  }

  @Query('material')
  findOne(@GetUserGraphql('id') userId: string, @Args('id') id: string) {
    return this.materialService.findOne({ id, userId })
  }

  @Mutation('removeMaterial')
  remove(@GetUserGraphql('id') userId: string, @Args('id') id: string) {
    return this.materialService.remove({ id, userId })
  }

  @Query('materialsIsGeneratedPDF')
  findAllMaterialIsGeneratedPDF(
    @GetUserGraphql('id') userId: string,
    @Args('type') type: MaterialType,
  ) {
    return this.materialService.findAllMaterialIsGeneratedPDF(type, userId)
>>>>>>> feature/authenticate
  }
}
