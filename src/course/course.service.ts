// import {
//   ConflictException,
//   ForbiddenException,
//   HttpException,
//   Injectable,
// } from '@nestjs/common'
// import { PrismaService } from '../prisma/prisma.service'
// import { Prisma } from '@prisma/client'
// import {
//   Course,
//   CourseDetailedOutline,
//   CourseOutline,
//   GeneratedCourseObjective,
//   GeneratedCourseTitle,
// } from '@src/graphql'
// import { OpenAIService } from '@ai/openai/openAIService'
// import { chatTitlePrompt } from '@src/course/dto/gen-title.ai.prompt'
// import { ConversationChain } from 'langchain/chains'
// import { ChatOpenAI } from 'langchain/chat_models'
// import NodeCache from 'node-cache'
// import { BufferMemory } from 'langchain/memory'
// import { chatDetailedOutlinePrompt } from '@/course/dto/gen-course-outline-detailed.ai.prompt'
// import { chatObjectivePrompt } from '@/course/dto/gen-course-objectives.ai.prompt'
// import { chatOutlinePrompt } from '@/course/dto/gen-course-outline.ai.prompt'

// // export const pubSub = new PubSub()
// // https://docs.nestjs.com/graphql/subscriptions#pubsub TODO: preferred approach

// @Injectable()
// export class CourseService {
//   private cache: NodeCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })
//   private chainCache: NodeCache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

//   constructor(
//     private readonly prisma: PrismaService,
//     private readonly openai: OpenAIService,
//   ) {}

//   getCourseChain(courseId: string): ConversationChain {
//     const chat = () =>
//       new ChatOpenAI({
//         temperature: 0,
//         verbose: true,
//         n: 1,
//         streaming: true,
//         modelName: 'gpt-3.5-turbo-16k', //FIXME: gpt-4 once we have paid billing
//       })
//     let chain: ConversationChain = this.chainCache.get(courseId)
//     if (!chain) {
//       chain = new ConversationChain({ llm: chat(), memory: new BufferMemory() })
//       this.chainCache.set(courseId, chain)
//     }
//     return chain
//   }

//   async create(data: Prisma.CourseUncheckedCreateInput) {
//     console.debug({ createCourse: data })

//     return this.prisma.course.create({
//       data: {
//         ...data,
//       },
//     })
//   }

//   findAll(where?: Prisma.CourseWhereInput) {
//     return this.prisma.course.findMany({
//       where,
//     })
//   }

//   findOne(where: Prisma.CourseWhereUniqueInput) {
//     return this.prisma.course.findUnique({
//       where,
//     })
//   }

//   async update(where: Prisma.CourseWhereUniqueInput, data: Prisma.CourseUpdateInput) {
//     let course: any
//     try {
//       course = await this.prisma.course.update({
//         where,
//         data: data,
//       })
//     } catch (e: any) {
//       console.error({ update: e, ctx: where }) //FIXME: exposes logic and stack trace to FE
//       if ('meta' in e) {
//         throw new ConflictException(e, e.meta)
//       }
//       throw new ConflictException(e, e)
//     }
//     // pubSub.publish(`course:${course.id}`, { course })
//     return course
//   }

//   remove(userId: string, id: string) {
//     return this.prisma.course.delete({
//       where: {
//         id: id,
//         creatorId: userId,
//       },
//     })
//   }

//   async createCourseTitle(userId: string, courseId: string) {
//     const course = await this.retrieveCourseForLLM(courseId, userId)
//     const { audience } = course

//     const templateVal = {
//       ...course,
//       content: 'Course',
//       /*aud: { not working tried aud["ageStart"] and aud["ageEnd"], level... nor is the dot notation
//         ...audience, //FIXME:
//       }*/
//       ageStart: audience.ageStart,
//       ageEnd: audience.ageEnd,
//       level: audience.level,
//       audienceDescription: audience.desc,
//     }

//     const getTitles = await this.openai.converseAI<[GeneratedCourseTitle]>(
//       chatTitlePrompt,
//       templateVal,
//       'genCourseTitle',
//     )

//     return getTitles as [GeneratedCourseTitle]
//   }

//   async createCourseObjective(userId: string, courseId: string) {
//     const course = await this.retrieveCourseForLLM(courseId, userId)

//     if (!course.title) {
//       throw new HttpException('Course Title not found', 404)
//     }

//     const templateVal = {
//       title: course.title,
//     }
//     const getObjectives = await this.openai.converseAI<[GeneratedCourseObjective]>(
//       chatObjectivePrompt,
//       templateVal,
//       'genCourseObjectives',
//     )

//     setTimeout(async () => {
//       if (!getObjectives) {
//         return
//       }

//       const objectives = getObjectives.map(({ objective, outcome }) => {
//         return objective
//       })
//       await this.update({ id: courseId }, { objective: objectives })
//     }, 50)

//     return getObjectives as [GeneratedCourseObjective]
//   }

//   async createCourseOutline(userId: string, courseId: string) {
//     const course = await this.retrieveCourseForLLM(courseId, userId)

//     const templateVal = {
//       ...course,
//       audience: JSON.stringify(course.audience),
//     }

//     let getOutline = await this.openai.converseAI<CourseOutline>(
//       chatOutlinePrompt,
//       templateVal,
//       'genCourseOutline',
//     )

//     setTimeout(async () => {
//       if (!getOutline) {
//         return
//       }
//       await this.update({ id: courseId }, { outline: getOutline })
//     }, 200)

//     return getOutline as CourseOutline
//   }

//   async createCourseDetailedOutline(userId: string, courseId: string) {
//     const course = await this.retrieveCourseForLLM(courseId, userId)
//     delete course['detailedOutline']
//     const templateVal = {
//       course: JSON.stringify(course),
//       audience: JSON.stringify(course.audience),
//     }

//     let getDetailedOutline = await this.openai.converseAI(
//       await chatDetailedOutlinePrompt(),
//       templateVal,
//       'genCourseDetailedOutline',
//     )

//     setTimeout(async () => {
//       await this.update({ id: courseId }, { detailedOutline: getDetailedOutline })
//     }, 100)
//     return getDetailedOutline as CourseDetailedOutline
//   }

//   private async retrieveCourseForLLM(courseId: string, userId: string) {
//     /*let course: any = this.cache.get(key)
//     if (!course) {
//       course = await this.findOne({
//         id: courseId,
//       })
//     }
//     this.cache.set(key, course)*/
//     const course = await this.findOne({ id: courseId })

//     if (!course) {
//       throw new HttpException('Course not found', 404)
//     }

//     if (course.creatorId != userId) {
//       throw new ForbiddenException("Course doesn't belong to you")
//     }

//     return course
//   }
// }

// //https://python.langchain.com/docs/modules/chains/foundational/sequential_chains
