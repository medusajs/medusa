import {
  Context,
  CreateFileDTO,
  FileDTO,
  FileTypes,
  FilterableFileProps,
  FindConfig,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { joinerConfig } from "../joiner-config"
import FileProviderService from "./file-provider-service"
import { MedusaError } from "@medusajs/utils"

type InjectedDependencies = {
  fileProviderService: FileProviderService
}

export default class FileModuleService implements FileTypes.IFileModuleService {
  protected readonly fileProviderService_: FileProviderService
  constructor({ fileProviderService }: InjectedDependencies) {
    this.fileProviderService_ = fileProviderService
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  createFiles(
    data: CreateFileDTO[],
    sharedContext?: Context
  ): Promise<FileDTO[]>
  createFiles(data: CreateFileDTO, sharedContext?: Context): Promise<FileDTO>

  async createFiles(
    data: CreateFileDTO[] | CreateFileDTO
  ): Promise<FileDTO[] | FileDTO> {
    const input = Array.isArray(data) ? data : [data]
    // TODO: Validate file mime type, have config for allowed types

    const files = await Promise.all(
      input.map((file) => this.fileProviderService_.upload(file))
    )
    const result = files.map((file) => ({
      id: file.key,
      url: file.url,
    }))

    return Array.isArray(data) ? result : result[0]
  }

  async deleteFiles(ids: string[], sharedContext?: Context): Promise<void>
  async deleteFiles(id: string, sharedContext?: Context): Promise<void>
  async deleteFiles(ids: string[] | string): Promise<void> {
    const input = Array.isArray(ids) ? ids : [ids]
    await Promise.all(
      input.map((id) => this.fileProviderService_.delete({ fileKey: id }))
    )

    return
  }

  async retrieveFile(id: string): Promise<FileDTO> {
    const res = await this.fileProviderService_.getPresignedDownloadUrl({
      fileKey: id,
    })

    return {
      id,
      url: res,
    }
  }

  async listFiles(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<FileDTO[]> {
    const id = Array.isArray(filters?.id) ? filters?.id?.[0] : filters?.id
    if (!id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Listing of files is only supported when filtering by ID."
      )
    }

    const res = await this.fileProviderService_.getPresignedDownloadUrl({
      fileKey: id,
    })

    if (!res) {
      return []
    }

    return [
      {
        id,
        url: res,
      },
    ]
  }

  async listAndCountFiles(
    filters?: FilterableFileProps,
    config?: FindConfig<FileDTO>,
    sharedContext?: Context
  ): Promise<[FileDTO[], number]> {
    const id = Array.isArray(filters?.id) ? filters?.id?.[0] : filters?.id
    if (!id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Listing and counting of files is only supported when filtering by ID."
      )
    }

    const res = await this.fileProviderService_.getPresignedDownloadUrl({
      fileKey: id,
    })

    if (!res) {
      return [[], 0]
    }

    return [
      [
        {
          id,
          url: res,
        },
      ],
      1,
    ]
  }
}
