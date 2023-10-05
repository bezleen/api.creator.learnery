import { Injectable } from '@nestjs/common';
import { CreateWorksheetInput } from './dto/create-worksheet.input';
import { UpdateWorksheetInput } from './dto/update-worksheet.input';

@Injectable()
export class WorksheetService {
  create(createWorksheetInput: CreateWorksheetInput) {
    return 'This action adds a new worksheet';
  }

  findAll() {
    return `This action returns all worksheet`;
  }

  findOne(id: number) {
    return `This action returns a #${id} worksheet`;
  }

  update(id: number, updateWorksheetInput: UpdateWorksheetInput) {
    return `This action updates a #${id} worksheet`;
  }

  remove(id: number) {
    return `This action removes a #${id} worksheet`;
  }
}
