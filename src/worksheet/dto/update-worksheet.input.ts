import { CreateWorksheetInput } from './create-worksheet.input';
import { PartialType } from '@nestjs/mapped-types';

export class UpdateWorksheetInput extends PartialType(CreateWorksheetInput) {
  id: number;
}
