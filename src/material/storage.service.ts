import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { writeFileSync } from 'fs'
import { BlobServiceClient } from '@azure/storage-blob'
import path from 'path'

@Injectable()
export class StorageService {
  private readonly storageMode: string
  private readonly azureConfig: {
    connectionString: string
    containerName: string
  }

  constructor(private readonly configService: ConfigService) {
    this.storageMode = this.configService.get<string>('STORAGE_MODE')
    this.azureConfig = {
      connectionString: this.configService.get<string>('AZURE_STORAGE_CONNECTION_STRING'),
      containerName: this.configService.get<string>('AZURE_STORAGE_CONTAINER_NAME'),
    }
  }

  private async uploadFileLocally(fileBuffer: Buffer, fileName: string): Promise<string> {
    // Save file locally
    const filePath = path.resolve(__dirname, `../../static/outputPDF/${fileName}`)
    await writeFileSync(filePath, fileBuffer)
    return filePath
  }

  private async uploadFileToAzure(fileBuffer: Buffer, fileName: string): Promise<string> {
    console.log('Connection String: ', this.azureConfig.connectionString)
    // Upload file to Azure storage
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      this.azureConfig.connectionString,
    )
    const containerClient = blobServiceClient.getContainerClient(
      this.azureConfig.containerName,
    )
    const blockBlobClient = containerClient.getBlockBlobClient(fileName)
    await blockBlobClient.uploadData(fileBuffer)
    return blockBlobClient.url
  }

  async uploadFile(fileBuffer: Buffer, fileName: string): Promise<string> {
    switch (this.storageMode) {
      case 'local':
        return this.uploadFileLocally(fileBuffer, fileName)
      case 'azure':
        return this.uploadFileToAzure(fileBuffer, fileName)
      default:
        throw new Error('Invalid storage mode')
    }
  }
}
