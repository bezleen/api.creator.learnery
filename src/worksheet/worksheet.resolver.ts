import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { WorksheetService } from './worksheet.service';
import { CreateWorksheetInputDTO } from './dto/create-worksheet.input';
import { UpdateWorksheetInputDTO } from './dto/update-worksheet.input';

@Resolver('Worksheet')
export class WorksheetResolver {
  constructor(private readonly worksheetService: WorksheetService) { }

  @Mutation('createWorksheet')
  create(@Args('data') createWorksheetInput: CreateWorksheetInputDTO) {
    return this.worksheetService.create(createWorksheetInput);
  }

  @Query('worksheets')
  findAll() {
    return this.worksheetService.findAll();
  }

  @Query('worksheet')
  findOne(@Args('id') id: string) {
    return this.worksheetService.findOne({id});
  }

  @Mutation('updateWorksheet')
  update(@Args('id') id: string, @Args('data') updateWorksheetInput: UpdateWorksheetInputDTO) {
    return this.worksheetService.update({id}, updateWorksheetInput);
  }

  @Mutation('removeWorksheet')
  remove(@Args('id') id: string) {
    return this.worksheetService.remove({id});
  }
}
