import { Body, Controller, Get, Injectable, Param, Post, Res } from '@nestjs/common'
import { MaterialService } from './material.service'
import { Response } from 'express'
import path from 'path'

@Injectable()
@Controller('material')
export class MaterialController {
    constructor(private readonly materialService: MaterialService) { }

    @Post('/create-scorm/:id')
    async createScorm(@Param('id') id: string, @Res() res: Response) {
        const response = await this.materialService.createScorm(id)

    
        return response ? response : 'Fail to Create Scorm'
    }

    @Get('/get-scorm/:id')
    async getScorm(@Param('id') id: string, @Res() res: Response){
        const response = await this.materialService.getScorm(id)

    
        return response ? response : 'Fail to Create Scorm'
    }
}