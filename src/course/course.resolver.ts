import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { CourseService } from './course.service'
import { CreateCourseInput } from './dto/create-course.input'
import { UpdateCourseInput } from './dto/update-course.input'
import { UseGuards } from '@nestjs/common'
import { GqlAuthGuard } from '@auth/guard'
import { GetUserGraphql } from '@auth/decorator'
import { Course } from '@src/graphql'
import { AudienceService } from '@/audience/audience.service'

@Resolver('Course')
@UseGuards(GqlAuthGuard)
export class CourseResolver {
  constructor(
    private readonly courseService: CourseService,
    private readonly audienceService: AudienceService,
  ) {}

  @Mutation('createCourse')
  create(
    @GetUserGraphql('userId') userId: string,
    @Args('data') createCourseInput: CreateCourseInput,
  ) {
    console.debug('creating course')
    return this.courseService.create({
      ...createCourseInput,
      creatorId: userId,
    })
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
  async update(
    @GetUserGraphql('userId') userId: string,
    @Args('id') id: string,
    @Args('data') updateCourseInput: UpdateCourseInput,
  ) {
    const updatedCourse = await this.courseService.update(
      { id, creatorId: userId },
      updateCourseInput,
    )
    return updatedCourse
  }

  @Mutation('deleteCourse')
  remove(@GetUserGraphql('userId') userId: string, @Args('id') id: string) {
    return this.courseService.remove(userId, id)
  }

  @Mutation('createCourseTitle')
  createCourseTitle(
    @GetUserGraphql('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    return this.courseService.createCourseTitle(userId, courseId)
  }

  @Mutation('createCourseObjective')
  createCourseObjective(
    @GetUserGraphql('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    return this.courseService.createCourseObjective(userId, courseId)
  }

  @Mutation('createCourseOutline')
  createCourseOutline(
    @GetUserGraphql('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    return this.courseService.createCourseOutline(userId, courseId)
  }

  @Mutation('createCourseDetailedOutline')
  createCourseDetailedOutline(
    @GetUserGraphql('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    return this.courseService.createCourseDetailedOutline(userId, courseId)
  }

  @ResolveField('audience')
  audience(@Parent() course: Course) {
    return this.audienceService.findOne({ id: course.audienceId })
  }

  // https://docs.nestjs.com/graphql/subscriptions
  /*@Subscription('courseUpdated', { //FIXME: affecting ai routes
    //FIXME: doesn't work
    // resolve: value => value,
    // filter: (payload, variables) =>
    //   payload.commentAdded.title === variables.title
  })
  async courseUpdated(
    @GetUserGraphql('userId') userId: string,
    @Args('courseId') courseId: string,
  ) {
    const course = await this.courseService.findOne({ id: courseId })
    if (!course) {
      throw new NotFoundException('Course not found')
    }
    if (course.creatorId !== userId) {
      throw new ForbiddenException('course not owned by you')
    }

    return pubSub.asyncIterator(`course:${courseId}`)
  }*/
}
