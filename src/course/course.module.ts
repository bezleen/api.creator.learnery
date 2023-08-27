import { Module } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseResolver } from './course.resolver'
import { OpenAIService } from '@ai/openai/openAIService'

@Module({
  providers: [CourseResolver, CourseService, OpenAIService],
})
export class CourseModule {}
