import {
  CatalogTypes,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import {
  CatalogModuleOptions,
  SchemaObjectRepresentation,
  schemaObjectRepresentationPropertiesToOmit,
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

export default class CatalogModuleService
  implements CatalogTypes.ICatalogModuleService
{
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

  __hooks = {
    onApplicationStart(this: CatalogModuleService) {
      return this.onApplicationStart_()
    },
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  protected async onApplicationStart_() {
    this.buildSchemaObjectRepresentation_()
    this.registerListeners()
  }

  async query(...args) {
    return await this.storageProvider_.query.apply(this.storageProvider_, args)
  }

  async queryAndCount(...args) {
    return await this.storageProvider_.queryAndCount.apply(
      this.storageProvider_,
      args
    )
  }

  protected registerListeners() {
    const schemaObjectRepresentation = this.schemaObjectRepresentation_ ?? {}

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
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
