import { ConflictException, ForbiddenException, HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import {
  Course,
  CourseDetailedOutline,
  CourseOutline,
  GeneratedCourseObjective,
  GeneratedCourseTitle,
} from '@src/graphql'
import { OpenAIService } from '@ai/openai/openAIService'
import { GenTitlePrompt, InstructionGenTitle } from '@src/course/dto/gen-title.ai.prompt'
import { AudienceService } from '@src/audience/audience.service'
import { LLMChain } from 'langchain/chains'
import { ChatOpenAI } from 'langchain/chat_models'
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from 'langchain/prompts'
import { GenObjectivePrompt, InstructionGenObjective } from '@src/course/dto/gen-course-objectives.ai.prompt'
import { GenOutlinePrompt, InstructionGenOutline } from '@src/course/dto/gen-course-outline.ai.prompt'
import NodeCache from 'node-cache'
import {
  GenDetailedOutlinePrompt,
  InstructionGenDetailedOutline,
} from '@/course/dto/gen-course-outline-detailed.ai.prompt'

// export const pubSub = new PubSub()
// https://docs.nestjs.com/graphql/subscriptions#pubsub TODO: preferred approach

@Injectable()
export class CourseService {
  private createTitleChain: LLMChain
  private createObjectiveChain: LLMChain //FIXME: can be made a class variable
  private createOutlineChain: LLMChain<string, ChatOpenAI>
  private createDetailedOutlineChain: LLMChain<string, ChatOpenAI>
  private cache: NodeCache

  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAIService,
    private readonly audienceService: AudienceService,
  ) {
    const chat = () => new ChatOpenAI({
      temperature: 0, verbose:true, n:1,streaming: true,
      modelName: 'gpt-3.5-turbo-16k'//FIXME: gpt-4
    }) //or this.openai TODO:
    const chatTitlePrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(GenTitlePrompt.template),
      HumanMessagePromptTemplate.fromTemplate(InstructionGenTitle),
    ])
    const chatObjectivePrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(GenObjectivePrompt.template),
      HumanMessagePromptTemplate.fromTemplate(InstructionGenObjective),
    ])
    const chatOutlinePrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(GenOutlinePrompt.template),
      HumanMessagePromptTemplate.fromTemplate(InstructionGenOutline),
    ])
    const chatDetailedOutlinePrompt = ChatPromptTemplate.fromPromptMessages([
      SystemMessagePromptTemplate.fromTemplate(GenDetailedOutlinePrompt.template),
      HumanMessagePromptTemplate.fromTemplate(InstructionGenDetailedOutline),
    ])

    /*FIXME: this is just PoC fails in scale. When there are concurrent queries fails easily*/
    this.createTitleChain = new LLMChain({ llm: chat(), prompt: chatTitlePrompt })
    this.createObjectiveChain = new LLMChain({ llm: chat(), prompt: chatObjectivePrompt }) //FIXME: it bettor to use a different connection
    const createOutlineChain = new LLMChain({ llm: chat(), prompt: chatOutlinePrompt }) //FIXME: it bettor to use a different connection

    this.createOutlineChain = createOutlineChain
    this.createDetailedOutlineChain = new LLMChain({
      llm: chat(),
      prompt: chatDetailedOutlinePrompt,
    })

    this.cache = new NodeCache({ stdTTL: 0, checkperiod: 0 })

    // TODO: integrate pineconeDB
  }

  async create(data: Prisma.CourseUncheckedCreateInput) {
    console.debug({ createCourse: data })
    const audience = await this.audienceService.findOne({ id: data.audienceId })
    if (!audience) {
      throw new HttpException('Audience not found', 404)
    }
    return this.prisma.course.create({
      data: {
        ...data,
      },
    })
  }

  findAll(where?: Prisma.CourseWhereInput) {
    return this.prisma.course.findMany({
      where,
    })
  }

  findOne(where: Prisma.CourseWhereUniqueInput) {
    return this.prisma.course.findUnique({
      where,
    })
  }

  async update(where: Prisma.CourseWhereUniqueInput, data: Prisma.CourseUpdateInput) {
    let course: any
    try {
      course = await this.prisma.course.update({
        where,
        data: data,
      })
    } catch (e) {
      console.error({ update: e, ctx: where }) //FIXME: exposes logic and stack trace to FE
      throw new ConflictException(e, e['meta'])
    }
    // pubSub.publish(`course:${course.id}`, { course })
    return course
  }

  remove(userId: string, id: string) {
    return this.prisma.course.delete({
      where: {
        id: id,
        creatorId: userId,
      },
    })
  }

  async createCourseTitle(userId: string, courseId:string) {

    const course = await this.findOne({
      id: courseId,
    })
    if (!course) {
      throw new HttpException('Course not found', 404)
    }
    if (course.creatorId != userId) {
      throw new ForbiddenException("Course doesn't belong to you")
    }

    const audience = await this.audienceService.findOne({ id: course.audienceId })
    if (!audience) {
      throw new HttpException('Audience not found', 404)
    }

    console.log({ course, audience })

    const templateVal = {
      ...course,
      content: 'Course',
      /*aud: { not working tried aud["ageStart"] and aud["ageEnd"], level... nor is the dot notation
        ...audience, //FIXME:
      }*/
      ageStart: audience.ageStart,
      ageEnd: audience.ageEnd,
      level: audience.level,
      audienceDescription: audience.desc,
    }
    const formattedPrompt = await GenTitlePrompt.format(templateVal)

    console.log({ formattedPrompt }) //FIXME comment once the flow is stable

    let getTitles = await this.createTitleChain.call(templateVal)

    // this.openai.call(`verify or convert to json format: ${GenTitleSample}`)

    // getTitles = getTitles.text.split("\n\n")
    console.log({ getTitles })

    getTitles = JSON.parse(getTitles.text)

    return getTitles as [GeneratedCourseTitle]
  }
  async createCourseObjective(userId: string, courseId:string) {

    const course = await this.findOne({
      id: courseId,
    })

    if (!course) {
      throw new HttpException('Course not found', 404)
    }
    if (course.creatorId != userId) {
      throw new ForbiddenException("Course doesn't belong to you")
    }

    if (course.title.trim() == '') {
      throw new HttpException('Course Title not found', 404)
    }

    const formattedPrompt = await GenObjectivePrompt.format({
      title: course.title,
    })

    console.log({ formattedPrompt })

    let getObjectives = await this.createObjectiveChain.call({
      title: course.title,
    })

    console.log({ getObjectives })

    getObjectives = JSON.parse(getObjectives.text)

    return getObjectives as [GeneratedCourseObjective]
  }
  async createCourseOutline(userId: string,courseId:string) {

    let course: any = this.cache.get(courseId) //FIXME: remove on release
    if (!course) {
      course = await this.findOne({
        id: courseId,
      })
    }
    this.cache.set(courseId, course)
    if (!course) {
      throw new HttpException('Course not found', 404)
    }
    if (course.creatorId != userId) {
      throw new ForbiddenException("Course doesn't belong to you")
    }

    const audience = await this.audienceService.findOne({ id: course.audienceId })
    if (!audience) {
      throw new HttpException('Audience not found', 404)
    }

    let getOutline = await this.createOutlineChain.call({
      ...course,
      audience: JSON.stringify(audience),
    })

    console.log({ getOutline })

    getOutline = JSON.parse(getOutline.text)

    setTimeout(async () => {
      if(!getOutline){
        return
      }
      await this.update({ id: courseId }, { outline: getOutline })
    }, 50)

    return getOutline as CourseOutline
  }
  async createCourseDetailedOutline(userId: string, courseId: string) {
    const key = `detailed-${courseId}` //FIXME: remove after dev
    let course: any = this.cache.get(key)
    if (!course) {
      course = await this.findOne({
        id: courseId,
      })
    }
    this.cache.set(key, course)
    if (!course) {
      throw new HttpException('Course not found', 404)
    }
    if (course.creatorId != userId) {
      throw new ForbiddenException("Course doesn't belong to you")
    }

    const audience = await this.audienceService.findOne({ id: course.audienceId })
    if (!audience) {
      throw new HttpException('Audience not found', 404)
    }

    delete course['detailedOutline']
    const promptValues = {
      course: JSON.stringify(course),
      audience: JSON.stringify(audience),
    }

    const formattedPrompt = await GenDetailedOutlinePrompt.format(promptValues)

    console.log({ formattedCourseDetailOutline: formattedPrompt })

    let getDetailedOutline = await this.createDetailedOutlineChain.call(promptValues)

    console.log({ getDetailedOutline })

    getDetailedOutline = JSON.parse(getDetailedOutline.text)

    // getDetailedOutline = getDetailedOutline['detailedOutline']

    if (getDetailedOutline.length == 0) {
      throw new HttpException('Course Outline not found', 404)
    }

    setTimeout(async () => {
      await this.update({ id: courseId }, { detailedOutline: getDetailedOutline })
    }, 100)
    return getDetailedOutline as CourseDetailedOutline
  }
}

//https://python.langchain.com/docs/modules/chains/foundational/sequential_chains
