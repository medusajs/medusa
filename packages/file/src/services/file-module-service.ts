import {
  Context,
  CreateFileDTO,
  FileDTO,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { joinerConfig } from "../joiner-config"
import FileProviderService from "./file-provider-service"

type InjectedDependencies = {
  fileProviderService: FileProviderService
}

export default class FileModuleService {
  protected readonly fileProviderService_: FileProviderService
  constructor({ fileProviderService }: InjectedDependencies) {
    this.fileProviderService_ = fileProviderService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  create(data: CreateFileDTO[], sharedContext?: Context): Promise<FileDTO[]>
  create(data: CreateFileDTO, sharedContext?: Context): Promise<FileDTO>

  async create(
    data: CreateFileDTO[] | CreateFileDTO
  ): Promise<FileDTO[] | FileDTO> {
    const input = Array.isArray(data) ? data : [data]
    const files = await Promise.all(
      input.map((file) => this.fileProviderService_.upload(file))
    )
    const result = files.map((file) => ({
      id: file.key,
      url: file.url,
    }))

    return Array.isArray(data) ? result : result[0]
  }

  async delete(ids: string[], sharedContext?: Context): Promise<void>
  async delete(id: string, sharedContext?: Context): Promise<void>
  async delete(ids: string[] | string): Promise<void> {
    const input = Array.isArray(ids) ? ids : [ids]
    await Promise.all(
      input.map((id) => this.fileProviderService_.delete({ fileKey: id }))
    )

    return
  }

  async retrieve(id: string): Promise<FileDTO>
  async retrieve(id: string): Promise<FileDTO> {
    const res = await this.fileProviderService_.getPresignedDownloadUrl({
      fileKey: id,
    })

    return {
      id,
      url: res,
    }
  }
}
