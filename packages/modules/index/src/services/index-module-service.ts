import {
  Constructor,
  IEventBusModuleService,
  IndexTypes,
  InternalModuleDeclaration,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MikroOrmBaseRepository as BaseRepository,
  Modules,
} from "@medusajs/framework/utils"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { buildSchemaObjectRepresentation } from "../utils/build-config"
import { defaultSchema } from "../utils/default-schema"
import { gqlSchemaToTypes } from "../utils/gql-to-types"

type InjectedDependencies = {
  [Modules.EVENT_BUS]: IEventBusModuleService
  storageProviderCtr: Constructor<IndexTypes.StorageProvider>
  [ContainerRegistrationKeys.QUERY]: RemoteQueryFunction
  storageProviderCtrOptions: unknown
  baseRepository: BaseRepository
}

export default class IndexModuleService implements IndexTypes.IIndexService {
  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: IndexTypes.IndexModuleOptions

  protected readonly eventBusModuleService_: IEventBusModuleService

  protected schemaObjectRepresentation_: IndexTypes.SchemaObjectRepresentation
  protected schemaEntitiesMap_: Record<string, any>

  protected readonly storageProviderCtr_: Constructor<IndexTypes.StorageProvider>
  protected readonly storageProviderCtrOptions_: unknown

  protected storageProvider_: IndexTypes.StorageProvider

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.moduleOptions_ = (moduleDeclaration.options ??
      moduleDeclaration) as unknown as IndexTypes.IndexModuleOptions

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
      ) as IndexTypes.StorageProvider

      this.registerListeners()

      if (this.storageProvider_.onApplicationStart) {
        await this.storageProvider_.onApplicationStart()
      }

      await gqlSchemaToTypes(this.moduleOptions_.schema ?? defaultSchema)
    } catch (e) {
      console.log(e)
    }
  }

  async query<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>
  ): Promise<IndexTypes.QueryResultSet<TEntry>> {
    return await this.storageProvider_.query(config)
  }

  protected registerListeners() {
    const schemaObjectRepresentation = (this.schemaObjectRepresentation_ ??
      {}) as IndexTypes.SchemaObjectRepresentation

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
        continue
      }

      ;(
        schemaEntityObjectRepresentation as IndexTypes.SchemaObjectEntityRepresentation
      ).listeners.forEach((listener) => {
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
      this.moduleOptions_.schema ?? defaultSchema
    )

    this.schemaObjectRepresentation_ = objectRepresentation
    this.schemaEntitiesMap_ = entityMap

    return this.schemaObjectRepresentation_
  }
}
