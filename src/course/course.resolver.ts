// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
// import { CourseService } from './course.service'
// import { CreateCourseInput } from './dto/create-course.input'
// import { UpdateCourseInput } from './dto/update-course.input'
// import { UseGuards } from '@nestjs/common'
// import { GqlAuthGuard } from '@auth/guard'
// import { GetUserGraphql } from '@auth/decorator'
// import { Course } from '@src/graphql'

// function validateCourse(course: Partial<Course>) {
//   console.debug('validating course')
//   const {
//     audience: { ageStart, ageEnd, level, desc },
//   } = course

//   if (ageStart >= ageEnd) {
//     throw new Error('ageStart cannot be greater or equal than ageEnd')
//   }
// }

// @Resolver('Course')
// @UseGuards(GqlAuthGuard)
// export class CourseResolver {
//   constructor(private readonly courseService: CourseService) {}

//   @Mutation('createCourse')
//   create(
//     @GetUserGraphql('userId') userId: string,
//     @Args('data') createCourseInput: CreateCourseInput,
//   ) {
//     console.debug('creating course')

//     validateCourse(createCourseInput)

//     return this.courseService.create({
//       ...createCourseInput,
//       creatorId: userId,
//     })
//   }

//   @Query('courses')
//   findAll(@GetUserGraphql('userId') userId: string) {
//     return this.courseService.findAll({ creatorId: userId })
//   }

//   @Query('course')
//   findOne(@Args('id') id: string, @GetUserGraphql('userId') userId: string) {
//     return this.courseService.findOne({ id, creatorId: userId })
//   }

//   @Mutation('updateCourse')
//   async update(
//     @GetUserGraphql('userId') userId: string,
//     @Args('id') id: string,
//     @Args('data') updateCourseInput: UpdateCourseInput,
//   ) {
//     const updatedCourse = await this.courseService.update(
//       { id, creatorId: userId },
//       updateCourseInput,
//     )
//     return updatedCourse
//   }

//   @Mutation('deleteCourse')
//   remove(@GetUserGraphql('userId') userId: string, @Args('id') id: string) {
//     return this.courseService.remove(userId, id)
//   }

//   @Mutation('createCourseTitle')
//   createCourseTitle(
//     @GetUserGraphql('userId') userId: string,
//     @Args('courseId') courseId: string,
//   ) {
//     return this.courseService.createCourseTitle(userId, courseId)
//   }

//   @Mutation('createCourseObjective')
//   createCourseObjective(
//     @GetUserGraphql('userId') userId: string,
//     @Args('courseId') courseId: string,
//   ) {
//     return this.courseService.createCourseObjective(userId, courseId)
//   }

//   @Mutation('createCourseOutline')
//   createCourseOutline(
//     @GetUserGraphql('userId') userId: string,
//     @Args('courseId') courseId: string,
//   ) {
//     return this.courseService.createCourseOutline(userId, courseId)
//   }

//   @Mutation('createCourseDetailedOutline')
//   createCourseDetailedOutline(
//     @GetUserGraphql('userId') userId: string,
//     @Args('courseId') courseId: string,
//   ) {
//     return this.courseService.createCourseDetailedOutline(userId, courseId)
//   }

//   // https://docs.nestjs.com/graphql/subscriptions
//   /*@Subscription('courseUpdated', { //FIXME: affecting ai routes
//     //FIXME: doesn't work
//     // resolve: value => value,
//     // filter: (payload, variables) =>
//     //   payload.commentAdded.title === variables.title
//   })
//   async courseUpdated(
//     @GetUserGraphql('userId') userId: string,
//     @Args('courseId') courseId: string,
//   ) {
//     const course = await this.courseService.findOne({ id: courseId })
//     if (!course) {
//       throw new NotFoundException('Course not found')
//     }
//     if (course.creatorId !== userId) {
//       throw new ForbiddenException('course not owned by you')
//     }

//     return pubSub.asyncIterator(`course:${courseId}`)
//   }*/
// }
