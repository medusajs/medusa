import { AbstractSearchService } from "@medusajs/utils"
import { EntityManager } from "typeorm"
import { Logger } from "../types/global"

type InjectedDependencies = {
  logger: Logger
  manager: EntityManager
}

export default class DefaultSearchService extends AbstractSearchService {
  isDefault = true

  protected readonly logger_: Logger
  protected readonly options_: Record<string, unknown>

  constructor({ logger, manager }: InjectedDependencies, options) {
    super(
      {
        logger,
      },
      options
    )

    this.options_ = options
    this.logger_ = logger
  }

  async createIndex(indexName: string, options: unknown): Promise<void> {
    this.logger_.warn(
      "This is an empty method: createIndex must be overridden by a child class"
    )
  }

  async getIndex(indexName: string): Promise<void> {
    this.logger_.warn(
      "This is an empty method: getIndex must be overridden by a child class"
    )
  }

  async addDocuments(
    indexName: string,
    documents: unknown,
    type: string
  ): Promise<void> {
    this.logger_.warn(
      "This is an empty method: addDocuments must be overridden by a child class"
    )
  }

  async replaceDocuments(
    indexName: string,
    documents: unknown,
    type: string
  ): Promise<void> {
    this.logger_.warn(
      "This is an empty method: replaceDocuments must be overridden by a child class"
    )
  }

  async deleteDocument(
    indexName: string,
    document_id: string | number
  ): Promise<void> {
    this.logger_.warn(
      "This is an empty method: deleteDocument must be overridden by a child class"
    )
  }

  async deleteAllDocuments(indexName: string): Promise<void> {
    this.logger_.warn(
      "This is an empty method: deleteAllDocuments must be overridden by a child class"
    )
  }

  async search(
    indexName: string,
    query: unknown,
    options: unknown
  ): Promise<{ hits: unknown[] }> {
    this.logger_.warn(
      "This is an empty method: search must be overridden a the child class"
    )
    return { hits: [] }
  }

  async updateSettings(indexName: string, settings: unknown): Promise<void> {
    this.logger_.warn(
      "This is an empty method: updateSettings must be overridden by a child class"
    )
  }
}
