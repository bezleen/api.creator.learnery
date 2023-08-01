import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { CourseService } from './course.service'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'

@Resolver('Course')
export class CourseResolver {
  constructor(private readonly courseService: CourseService) {}

  @Mutation('createCourse')
  create(@Args('createCourseInput') createCourseInput: CreateCourseInput) {
    return this.courseService.create(createCourseInput)
  }

  @Query('course')
  findAll() {
    return this.courseService.findAll()
  }

  @Query('course')
  findOne(@Args('id') id: number) {
    return this.courseService.findOne(id)
  }

  @Mutation('updateCourse')
  update(@Args('updateCourseInput') updateCourseInput: UpdateCourseInput) {
    return this.courseService.update(updateCourseInput.id, updateCourseInput)
  }

  @Mutation('removeCourse')
  remove(@Args('id') id: number) {
    return this.courseService.remove(id)
  }
}
