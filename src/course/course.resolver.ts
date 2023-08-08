import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CourseService } from './course.service'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '../auth/guard'
import { GetUserGraphql } from '../auth/decorator'

@Resolver('Course')
@UseGuards(GqlAuthGuard)
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation('createCourse')
  create(
    @GetUserGraphql('userId') userId: string,
    @Args('data') createCourseInput: CreateCourseInput,
  ) {
    console.debug('creating course')
    return this.courseService.create({ ...createCourseInput, creatorId: userId })
  }

  @Query('courses')
  findAll(@GetUserGraphql('userId') userId: string) {
    return this.courseService.findAll({ creatorId: userId })
  }

  @Query('course')
  findOne(@Args('id') id: string, @GetUserGraphql('userId') userId: string) {
    return this.courseService.findOne({ id, creatorId: userId })
  }

  @Mutation('updateCourse')
  update(
    @GetUserGraphql('userId') userId: string,
    @Args('id') id: string,
    @Args('data') updateCourseInput: UpdateCourseInput,
  ) {
    return this.courseService.update({ id, creatorId: userId }, updateCourseInput)
  }

  @Mutation('deleteCourse')
  remove(@GetUserGraphql('userId') userId: string, @Args('id') id: string) {
    return this.courseService.remove(userId, id)
  }
}
