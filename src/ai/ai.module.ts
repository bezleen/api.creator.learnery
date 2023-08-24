import { Global, Module, OnModuleInit } from '@nestjs/common'
import { AiService } from './ai.service'
import { OpenAIService } from './openai/openAIService'
import { PineconeService } from './pinecone/pinecone.service'
import { ConfigService } from '@nestjs/config'

@Global()
@Module({
  providers: [AiService, OpenAIService, PineconeService],
})
export class AiModule implements OnModuleInit {
  constructor(
    private readonly config: ConfigService,
    private pinecone: PineconeService,
  ) {}

  async onModuleInit() {
    const pineconeKey = this.config.get('PINECONE_API_KEY')
    const pineconeEnv = this.config.get('PINECONE_API_ENV')
    const pineconeIndex = this.config.get('PINECONE_INDEX')
    setTimeout(async () => {
      await this.pinecone.initService({
        env: pineconeEnv,
        key: pineconeKey,
        index: pineconeIndex,
      })
    }, 50)
  }
}
