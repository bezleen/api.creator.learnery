import { Injectable } from '@nestjs/common'
import { PineconeClient } from '@pinecone-database/pinecone'

interface PineConeConfig {
  env: string
  key: string
  index: string
}
@Injectable()
export class PineconeService extends PineconeClient {
  // public pinecone: PineconeClient = new PineconeClient() //TOOD: not req
  constructor() {
    super()
  }

  async initService({ env, key, index }: PineConeConfig) {
    try {
      await this.init({
        environment: env,
        apiKey: key,
      })
      console.log('pinecone init')
    } catch (err) {
      console.error({ 'pinecone init': err })
      throw err
    } finally {
      const indexes = await this.indexes()
      console.log({ indexes })

      if (!indexes.includes(index)) {
        console.log('creating index', index)
        await this.createIndex({
          //TODO: check if index exists
          createRequest: {
            name: index,
            dimension: 1024,
          },
        })
      }
    }
  }

  indexes() {
    return this.listIndexes()
  }
}
