import { Module } from '@nestjs/common'
import { CourseService } from './course.service'
import { CourseResolver } from './course.resolver'
import { OpenAIService } from '@ai/openai/openAIService'
import { AudienceService } from '@src/audience/audience.service'

@Module({
  providers: [CourseResolver, CourseService, OpenAIService, AudienceService],
})
export class CourseModule {}
