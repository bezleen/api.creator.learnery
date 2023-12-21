import {
  Body,
  Controller,
  Get,
  Injectable,
  Param,
  Post,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common'
import { MaterialService } from './material.service'
import { Response } from 'express'
import path from 'path'
import { MaterialType } from '@prisma/client'
import { JwtAuthGuard } from '@/auth/guard/jwt.guard'
import { GetUser } from '@/auth/decorator/get-user.decorator'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@Injectable()
@UseGuards(JwtAuthGuard)
@Controller('material')
@ApiTags('PDF Generation')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  // @Post('/create-scorm/:id')
  // async createScorm(@Param('id') id: string, @Res() res: Response) {
  //     const response = await this.materialService.createScorm(id)

  //     return res.status(200).json({
  //         message: "success"
  //     })
  // }
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
        data: response,
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
        data: response,
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
        data: response,
      })
    } catch (error: any) {
      res.status(400).json({
        message: error.message,
      })
    }
  }

  @ApiBearerAuth('JWT-auth')
  @Get('/stop-stream/:id')
  async stopStreaming(@Res() res: Response) {
    return res.status(200)
  }
}
