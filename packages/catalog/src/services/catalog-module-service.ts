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
import { buildFullConfigurationFromSchema } from "../utils/build-config"

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  eventBusModuleService: IEventBusModuleService
  storageProviderCtr: StorageProvider
  storageProviderOptions: any
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

  protected schemaConfigurationObject_: any

  protected storageProviderInstance_: StorageProvider
  protected readonly storageProviderCtr_: StorageProvider
  protected readonly storageProviderCtrOptions_: unknown

  protected get storageProvider_(): StorageProvider {
    this.buildSchemaConfigurationObject_()

    this.storageProviderInstance_ =
      this.storageProviderInstance_ ??
      new this.storageProviderCtr_(
        this.container_,
        Object.assign(this.storageProviderCtrOptions_ ?? {}, {
          schemaConfigurationObject: this.schemaConfigurationObject_,
        }),
        this.moduleOptions_
      )

    return this.storageProviderInstance_
  }

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.moduleOptions_ =
      moduleDeclaration.options as unknown as CatalogModuleOptions

    const {
      baseRepository,
      eventBusModuleService,
      storageProviderCtr,
      storageProviderOptions,
    } = container

    this.baseRepository_ = baseRepository
    this.eventBusModuleService_ = eventBusModuleService
    this.storageProviderCtr_ = storageProviderCtr
    this.storageProviderCtrOptions_ = storageProviderOptions

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the CatalogModule to work"
      )
    }

    this.registerListeners()
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async query(obj: {
    where: FilterQuery<any> & BaseFilterable<FilterQuery<any>>
    options?: {
      skip?: number
      take?: number
      orderBy?: { [column: string]: "ASC" | "DESC" }
    }
  }) {
    return await this.storageProvider_.query()
  }

  protected registerListeners() {
    const configurationObjects = this.schemaConfigurationObject_ ?? {}

    for (const configurationObject of Object.values(
      configurationObjects
    ) as any) {
      configurationObject.listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(
          listener,
          this.storageProvider_.consumeEvent(configurationObject)
        )
      })
    }
  }

  private buildSchemaConfigurationObject_() {
    this.schemaConfigurationObject_ =
      this.schemaConfigurationObject_ ??
      buildFullConfigurationFromSchema(this.moduleOptions_.schema)
  }
}
