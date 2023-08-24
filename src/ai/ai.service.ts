import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class AiService {
  private openAIKey: string
  constructor(private readonly config: ConfigService) {
    this.openAIKey = config.get('OPENAI_API_KEY')
  }
}
