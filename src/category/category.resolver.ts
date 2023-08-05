import { Query, Resolver } from '@nestjs/graphql'
import { CategoryController } from './category.controller'

@Resolver('Category')
export class CategoryResolver {
  constructor(private readonly categoryController: CategoryController) {}

  @Query('categories')
  findAll() {
    return this.categoryController.findAll()
  }
}
