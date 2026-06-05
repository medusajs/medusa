import { SqlEntityManager } from "@medusajs/framework/mikro-orm/postgresql"
import {
  Constructor,
  Context,
  FilterQuery,
  FindConfig,
  IEventBusModuleService,
  IndexTypes,
  InferEntityType,
  InternalModuleDeclaration,
  Logger,
  ModulesSdkTypes,
  RemoteQueryFunction,
} from "@medusajs/framework/types"
import {
  MikroOrmBaseRepository as BaseRepository,
  ContainerRegistrationKeys,
  GraphQLUtils,
  InjectManager,
  MedusaContext,
  Modules,
  ModulesSdkUtils,
  promiseAll,
  toMikroORMEntity,
} from "@medusajs/framework/utils"
import { IndexData, IndexMetadata, IndexRelation, IndexSync } from "@models"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import {
  buildSchemaObjectRepresentation,
  Configuration,
  defaultSchema,
  gqlSchemaToTypes,
  IndexMetadataStatus,
} from "@utils"
import { baseGraphqlSchema } from "../utils/base-graphql-schema"
import { DataSynchronizer } from "./data-synchronizer"

type InjectedDependencies = {
  logger: Logger
  [Modules.EVENT_BUS]: IEventBusModuleService
  storageProviderCtr: Constructor<IndexTypes.StorageProvider>
  [ContainerRegistrationKeys.QUERY]: RemoteQueryFunction
  storageProviderCtrOptions: unknown
  baseRepository: BaseRepository
  indexMetadataService: ModulesSdkTypes.IMedusaInternalService<any>
  indexSyncService: ModulesSdkTypes.IMedusaInternalService<any>
  dataSynchronizer: DataSynchronizer
}

