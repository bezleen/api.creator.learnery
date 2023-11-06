import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '@/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { MaterialType } from '@prisma/client';
import axios from 'axios';
import { CreatePerformanceTaskInputDTO, CreateQuizInputDTO, CreateWorksheetInputDTO } from './dto/create-material.input';
import { marked } from 'marked'
import * as path from 'path';
import * as fs from 'fs';
import scopackager from 'simple-scorm-packager';

@Injectable()
export class MaterialService {
  constructor(
    private readonly prisma: PrismaService,
  ) { }

  async createQuiz(data: CreateQuizInputDTO) {

    if (Object.keys(data.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdQuiz = await this.prisma.material.create({
      data: {
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.QUIZ,
        request: {
          quiz: data
        },
        result: {},
      }
    })

    const payload_ai = {
      offer_id: createdQuiz.id,
      user_id: createdQuiz.userId
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/quiz', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }

    return createdQuiz
  }

  async createPerformanceTask(data: CreatePerformanceTaskInputDTO) {

    // const regex = /^\s*(\d+)\s*.*/

    // if (!regex.test(data.timeActivity) ){
    //   throw new Error('Invalid time format!');
    // }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdPerformanceTask = await this.prisma.material.create({
      data: {
        // userId: data?.userId,
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.PERFORMANCE_TASK,
        request: {
          performanceTask: data
        },
        result: {},
      }
    })

    const payload_ai = {
      offer_id: createdPerformanceTask.id,
      user_id: createdPerformanceTask.userId
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/performance-task', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }

    return createdPerformanceTask
  }

  async createWorksheet(data: CreateWorksheetInputDTO) {

    if (Object.keys(data.questionTypes).length > 3) {
      throw new BadRequestException('you can only choose 3 type of question ')
    }

    if (data.audience.ageStart >= data.audience.ageEnd) {
      throw new Error('ageStart cannot be greater or equal than ageEnd')
    }

    const createdWorksheet = await this.prisma.material.create({
      data: {
        userId: "user_2U2EbVpMtK3doTltzvdoTNIa7ru",
        type: MaterialType.WORKSHEET,
        request: {
          worksheet: data
        },
        result: {},
      }
    })

    const payload_ai = {
      offer_id: createdWorksheet.id,
      user_id: createdWorksheet.userId
    }

    try {
      const response = await axios.post('https://learnery-daemon-gateway.orasci.site/v1/api/internal/material/worksheet', payload_ai);

      if (response.status !== 200) {
        throw new Error('Fail to call api from daemon server');
      }

    } catch (error) {

      throw new Error('Fail to call api from daemon server');
    }


    return createdWorksheet
  }

  async findAll() {
    return await this.prisma.material.findMany({})
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

  async createScorm(id: string) {
    const material = await this.prisma.material.findUnique({
      where: {
        id
      }
    })

    const rawResult = material.rawResult

    const htmlContent = marked(rawResult);

    const htmlFilePath = path.join(path.resolve(__dirname, '../../src/public/'), 'index.html')

    fs.writeFile(htmlFilePath, htmlContent, (err) => {
      if (err) throw new Error(err.message)
    })

    const folderOutputPath = path.resolve(__dirname, '../../src/output/')

    const config = {
      version: '1.2',
      organization: 'Learnery',
      title: material.type,
      language: material.request?.performanceTask?.language || material.request?.quiz?.language || material.request?.worksheet?.language || 'en-US',
      startingPage: 'index.html',
      source: path.resolve(__dirname, '../../src/public'),
      package: {
        version: process.env.npm_package_version,
        zip: true,
        author: material?.userId || 'bach',
        outputFolder: folderOutputPath,
        description: material.request?.performanceTask?.description || material.request?.worksheet?.description || material.request?.quiz?.description || '',
        keywords: ['scorm', 'test', 'course'],
        typicalDuration: 'PT0H5M0S',
        // rights: `©${new Date().getFullYear()} My Amazing Company. All right reserved.`,
        // vcard: {
        //   author: 'Firstname Lastname',
        //   org: 'My Amazing Company',
        //   tel: '(000) 000-0000',
        //   address: 'my address',
        //   mail: 'my@email.com',
        //   url: 'https://mydomain.com'
        // }
      }
    }

    await scopackager(config, (msg: string) => {
      console.log(msg)
    })

    return 'Create Success'
  } 


}


