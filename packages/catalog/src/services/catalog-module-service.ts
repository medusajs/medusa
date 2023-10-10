import {
  BaseFilterable,
  DAL,
  FilterQuery,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { CatalogModuleOptions, StorageProvider } from "../types"
import { joinerConfig } from "./../joiner-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  eventBusModuleService: IEventBusModuleService
  storageProvider: StorageProvider
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export default class CatalogModuleService {
  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: CatalogModuleOptions

  protected readonly baseRepository_: DAL.RepositoryService
  protected readonly eventBusModuleService_: IEventBusModuleService
  protected readonly storageProvider_: StorageProvider

  protected get remoteQuery_(): (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any> {
    return this.container_.remoteQuery
  }

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.moduleOptions_ =
      moduleDeclaration.options as unknown as CatalogModuleOptions

    const { baseRepository, eventBusModuleService, storageProvider } = container

    this.baseRepository_ = baseRepository
    this.eventBusModuleService_ = eventBusModuleService
    this.storageProvider_ = storageProvider

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the CatalogModule to work"
      )
    }

    if (!this.remoteQuery_) {
      throw new Error("RemoteQuery is required for the CatalogModule to work")
    }

    this.registerListeners()
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  public query(obj: {
    where: FilterQuery<any> & BaseFilterable<FilterQuery<any>>
    options?: {
      skip?: number
      take?: number
      orderBy?: { [column: string]: "ASC" | "DESC" }
    }
  }) {}

  protected registerListeners() {
    const objects = this.moduleOptions_.objects ?? []

    for (const { listeners } of objects) {
      listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(listener, () => {})
      })
    }
  }
}