export default class IndexModuleService
  extends ModulesSdkUtils.MedusaService({})
  implements IndexTypes.IIndexService
{
  #isWorkerMode: boolean = false

  private static readonly SyncSubscribersDescriptor = {
    continueSync: {
      eventName: "index.continue-sync",
      methodName: "continueSync",
    },
    fullSync: { eventName: "index.full-sync", methodName: "fullSync" },
    resetSync: { eventName: "index.reset-sync", methodName: "resetSync" },
  } as const

  private readonly baseRepository_: BaseRepository

  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: IndexTypes.IndexModuleOptions

  protected readonly eventBusModuleService_: IEventBusModuleService

  protected schemaObjectRepresentation_: IndexTypes.SchemaObjectRepresentation
  protected schemaEntitiesMap_: Record<string, any>

  protected readonly storageProviderCtr_: Constructor<IndexTypes.StorageProvider>
  protected readonly storageProviderCtrOptions_: unknown

  protected storageProvider_: IndexTypes.StorageProvider

  private configurationChecker_: Configuration

  private get indexMetadataService_(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.container_.indexMetadataService
  }

  private get indexSyncService_(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.container_.indexSyncService
  }

  private get dataSynchronizer_(): DataSynchronizer {
    return this.container_.dataSynchronizer
  }

  private get logger_(): Logger {
    try {
      return this.container_.logger
    } catch (e) {
      return console as unknown as Logger
    }
  }

  constructor(
    container: InjectedDependencies,
    moduleOptions: IndexTypes.IndexModuleOptions,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    super(...arguments)

    this.baseRepository_ = container.baseRepository
    this.container_ = container
    this.moduleOptions_ = (moduleOptions ??
      moduleDeclaration.options ??
      moduleDeclaration) as unknown as IndexTypes.IndexModuleOptions

    this.#isWorkerMode = moduleDeclaration.worker_mode !== "server"

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
      const executableSchema = this.buildSchemaObjectRepresentation_()

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

      await gqlSchemaToTypes(executableSchema!)

      /**
       * Only run the data synchronization in worker mode
       */

      if (this.#isWorkerMode) {
        this.dataSynchronizer_.onApplicationStart({
          schemaObjectRepresentation: this.schemaObjectRepresentation_,
          storageProvider: this.storageProvider_,
        })

        this.configurationChecker_ = new Configuration({
          logger: this.logger_,
          schemaObjectRepresentation: this.schemaObjectRepresentation_,
          indexMetadataService: this.indexMetadataService_,
          indexSyncService: this.indexSyncService_,
          dataSynchronizer: this.dataSynchronizer_,
        })
        const entitiesMetadataChanged =
          await this.configurationChecker_.checkChanges()

        if (entitiesMetadataChanged.length) {
          await this.dataSynchronizer_.syncEntities(entitiesMetadataChanged)
        }
      }
    } catch (e) {
      this.logger_.error(e)
    }
  }

  async query<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>
  ): Promise<IndexTypes.QueryResultSet<TEntry>> {
    return await this.storageProvider_.query(config)
  }

  protected registerListeners() {
    if (!this.#isWorkerMode) {
      return
    }

    const schemaObjectRepresentation = (this.schemaObjectRepresentation_ ??
      {}) as IndexTypes.SchemaObjectRepresentation

    // Register entity event listeners
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

    // Register sync subscribers
    for (const { eventName, methodName } of Object.values(
      IndexModuleService.SyncSubscribersDescriptor
    )) {
      this.eventBusModuleService_.subscribe(
        eventName,
        this[methodName].bind(this)
      )
    }
  }

  private buildSchemaObjectRepresentation_():
    | GraphQLUtils.GraphQLSchema
    | undefined {
    if (this.schemaObjectRepresentation_) {
      return
    }

    const { objectRepresentation, entitiesMap, executableSchema } =
      buildSchemaObjectRepresentation(
        baseGraphqlSchema + (this.moduleOptions_.schema ?? defaultSchema)
      )

    this.schemaObjectRepresentation_ = objectRepresentation
    this.schemaEntitiesMap_ = entitiesMap

    return executableSchema
  }

  /**
   * Example output:
   *
   *
   * ```json
   * [
   *   {
   *     "id": "prod_123",
   *     "entity": "product",
   *     "status": "pending",
   *     "fields": ["id"],
   *     "updated_at": "<timestamp of last indexed data>",
   *     "last_synced_key": "prod_4321"
   *   },
   *   ...
   * ]
   * ```
   * @returns Detailed index metadata with the last synced key for each entity
   */
  @InjectManager()
  async getInfo(
    @MedusaContext() sharedContext?: Context
  ): Promise<IndexTypes.IndexInfo[]> {
    const listArguments = [
      {} as FilterQuery<InferEntityType<typeof IndexMetadata>>,
      {} as FindConfig<InferEntityType<typeof IndexMetadata>>,
      sharedContext,
    ]

    const [indexMetadata, indexSync] = await promiseAll([
      this.indexMetadataService_.list(...listArguments) as Promise<
        InferEntityType<typeof IndexMetadata>[]
      >,
      this.indexSyncService_.list(...listArguments) as Promise<
        InferEntityType<typeof IndexSync>[]
      >,
    ])

    const lastEntitySyncedKeyMap = new Map<string, string>(
      indexSync
        .filter((sync) => sync.last_key !== null)
        .map((sync) => [sync.entity, sync.last_key!])
    )

    const indexInfo = indexMetadata.map((metadata) => {
      return {
        id: metadata.id,
        entity: metadata.entity,
        status: metadata.status,
        fields: metadata.fields.split(","),
        updated_at: metadata.updated_at,
        last_synced_key: lastEntitySyncedKeyMap.get(metadata.entity) ?? null,
      } satisfies IndexTypes.IndexInfo
    })

    return indexInfo
  }

  async sync({ strategy }: { strategy?: "full" | "reset" } = {}) {
    if (strategy && !["full", "reset"].includes(strategy)) {
      throw new Error(
        `Invalid sync strategy: ${strategy}. Must be "full" or "reset"`
      )
    }

    switch (strategy) {
      case "full":
        await this.fullSync()
        break
      case "reset":
        await this.resetSync()
        break
      default:
        await this.continueSync()
        break
    }
  }

  /**
   * Continue the sync of the entities no matter their status
   * @param sharedContext
   * @returns
   */
  private async continueSync() {
    if (!this.#isWorkerMode) {
      await this.baseRepository_.transaction(async (transactionManager) => {
        await this.indexMetadataService_.update(
          {
            selector: {
              status: [
                IndexMetadataStatus.DONE,
                IndexMetadataStatus.ERROR,
                IndexMetadataStatus.PROCESSING,
              ],
            },
            data: {
              status: IndexMetadataStatus.PENDING,
            },
          },
          { transactionManager }
        )

        this.eventBusModuleService_.emit({
          name: IndexModuleService.SyncSubscribersDescriptor.continueSync
            .eventName,
          data: {},
          options: {
            internal: true,
          },
        })
      })

      return
    }

    try {
      const entities = await this.configurationChecker_.checkChanges()

      if (!entities.length) {
        return
      }

      return await this.dataSynchronizer_.syncEntities(entities)
    } catch (e) {
      this.logger_.error(e)
      throw new Error("[Index engine] Failed to continue sync")
    }
  }

  private async fullSync() {
    if (!this.#isWorkerMode) {
      await this.baseRepository_.transaction(async (transactionManager) => {
        await promiseAll([
          this.indexMetadataService_.update(
            {
              selector: {
                status: [
                  IndexMetadataStatus.DONE,
                  IndexMetadataStatus.ERROR,
                  IndexMetadataStatus.PROCESSING,
                ],
              },
              data: {
                status: IndexMetadataStatus.PENDING,
              },
            },
            { transactionManager }
          ),
          this.indexSyncService_.update(
            {
              selector: { last_key: { $ne: null } },
              data: { last_key: null },
            },
            { transactionManager }
          ),
        ])

        await this.eventBusModuleService_.emit({
          name: IndexModuleService.SyncSubscribersDescriptor.fullSync.eventName,
          data: {},
          options: {
            internal: true,
          },
        })
      })

      return
    }

    try {
      const entities = await this.configurationChecker_.checkChanges()

      if (!entities.length) {
        return
      }

      return await this.dataSynchronizer_.syncEntities(entities)
    } catch (e) {
      this.logger_.error(e)
      throw new Error("[Index engine] Failed to full sync")
    }
  }

  private async resetSync() {
    if (!this.#isWorkerMode) {
      await this.baseRepository_.transaction(
        async (transactionManager: SqlEntityManager) => {
          const truncableTables = [
            toMikroORMEntity(IndexData).prototype,
            toMikroORMEntity(IndexRelation).prototype,
            toMikroORMEntity(IndexMetadata).prototype,
            toMikroORMEntity(IndexSync).prototype,
          ].map((table) => table.__helper.__meta.collection)

          await transactionManager.execute(
            `TRUNCATE TABLE ${truncableTables.join(", ")} CASCADE`
          )

          await this.eventBusModuleService_.emit({
            name: IndexModuleService.SyncSubscribersDescriptor.resetSync
              .eventName,
            data: {},
            options: {
              internal: true,
            },
          })
        }
      )

      return
    }

    try {
      const changes = await this.configurationChecker_.checkChanges()

      if (!changes.length) {
        return
      }

      await this.dataSynchronizer_.syncEntities(changes)
    } catch (e) {
      this.logger_.error(e)
      throw new Error("[Index engine] Failed to reset sync")
    }
  }
}
