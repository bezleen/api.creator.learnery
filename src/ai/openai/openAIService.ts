import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ChatOpenAI } from 'langchain/chat_models'
import { ChatPromptTemplate } from 'langchain/prompts'

class OpenAIConnectionPool {
  private readonly pool: Array<ChatOpenAI>
  private i: number
  constructor(private poolSize: number, private openAIConfig: any) {
    this.pool = []
    this.i = 0
    this.init()
  }

  init<T>() {
    for (let i = 0; i < this.poolSize; i++) {
      this.pool.push(new ChatOpenAI(this.openAIConfig))
    }
  }
  get() {
    if (this.i >= this.poolSize) this.i = 0
    return this.pool[this.i++]
  }
}

@Injectable()
export class OpenAIService extends ChatOpenAI {
  private poolSize = 10 //FIXME: change number
  private pool: OpenAIConnectionPool

  constructor(config: ConfigService) {
    // FIXME: replace with LangchainJS - https://js.langchain.com/docs/modules/memory/
    const openAIConfig = {
      openAIApiKey: config.get('OPENAI_API_KEY'),
      temperature: 0,
      verbose: true,
      n: 1,
      streaming: true,
      modelName: config.get('OPENAI_CHAT_MODEL'),
    }
    super(openAIConfig) // defaults to process.env["OPENAI_API_KEY"]
    this.pool = new OpenAIConnectionPool(this.poolSize, openAIConfig)
  }

  public async converseAI<outputSchema>(
    prompt: ChatPromptTemplate,
    promptValues: object,
    id: string = 'arbitrary',
  ): Promise<outputSchema> {
    const conversation = await prompt.formatMessages(promptValues)

    console.debug({ conversation, id })

    let result = await this.pool.get().call(conversation)

    console.debug({ result, id })

    result = JSON.parse(result.content)

    return result as outputSchema
  }
}

/*
 * https://js.langchain.com/docs/get_started/quickstart
 * */
