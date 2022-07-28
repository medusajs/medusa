import { EntityManager } from "typeorm"
import { AbstractSearchService } from "../interfaces/search-service"
import { Logger } from "../types/global"

type InjectedDependencies = {
  logger: Logger
  manager: EntityManager
}

export default class DefaultSearchService extends AbstractSearchService<DefaultSearchService> {
  isDefault = true

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined
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
    this.manager_ = manager
  }

  createIndex(indexName: string, options: unknown): void {
    this.logger_.warn(
      "This is an empty method: createIndex must be overridden by a child class"
    )
  }

  getIndex(indexName: string): void {
    this.logger_.warn(
      "This is an empty method: getIndex must be overridden by a child class"
    )
  }

  addDocuments(indexName: string, documents: unknown, type: string): void {
    this.logger_.warn(
      "This is an empty method: addDocuments must be overridden by a child class"
    )
  }

  replaceDocuments(indexName: string, documents: unknown, type: string): void {
    this.logger_.warn(
      "This is an empty method: replaceDocuments must be overridden by a child class"
    )
  }

  deleteDocument(indexName: string, document_id: string | number): void {
    this.logger_.warn(
      "This is an empty method: deleteDocument must be overridden by a child class"
    )
  }

  deleteAllDocuments(indexName: string): void {
    this.logger_.warn(
      "This is an empty method: deleteAllDocuments must be overridden by a child class"
    )
  }

  search(
    indexName: string,
    query: unknown,
    options: unknown
  ): { hits: unknown[] } {
    this.logger_.warn(
      "This is an empty method: search must be overridden a the child class"
    )
    return { hits: [] }
  }

  updateSettings(indexName: string, settings: unknown): void {
    this.logger_.warn(
      "This is an empty method: updateSettings must be overridden by a child class"
    )
  }
}
