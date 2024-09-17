import {
  IEventBusModuleService,
  IndexTypes,
  InternalModuleDeclaration,
  RemoteQueryFunction,
} from "@medusajs/types"
import {
  MikroOrmBaseRepository as BaseRepository,
  Modules,
} from "@medusajs/utils"
import {
  IndexModuleOptions,
  SchemaObjectRepresentation,
  StorageProvider,
  schemaObjectRepresentationPropertiesToOmit,
} from "@types"
import { buildSchemaObjectRepresentation } from "../utils/build-config"

type InjectedDependencies = {
  [Modules.EVENT_BUS]: IEventBusModuleService
  storageProviderCtr: StorageProvider
  storageProviderCtrOptions: unknown
  remoteQuery: RemoteQueryFunction
  baseRepository: BaseRepository
}

export default class IndexModuleService implements IndexTypes.IIndexService {
  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: IndexModuleOptions

  protected readonly eventBusModuleService_: IEventBusModuleService

  protected schemaObjectRepresentation_: SchemaObjectRepresentation
  protected schemaEntitiesMap_: Record<string, any>

  protected readonly storageProviderCtr_: StorageProvider
  protected readonly storageProviderCtrOptions_: unknown

  protected storageProvider_: StorageProvider

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.moduleOptions_ = (moduleDeclaration.options ??
      moduleDeclaration) as unknown as IndexModuleOptions

    const {
      [Modules.EVENT_BUS]: eventBusModuleService,
      storageProviderCtr,
      storageProviderCtrOptions,
    } = container

    this.eventBusModuleService_ = eventBusModuleService
    this.storageProviderCtr_ = storageProviderCtr
    this.storageProviderCtrOptions_ = storageProviderCtrOptions

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the IndexModule to work"
      )
    }
  }

  __joinerConfig() {
    return {}
  }

  __hooks = {
    onApplicationStart(this: IndexModuleService) {
      return this.onApplicationStart_()
    },
  }

  protected async onApplicationStart_() {
    try {
      this.buildSchemaObjectRepresentation_()

      this.storageProvider_ = new this.storageProviderCtr_(
        this.container_,
        Object.assign(this.storageProviderCtrOptions_ ?? {}, {
          schemaObjectRepresentation: this.schemaObjectRepresentation_,
          entityMap: this.schemaEntitiesMap_,
        }),
        this.moduleOptions_
      )

      this.registerListeners()

      if (this.storageProvider_.onApplicationStart) {
        await this.storageProvider_.onApplicationStart()
      }
    } catch (e) {
      console.log(e)
    }
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
    if (this.schemaObjectRepresentation_) {
      return this.schemaObjectRepresentation_
    }

    const [objectRepresentation, entityMap] = buildSchemaObjectRepresentation(
      this.moduleOptions_.schema ?? ""
    )
    this.schemaObjectRepresentation_ = objectRepresentation
    this.schemaEntitiesMap_ = entityMap

    return this.schemaObjectRepresentation_
  }
}
