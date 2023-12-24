import { BadRequestException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { MaterialType } from '@prisma/client'
import axios from 'axios'
import {
  CreatePerformanceTaskInputDTO,
  CreateQuizInputDTO,
  CreateWorksheetInputDTO,
} from './dto/create-material.input'
import { marked } from 'marked'
import * as path from 'path'
import * as fs from 'fs'
import scopackager from 'simple-scorm-packager'
import PizZip from 'pizzip'
import Docxtemplater from 'docxtemplater'
import { Response } from 'express'
import * as libre from 'libreoffice-convert'
import { ConfigService } from '@nestjs/config'

// import { execSync } from 'child_process'

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createQuiz(data: CreateQuizInputDTO, userId: string) {
    if (Object.keys(data.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdQuiz = await this.prisma.material.create({
      data: {
        userId: userId,
        type: MaterialType.QUIZ,
        request: {
          quiz: data,
        },
        result: {},
      },
    })

    const payload_ai = {
      offer_id: createdQuiz.id,
      user_id: createdQuiz.userId,
    }

    try {
      const response = await axios.post(
        `${this.configService.get('DAEMON_GATEWAY_URL')}/v1/api/internal/material/quiz`,
        payload_ai,
      )

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }

    return createdQuiz
  }

  async createPerformanceTask(data: CreatePerformanceTaskInputDTO, userId: string) {
    // const regex = /^\s*(\d+)\s*.*/

    // if (!regex.test(data.timeActivity) ){
    //   throw new Error('Invalid time format!');
    // }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdPerformanceTask = await this.prisma.material.create({
      data: {
        userId: userId,
        type: MaterialType.PERFORMANCE_TASK,
        request: {
          performanceTask: data,
        },
        result: {},
      },
    })

    const payload_ai = {
      offer_id: createdPerformanceTask.id,
      user_id: createdPerformanceTask.userId,
    }

    try {
      const response = await axios.post(
        `${this.configService.get(
          'DAEMON_GATEWAY_URL',
        )}/v1/api/internal/material/performance-task`,
        payload_ai,
      )

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }

    return createdPerformanceTask
  }

  async createWorksheet(data: CreateWorksheetInputDTO, userId: string) {
    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }
    if (Object.keys(data.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    const createdWorksheet = await this.prisma.material.create({
      data: {
        userId: userId,
        type: MaterialType.WORKSHEET,
        request: {
          worksheet: data,
        },
        result: {},
      },
    })

    const payload_ai = {
      offer_id: createdWorksheet.id,
      user_id: createdWorksheet.userId,
    }

    try {
      const response = await axios.post(
        `${this.configService.get(
          'DAEMON_GATEWAY_URL',
        )}/v1/api/internal/material/worksheet`,
        payload_ai,
      )

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server')
      }
    } catch (error: any) {
      throw new Error(error.message)
    }

    return createdWorksheet
  }

  async findAll(where: Prisma.MaterialWhereInput) {
    return await this.prisma.material.findMany({
      where,
    })
  }

  async findOne(where: Prisma.MaterialWhereUniqueInput) {
    return await this.prisma.material.findUnique({
      where,
    })
  }

  async remove(where: Prisma.MaterialWhereUniqueInput) {
    return await this.prisma.material.delete({
      where,
    })
  }

  // async createScorm(id: string) {
  //   const material = await this.prisma.material.findUnique({
  //     where: {
  //       id
  //     }
  //   })

  //   this.createQuestion()

  //   // const rawResult = material.rawResult

  //   // const htmlContent = marked(rawResult);

  //   // const htmlFilePath = path.join(path.resolve(__dirname, '../../src/public/'), 'index.html')

  //   // fs.writeFile(htmlFilePath, htmlContent, (err) => {
  //   //   if (err) throw new Error(err.message)
  //   // })

  //   const folderOutputPath = path.resolve(__dirname, '../../src/output/')

  //   const config = {
  //     version: '1.2',
  //     organization: 'Learnery',
  //     title: material.type,
  //     language: material.request?.performanceTask?.language || material.request?.quiz?.language || material.request?.worksheet?.language || 'en-US',
  //     startingPage: 'index.html',
  //     source: path.resolve(__dirname, '../../src/public'),
  //     package: {
  //       version: process.env.npm_package_version,
  //       zip: true,
  //       author: material?.userId || 'bach',
  //       outputFolder: folderOutputPath,
  //       description: material.request?.performanceTask?.description || material.request?.worksheet?.description || material.request?.quiz?.description || '',
  //       keywords: ['scorm', 'test', 'course'],
  //       typicalDuration: 'PT0H5M0S',
  //       // rights: `©${new Date().getFullYear()} My Amazing Company. All right reserved.`,
  //       // vcard: {
  //       //   author: 'Firstname Lastname',
  //       //   org: 'My Amazing Company',
  //       //   tel: '(000) 000-0000',
  //       //   address: 'my address',
  //       //   mail: 'my@email.com',
  //       //   url: 'https://mydomain.com'
  //       // }
  //     }
  //   }

  //   await scopackager(config, (msg: string) => {
  //     console.log(msg)
  //   })

  //   return 'Create Success'
  // }

  // async createQuestion() {
  //   const questionsData = [
  //     {
  //       id: "com.scorm.golfsamples.interactions.playing_1",
  //       text: "The rules of golf are maintained by:'?",
  //       type: "choice",
  //       answers: ["The UN", "USGA and Royal and Ancient", "The PGA", "Each course has it's own rules"],
  //       correctAnswer: "USGA and Royal and Ancient",
  //       objectiveId: "obj_playing"
  //     },
  //     {
  //       id: "com.scorm.golfsamples.interactions.playing_1",
  //       text: "The rules of golf are maintained by:'?",
  //       type: "choice",
  //       answers: ["The UN", "USGA and Royal and Ancient", "The PGA", "Each course has it's own rules"],
  //       correctAnswer: "USGA and Royal and Ancient",
  //       objectiveId: "obj_playing"
  //     },
  //     {
  //       id: "com.scorm.golfsamples.interactions.playing_1",
  //       text: "The rules of golf are maintained by:'?",
  //       type: "choice",
  //       answers: ["The UN", "USGA and Royal and Ancient", "The PGA", "Each course has it's own rules"],
  //       correctAnswer: "USGA and Royal and Ancient",
  //       objectiveId: "obj_playing"
  //     },
  //     // Các câu hỏi khác từ database
  //   ];

  //   // Tạo nội dung cho file questions.js
  //   const jsCode = `
  // ${questionsData.map(question => `
  // test.AddQuestion(new Question("${question.id}",
  //                                 "${question.text}",
  //                                 "${question.type}",
  //                                 ${JSON.stringify(question.answers)},
  //                                 "${question.correctAnswer}",
  //                                 "${question.objectiveId}")
  //                 );
  // `).join('')}
  // `;

  //   // Ghi nội dung vào file questions.js
  //   fs.writeFileSync('/home/bach/Work-Project/api.creator.learnery/src/public/material/questions.js', jsCode);
  // }

  // doc2Pdf(docxPath, pdfPath) {
  //   execSync(`soffice --headless --convert-to pdf ${docxPath} --outdir ${pdfPath}`)
  // }

  async getPerformanceTaskPDF(id: string, res: Response, userId: string) {
    const material = await this.prisma.material
      .findUnique({
        where: {
          id,
          type: 'PERFORMANCE_TASK',
          userId,
        },
      })
      .catch((error: any) => {
        throw new Error(`Can not find any performance task with id: ${id}`)
      })

    if (!material) throw new Error(`Can not find any performance task with id: ${id}`)

    const materialResult: any = material.result
    const materialRequest: any = material.request

    const content = fs.readFileSync(
      path.resolve(__dirname, '../../static/templatePDF/performance_task_template.docx'),
      'binary',
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    doc.render({
      // subject: materialRequest.performanceTask.objectives,
      subject: 'Performance Task Objectives',
      level: materialRequest.performanceTask.audience.level,
      knowledgeKnot: 'Knowledge Knot',
      activityTitle: materialResult.performanceTask.result[0]?.content,
      goal: materialResult.performanceTask.result[1]?.content,
      role: materialResult.performanceTask.result[2]?.content,
      audience: materialResult.performanceTask.result[3]?.content,
      situation: materialResult.performanceTask.result[4]?.content,
      productPerformanceAndPurpose: materialResult.performanceTask.result[5]?.content,
      table: materialResult.performanceTask.result[6]?.content?.table,
      CriteriaName: (scope) => {
        return scope['Criteria Name'] || scope['Criteria name']
      },
      suggestedSampleAnswer: materialResult.performanceTask.result[7]?.content,
    })

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.docx`), buf)

    const file = fs.readFileSync(
      path.resolve(__dirname, `../../static/outputPDF/${id}.docx`),
    )

    await libre.convert(file, '.pdf', undefined, (err: any, done) => {
      if (err) {
        throw new Error(`Error converting file: ${err}`)
      }

      fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.pdf`), done)
    })

    await this.prisma.material.update({
      where: {
        id,
        type: 'PERFORMANCE_TASK',
      },
      data: {
        isGeneratedPDF: true,
      },
    })

    return {
      pdf: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.pdf`,
      docx: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.docx`,
    }
  }

  async findAllMaterialIsGeneratedPDF(type: MaterialType, userId: string) {
    const materials = await this.prisma.material.findMany({
      where: {
        userId: userId,
        type: type,
        isGeneratedPDF: true,
      },
      orderBy: {
        id: 'desc',
      },
    })

    if (!materials) throw new Error(`can not find any material with type ${type}`)

    return materials
  }

  async getWorksheetPDF(id: string, res: Response, userId: string) {
    const material = await this.prisma.material
      .findUnique({
        where: {
          id,
          type: 'WORKSHEET',
          userId,
        },
      })
      .catch((error: any) => {
        throw new Error(`Can not find any worksheet with id: ${id}`)
      })

    if (!material) throw new Error(`Can not find any worksheet with id: ${id}`)

    const materialResult: any = material.result
    const materialRequest: any = material.request

    const content = fs.readFileSync(
      path.resolve(__dirname, '../../static/templatePDF/worksheet_template.docx'),
      'binary',
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    const displayQuestionType = {
      MATCHING: 'Matching',
      TRUE_FALSE: 'True/False',
      MULTIPLE_CHOICE: 'Multiple choice',
      FILL_IN_THE_BLANK_WITH_OPTIONS: 'Fill in the blank (with options)',
      FILL_IN_THE_BLANK_FREE_TEXT: 'Fill in the blank (free text)',
      ESSAY: 'Essay',
    }

    const typeOfQuestions = materialResult.worksheet.result.key_answers.content
    const keyAnswersType = Object.keys(typeOfQuestions)
    let isEssayType = false
    let answersContentArray = []
    let currentType = ''

    doc.render({
      // subject: materialRequest.worksheet.objectives,
      subject: 'Worksheet Objectives',
      lesson: 'Worksheet Lesson',
      level: materialRequest.worksheet.audience.level,
      learningObjectives: materialResult.worksheet.result.chapter_1.content.replace(
        /[-#@!_\d]+$/g,
        '',
      ),
      questionTypes: materialResult.worksheet.result.chapter_2.content,
      isSingleQuestionType: () => {
        if (materialResult.worksheet.result.chapter_2.content.length <= 1) return true
        return false
      },
      questionTypeName: (scope) => {
        if (scope.part_type === 'ESSAY') {
          isEssayType = true
        } else {
          isEssayType = false
        }
        return `${scope.part_name.replace(/[=_*#]/gi, '')}`
      },
      instruction: (scope) => {
        if (scope.part_content_json.instruction.length <= 10) return ''
        return `${scope.part_content_json.instruction.replace(/[=_*#]/gi, '')}`
      },
      content: (scope) => {
        currentType = scope.part_type
        return scope.part_content_json.content
      },
      questionBloomTaxonomyIndex: (scope) => {
        try {
          return scope?.question?.question_index
            ? scope.question.question_index
            : scope.question_index
        } catch (error: any) {
          console.log('oke')

          throw new Error(error.message)
        }
      },
      questionBloomTaxonomy: (scope) => {
        try {
          if (scope?.question?.question_bloom_taxonomy)
            return scope.question.question_bloom_taxonomy
          if (scope?.question_bloom_taxonomy) return scope.question_bloom_taxonomy
          return ''
        } catch (error: any) {
          console.log('oke')
          throw new Error(error.message)
        }
      },
      questionContent: (scope) => {
        try {
          if (scope?.question?.question_content)
            return scope.question.question_content.replace(/[:=_*#]/gi, '').trim()
          if (scope?.question_content)
            return scope.question_content.replace(/[:=_*#]/gi, '').trim()
          return ''
        } catch (error: any) {
          console.log('oke')

          throw new Error(error.message)
        }
      },
      hasTextArea: () => {
        return isEssayType
      },
      options: (scope) => {
        if (currentType === 'TRUE_FALSE') {
          return {
            a: 'True',
            b: 'False',
          }
        }
        if ((!scope?.prompts_column || !scope?.answers_column) && !scope?.options) {
          return {}
        }
        return scope.options
      },
      optionContent: (scope) => {
        try {
          answersContentArray.push({ [currentType]: scope })
          let resultOptionContent = []
          for (const [key, value] of Object.entries(scope)) {
            resultOptionContent.push(`${key.toUpperCase()}. ${value}`)
          }
          return resultOptionContent
        } catch (error: any) {
          console.log('oke')

          throw new Error(error.message)
        }
      },
      promptsColumnMatching: (scope) => {
        try {
          // answersContentArray.push({ [currentType]: scope })
          let resultPromptsColumnMatching = []
          for (const [key, value] of Object.entries(scope?.prompts_column)) {
            resultPromptsColumnMatching.push(`${key.toUpperCase()}. ${value}`)
          }
          return resultPromptsColumnMatching
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      answersColumnMatching: (scope) => {
        try {
          // answersContentArray.push({ [currentType]: scope })
          let resultAnswersColumnMatching = []
          for (const [key, value] of Object.entries(scope?.answers_column)) {
            resultAnswersColumnMatching.push(`${key.toUpperCase()}. ${value}`)
          }
          return resultAnswersColumnMatching
        } catch (error: any) {
          throw new Error(error.message)
        }
      },
      keyAnswers: () => {
        answersContentArray = answersContentArray.reduce((accumulator, currentValue) => {
          const [key] = Object.keys(currentValue)
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(currentValue[key])
          return accumulator
        }, {})
        return Object.entries(materialResult.worksheet.result.key_answers.content_json)
      },
      keyAnswersType: (scope) => {
        return displayQuestionType[scope[0]]
      },
      answersContent: (scope) => {
        let resultAnswersContent = []
        const currentAnswersContentArray = answersContentArray[scope[0]]

        for (const [key, value] of Object.entries(scope[1])) {
          if (
            scope[0] === 'MULTIPLE_CHOICE' ||
            scope[0] === 'FILL_IN_THE_BLANK_WITH_OPTIONS'
          ) {
            const rightAnswer = currentAnswersContentArray[Number(key) - 1]

            resultAnswersContent.push(
              `${key}. ${value.toString().toUpperCase()}) ${
                rightAnswer[value.toString()]
              }`,
            )
          }
          if (scope[0] === 'ESSAY' || scope[0] === 'FILL_IN_THE_BLANK_FREE_TEXT') {
            resultAnswersContent.push(`${key}. ${value.toString()}`)
          }
          if (scope[0] === 'MATCHING') {
            let result = Object.entries(value)
              .map(([key, value]) => `${value.toString().toUpperCase()} - ${key}`)
              .join(', ')
            resultAnswersContent.push(`${key}. ${result}`)
          }
          if (scope[0] === 'TRUE_FALSE') {
            const lowerStr = value.toString().toLowerCase()
            if (lowerStr.startsWith('t')) {
              resultAnswersContent.push(`${key}. A) True`)
            }
            if (lowerStr.startsWith('f')) {
              resultAnswersContent.push(`${key}. B) False`)
            }
          }
        }
        return resultAnswersContent
      },
    })

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.docx`), buf)

    const file = fs.readFileSync(
      path.resolve(__dirname, `../../static/outputPDF/${id}.docx`),
    )

    await libre.convert(file, '.pdf', undefined, (err: any, done) => {
      if (err) {
        throw new Error(`Error converting file: ${err}`)
      }

      fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.pdf`), done)
    })

    await this.prisma.material.update({
      where: {
        id,
        type: 'WORKSHEET',
      },
      data: {
        isGeneratedPDF: true,
      },
    })

    return {
      pdf: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.pdf`,
      docx: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.docx`,
    }
  }

  async getQuizPDF(id: string, res: Response, userId: string) {
    const material = await this.prisma.material
      .findUnique({
        where: {
          id,
          type: 'QUIZ',
          userId,
        },
      })
      .catch((error: any) => {
        throw new Error(`Can not find any quiz with id: ${id}`)
      })

    if (!material) throw new Error(`Can not find any quiz with id: ${id}`)

    const materialResult: any = material.result
    const materialRequest: any = material.request

    const content = fs.readFileSync(
      path.resolve(__dirname, '../../static/templatePDF/quiz_template.docx'),
      'binary',
    )

    const zip = new PizZip(content)

    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    })

    const displayQuestionType = {
      MATCHING: 'Matching',
      TRUE_FALSE: 'True/False',
      MULTIPLE_CHOICE: 'Multiple choice',
      FILL_IN_THE_BLANK_WITH_OPTIONS: 'Fill in the blank (with options)',
      FILL_IN_THE_BLANK_FREE_TEXT: 'Fill in the blank (free text)',
      ESSAY: 'Essay',
    }

    const typeOfQuestions = materialResult.quiz.result.key_answers.content
    const keyAnswersType = Object.keys(typeOfQuestions)
    let isEssayType = false
    let answersContentArray = []
    let currentType = ''

    doc.render({
      // subject: materialRequest.quiz.objectives,
      subject: 'Quiz Objectives',
      grade: 'Quiz Grade',
      level: materialRequest.quiz.audience.level,
      questionTypes: materialResult.quiz.result.chapter_1.content,
      isSingleQuestionType: () => {
        if (materialResult.quiz.result.chapter_1.content.length <= 1) return true
        return false
      },
      questionTypeName: (scope) => {
        if (scope.part_type === 'ESSAY') {
          isEssayType = true
        } else {
          isEssayType = false
        }
        return `${scope.part_name.replace(/[=_*#]/gi, '')}`
      },
      instruction: (scope) => {
        if (scope.part_content_json.instruction.length <= 10) return ''
        return `${scope.part_content_json.instruction.replace(/[=_*#]/gi, '')}`
      },
      content: (scope) => {
        currentType = scope.part_type
        return scope.part_content_json.content
      },
      questionBloomTaxonomyIndex: (scope) => {
        return scope?.question?.question_index
          ? scope.question.question_index
          : scope.question_index
      },
      questionBloomTaxonomy: (scope) => {
        if (scope?.question?.question_bloom_taxonomy)
          return scope.question.question_bloom_taxonomy
        if (scope?.question_bloom_taxonomy) return scope.question_bloom_taxonomy
        return ''
      },
      questionContent: (scope) => {
        if (scope?.question?.question_content)
          return scope.question.question_content.replace(/[:=_*#]/gi, '').trim()
        if (scope?.question_content)
          return scope.question_content.replace(/[:=_*#]/gi, '').trim()
        return ''
      },
      hasTextArea: () => {
        return isEssayType
      },
      options: (scope) => {
        if (currentType === 'TRUE_FALSE') {
          return {
            a: 'True',
            b: 'False',
          }
        }
        if ((!scope?.prompts_column || !scope?.answers_column) && !scope?.options) {
          return {}
        }
        return scope.options
      },
      optionContent: (scope) => {
        answersContentArray.push({ [currentType]: scope })
        let resultOptionContent = []
        for (const [key, value] of Object.entries(scope)) {
          resultOptionContent.push(`${key.toUpperCase()}. ${value}`)
        }
        return resultOptionContent
      },
      promptsColumnMatching: (scope) => {
        // answersContentArray.push({ [currentType]: scope })
        let resultPromptsColumnMatching = []
        for (const [key, value] of Object.entries(scope.prompts_column)) {
          resultPromptsColumnMatching.push(`${key.toUpperCase()}. ${value}`)
        }
        return resultPromptsColumnMatching
      },
      answersColumnMatching: (scope) => {
        // answersContentArray.push({ [currentType]: scope })
        let resultAnswersColumnMatching = []
        for (const [key, value] of Object.entries(scope.answers_column)) {
          resultAnswersColumnMatching.push(`${key.toUpperCase()}. ${value}`)
        }
        return resultAnswersColumnMatching
      },
      keyAnswers: () => {
        answersContentArray = answersContentArray.reduce((accumulator, currentValue) => {
          const [key] = Object.keys(currentValue)
          if (!accumulator[key]) {
            accumulator[key] = []
          }
          accumulator[key].push(currentValue[key])
          return accumulator
        }, {})

        return Object.entries(materialResult.quiz.result.key_answers.content_json)
      },
      keyAnswersType: (scope) => {
        return displayQuestionType[scope[0]]
      },
      answersContent: (scope) => {
        let resultAnswersContent = []
        const currentAnswersContentArray = answersContentArray[scope[0]]

        for (const [key, value] of Object.entries(scope[1])) {
          if (
            scope[0] === 'MULTIPLE_CHOICE' ||
            scope[0] === 'FILL_IN_THE_BLANK_WITH_OPTIONS'
          ) {
            const rightAnswer = currentAnswersContentArray[Number(key) - 1]

            resultAnswersContent.push(
              `${key}. ${value.toString().toUpperCase()}) ${
                rightAnswer[value.toString()]
              }`,
            )
          }
          if (scope[0] === 'ESSAY' || scope[0] === 'FILL_IN_THE_BLANK_FREE_TEXT') {
            resultAnswersContent.push(`${key}. ${value.toString()}`)
          }
          if (scope[0] === 'MATCHING') {
            let result = Object.entries(value)
              .map(([key, value]) => `${value.toString().toUpperCase()} - ${key}`)
              .join(', ')
            resultAnswersContent.push(`${key}. ${result}`)
          }
          if (scope[0] === 'TRUE_FALSE') {
            const lowerStr = value.toString().toLowerCase()
            if (lowerStr.startsWith('t')) {
              resultAnswersContent.push(`${key}. A) True`)
            }
            if (lowerStr.startsWith('f')) {
              resultAnswersContent.push(`${key}. B) False`)
            }
          }
        }
        return resultAnswersContent
      },
    })

    const buf = doc.getZip().generate({
      type: 'nodebuffer',
      compression: 'DEFLATE',
    })

    fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.docx`), buf)

    const file = fs.readFileSync(
      path.resolve(__dirname, `../../static/outputPDF/${id}.docx`),
    )

    await libre.convert(file, '.pdf', undefined, (err: any, done) => {
      if (err) {
        throw new Error(`Error converting file: ${err}`)
      }

      fs.writeFileSync(path.resolve(__dirname, `../../static/outputPDF/${id}.pdf`), done)
    })

    await this.prisma.material.update({
      where: {
        id,
        type: 'QUIZ',
      },
      data: {
        isGeneratedPDF: true,
      },
    })

    return {
      pdf: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.pdf`,
      docx: `${this.configService.get('CDN_GATEWAY_URL')}/${id}.docx`,
    }
  }
}
