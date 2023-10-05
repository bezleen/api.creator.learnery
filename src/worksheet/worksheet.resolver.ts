import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorksheetService } from './worksheet.service';
import { CreateWorksheetInput } from './dto/create-worksheet.input';
import { UpdateWorksheetInput } from './dto/update-worksheet.input';

@Resolver('Worksheet')
export class WorksheetResolver {
  constructor(private readonly worksheetService: WorksheetService) {}

  @Mutation('createWorksheet')
  create(@Args('createWorksheetInput') createWorksheetInput: CreateWorksheetInput) {
    return this.worksheetService.create(createWorksheetInput);
  }

  @Query('worksheet')
  findAll() {
    return this.worksheetService.findAll();
  }

  @Query('worksheet')
  findOne(@Args('id') id: number) {
    return this.worksheetService.findOne(id);
  }

  @Mutation('updateWorksheet')
  update(@Args('updateWorksheetInput') updateWorksheetInput: UpdateWorksheetInput) {
    return this.worksheetService.update(updateWorksheetInput.id, updateWorksheetInput);
  }

  @Mutation('removeWorksheet')
  remove(@Args('id') id: number) {
    return this.worksheetService.remove(id);
  }
}
