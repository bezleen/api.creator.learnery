import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Res,
<<<<<<< HEAD
=======
  UseGuards,
>>>>>>> feature/authenticate
} from '@nestjs/common'
import { MaterialService } from './material.service'
import { Response } from 'express'
import path from 'path'
import { MaterialType } from '@prisma/client'
<<<<<<< HEAD

@Injectable()
@Controller('material')
=======
import { JwtAuthGuard } from '@/auth/guard/jwt.guard'
import { GetUser } from '@/auth/decorator/get-user.decorator'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@UseGuards(JwtAuthGuard)
@Controller('material')
@ApiTags('PDF Generation')
>>>>>>> feature/authenticate
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  // @Post('/create-scorm/:id')
  // async createScorm(@Param('id') id: string, @Res() res: Response) {
  //     const response = await this.materialService.createScorm(id)

  //     return res.status(200).json({
  //         message: "success"
  //     })
  // }
<<<<<<< HEAD

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
=======
  @ApiBearerAuth('JWT-auth')
  @Get('/performance-task-pdf/:id')
  async getPerformanceTaskPDF(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.materialService.getPerformanceTaskPDF(id, res, userId)

      return res.status(200).json({
        pdfURL: response,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/worksheet-pdf/:id')
  async getWorksheetPDF(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.materialService.getWorksheetPDF(id, res, userId)

      return res.status(200).json({
        pdfURL: response,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/quiz-pdf/:id')
  async getQuizPDF(
    @GetUser('id') userId: string,
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    try {
      const response = await this.materialService.getQuizPDF(id, res, userId)

      return res.status(200).json({
        pdfURL: response,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
>>>>>>> feature/authenticate
  }
}
