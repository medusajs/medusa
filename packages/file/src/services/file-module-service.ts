import {
  Context,
  CreateFileDTO,
  FileDTO,
  ModuleJoinerConfig,
} from "@medusajs/types"

import { joinerConfig } from "../joiner-config"

export default class FileModuleService {
  constructor() {
    // @ts-ignore
    // eslint-disable-next-line prefer-rest-params
    super(...arguments)
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
    const files = []
    return Array.isArray(data) ? files : files[0]
  }

  async delete(ids: string[], sharedContext?: Context): Promise<void>
  async delete(id: string, sharedContext?: Context): Promise<void>
  async delete(ids: string[] | string): Promise<void> {
    return
  }

  async retrieve(id: string): Promise<FileDTO>
  async retrieve(id: string): Promise<FileDTO> {
    return {} as FileDTO
  }
}
