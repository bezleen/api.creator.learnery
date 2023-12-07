import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common'
import { MaterialService } from './material.service'
import { Response } from 'express'
import path from 'path'
import { MaterialType } from '@prisma/client'

@Injectable()
@Controller('material')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  // @Post('/create-scorm/:id')
  // async createScorm(@Param('id') id: string, @Res() res: Response) {
  //     const response = await this.materialService.createScorm(id)

  //     return res.status(200).json({
  //         message: "success"
  //     })
  // }

  @Get('/performance-task-pdf/:id')
  async getPerformanceTaskPDF(@Param('id') id: string, @Res() res: Response) {
    const response = await this.materialService.getPerformanceTaskPDF(id, res)

    return res.status(200).json({
      pdfURL: response,
    })
  }

  @Get('/worksheet-pdf/:id')
  async getWorksheetPDF(@Param('id') id: string, @Res() res: Response) {
    const response = await this.materialService.getWorksheetPDF(id, res)

    return res.status(200).json({
      pdfURL: response,
    })
  }

  @Get('/quiz-pdf/:id')
  async getQuizPDF(@Param('id') id: string, @Res() res: Response) {
    const response = await this.materialService.getQuizPDF(id, res)

    return res.status(200).json({
      pdfURL: response,
    })
  }
}
