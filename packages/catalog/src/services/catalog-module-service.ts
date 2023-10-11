import {
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import {
  CatalogModuleOptions,
  SchemaObjectRepresentation,
  StorageProvider,
} from "../types"
import { buildSchemaObjectRepresentation } from "../utils/build-config"
import { joinerConfig } from "./../joiner-config"

type InjectedDependencies = {
  eventBusModuleService: IEventBusModuleService
  storageProviderCtr: StorageProvider
  storageProviderCtrOptions: unknown
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export default class CatalogModuleService {
  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: CatalogModuleOptions

  protected readonly eventBusModuleService_: IEventBusModuleService

  protected schemaObjectRepresentation_: SchemaObjectRepresentation

  protected storageProviderInstance_: StorageProvider
  protected readonly storageProviderCtr_: StorageProvider
  protected readonly storageProviderCtrOptions_: unknown

  protected get storageProvider_(): StorageProvider {
    this.storageProviderInstance_ =
      this.storageProviderInstance_ ??
      new this.storageProviderCtr_(
        this.container_,
        Object.assign(this.storageProviderCtrOptions_ ?? {}, {
          schemaObjectRepresentation: this.schemaObjectRepresentation_,
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
    this.moduleOptions_ = (moduleDeclaration.options ??
      moduleDeclaration) as unknown as CatalogModuleOptions

    const {
      eventBusModuleService,
      storageProviderCtr,
      storageProviderCtrOptions,
    } = container

    this.eventBusModuleService_ = eventBusModuleService
    this.storageProviderCtr_ = storageProviderCtr
    this.storageProviderCtrOptions_ = storageProviderCtrOptions

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the CatalogModule to work"
      )
    }
  }

  /**
   * TODO: should we introduce module service hook called after all modules are initialized?
   * here we are depending on potentially all other modules being initialized
   */
  async afterModulesInit() {
    this.buildSchemaObjectRepresentation_()
    this.registerListeners()
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  async query(...args) {
    return await this.storageProvider_.query.apply(this, args)
  }

  protected registerListeners() {
    const schemaObjectRepresentation = this.schemaObjectRepresentation_ ?? {}

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (entityName === "_aliasMap") {
        continue
      }

      schemaEntityObjectRepresentation.listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(
          listener,
          this.storageProvider_.consumeEvent(schemaEntityObjectRepresentation)
        )
      })
    }
  }

  private buildSchemaObjectRepresentation_() {
    this.schemaObjectRepresentation_ =
      this.schemaObjectRepresentation_ ??
      buildSchemaObjectRepresentation(this.moduleOptions_.schema)
  }
}
