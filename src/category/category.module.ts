import { Module } from '@nestjs/common'
import { CategoryService } from './category.service'
import { CategoryController } from './category.controller'
import { CategoryResolver } from './category.resolver'

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, CategoryResolver, CategoryController],
})
export class CategoryModule {}
