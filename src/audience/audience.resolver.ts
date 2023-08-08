import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AudienceService } from './audience.service'
import { CreateAudienceInput, UpdateAudienceInput } from '../graphql'

@Resolver('Audience')
export class AudienceResolver {
  constructor(private readonly audienceService: AudienceService) {}

  @Mutation('createAudience')
  create(@Args('data') data: CreateAudienceInput) {
    return this.audienceService.create(data)
  }

  @Query('audiences')
  findAll() {
    return this.audienceService.findAll()
  }

  @Query('audience')
  findOne(@Args('id') id: string) {
    return this.audienceService.findOne({ id })
  }

  @Mutation('updateAudience')
  update(@Args('id') id: string, @Args('data') data: UpdateAudienceInput) {
    return this.audienceService.update(id, data)
  }

  @Mutation('removeAudience')
  remove(@Args('id') id: string) {
    return this.audienceService.remove(id)
  }
}
