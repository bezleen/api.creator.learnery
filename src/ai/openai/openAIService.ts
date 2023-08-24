import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { OpenAI } from 'langchain/llms/openai'

@Injectable()
export class OpenAIService extends OpenAI {
  constructor(config: ConfigService) {
    // FIXME: replace with LangchainJS - https://js.langchain.com/docs/modules/memory/
    super({ openAIApiKey: config.get('OPENAI_API_KEY') }) // defaults to process.env["OPENAI_API_KEY"]
  }
}

/*
 * https://js.langchain.com/docs/get_started/quickstart
 * */
