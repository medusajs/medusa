import {
  CommonEvents,
  ContainerRegistrationKeys,
  Modules,
  promiseAll,
} from "@zjedene-medusa/framework/utils"
import {
  Event,
  ILockingModule,
  IndexTypes,
  Logger,
  ModulesSdkTypes,
  RemoteQueryFunction,
  SchemaObjectEntityRepresentation,
} from "@zjedene-medusa/types"
import { IndexMetadataStatus, Orchestrator } from "@utils"
import { setTimeout } from "timers/promises"
export class DataSynchronizer {
  #container: Record<string, any>
  #isReady: boolean = false
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #storageProvider: IndexTypes.StorageProvider
  #orchestrator!: Orchestrator

  get #query() {
    return this.#container[
      ContainerRegistrationKeys.QUERY
    ] as RemoteQueryFunction
  }

  get #locking() {
    return this.#container[Modules.LOCKING] as ILockingModule
  }

  get #indexMetadataService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexMetadataService
  }

  get #indexSyncService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexSyncService
  }

  // @ts-ignore
  get #indexRelationService(): ModulesSdkTypes.IMedusaInternalService<any> {
    return this.#container.indexRelationService
  }

  get #logger(): Logger {
    try {
      return this.#container.logger
    } catch (err) {
      return console as unknown as Logger
    }
  }

  constructor(container: Record<string, any>) {
    this.#container = container
  }

  #isReadyOrThrow() {
    if (!this.#isReady) {
      throw new Error(
        "DataSynchronizer is not ready. Call onApplicationStart first."
      )
    }
  }

  onApplicationStart({
    schemaObjectRepresentation,
    storageProvider,
  }: {
    lockDuration?: number
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
    storageProvider: IndexTypes.StorageProvider
  }) {
    this.#storageProvider = storageProvider
    this.#schemaObjectRepresentation = schemaObjectRepresentation

    this.#isReady = true
  }

  async syncEntities(
    entities: {
      entity: string
      fields: string
      fields_hash: string
    }[],
    lockDuration: number = 60 // 1 minute
  ) {
    this.#isReadyOrThrow()
    const entitiesToSync = entities.map((entity) => entity.entity)
    this.#orchestrator = new Orchestrator(this.#locking, entitiesToSync, {
      lockDuration,
      logger: this.#logger,
    })
    await this.#orchestrator.process(this.#taskRunner.bind(this))
  }

  async removeEntities(entities: string[], staleOnly: boolean = false) {
    this.#isReadyOrThrow()

    const staleCondition = staleOnly ? "staled_at IS NOT NULL" : ""

    for (const entity of entities) {
      await this.#container.manager.execute(
        `WITH deleted_data AS (
          DELETE FROM "index_data"
          WHERE "name" = ? ${staleCondition ? `AND ${staleCondition}` : ""}
          RETURNING id
        )
        DELETE FROM "index_relation"
        WHERE ("parent_name" = ? AND "parent_id" IN (SELECT id FROM deleted_data))
           OR ("child_name" = ? AND "child_id" IN (SELECT id FROM deleted_data))`,
        [entity, entity, entity]
      )
    }
  }

  async #updatedStatus(entity: string, status: IndexMetadataStatus) {
    await this.#indexMetadataService.update({
      data: {
        status,
      },
      selector: {
        entity,
      },
    })
  }

  async #taskRunner(entity: string) {
    this.#logger.info(`[Index engine] syncing entity '${entity}'`)

    const [[lastCursor]] = await promiseAll([
      this.#indexSyncService.list(
        {
          entity,
        },
        {
          select: ["last_key"],
        }
      ),
      this.#updatedStatus(entity, IndexMetadataStatus.PROCESSING),
      this.#container.manager.execute(
        `UPDATE "index_data" SET "staled_at" = NOW() WHERE "name" = ?`,
        [entity]
      ),
    ])

    let startTime = performance.now()
    let chunkStartTime = startTime

    const finalAcknoledgement = await this.syncEntity({
      entityName: entity,
      pagination: {
        cursor: lastCursor?.last_key,
      },
      ack: async (ack) => {
        const endTime = performance.now()
        const chunkElapsedTime = (endTime - chunkStartTime).toFixed(2)

        if (ack.lastCursor) {
          this.#logger.debug(
            `[Index engine] syncing entity '${entity}' updating last cursor to ${ack.lastCursor} (+${chunkElapsedTime}ms)`
          )

          await this.#indexSyncService.update({
            data: {
              last_key: ack.lastCursor,
            },
            selector: {
              entity,
            },
          })

          if (!ack.done && !ack.err) {
            await this.#orchestrator.renewLock(entity)
          }
        }

        if (ack.err) {
          this.#logger.error(
            `[Index engine] syncing entity '${entity}' failed with error (+${chunkElapsedTime}ms):\n${ack.err.message}`
          )
        }

        if (ack.done) {
          const elapsedTime = (endTime - startTime).toFixed(2)
          this.#logger.info(
            `[Index engine] syncing entity '${entity}' done (+${elapsedTime}ms)`
          )
        }

        chunkStartTime = performance.now()
      },
    })

    if (finalAcknoledgement.done) {
      await promiseAll([
        this.#updatedStatus(entity, IndexMetadataStatus.DONE),
        this.#indexSyncService.update({
          data: {
            last_key: finalAcknoledgement.lastCursor,
          },
          selector: {
            entity,
          },
        }),
        this.removeEntities([entity], true),
      ])
    }

    if (finalAcknoledgement.err) {
      await this.#updatedStatus(entity, IndexMetadataStatus.ERROR)
    }
  }

  async syncEntity({
    entityName,
    pagination = {},
    ack,
  }: {
    entityName: string
    pagination?: {
      cursor?: string
      updated_at?: string | Date
      limit?: number
      batchSize?: number
    }
    ack: (ack: {
      lastCursor: string | null
      done?: boolean
      err?: Error
    }) => Promise<void>
  }): Promise<{
    lastCursor: string | null
    done?: boolean
    err?: Error
  }> {
    this.#isReadyOrThrow()

    const schemaEntityObjectRepresentation = this.#schemaObjectRepresentation[
      entityName
    ] as SchemaObjectEntityRepresentation

    const { alias, moduleConfig } = schemaEntityObjectRepresentation
    const isLink = !!moduleConfig?.isLink

    if (!alias) {
      this.#logger.info(
        `[Index engine] Cannot find Entity '${entityName}' alias. Skipping.`
      )

      const acknoledgement = {
        lastCursor: pagination.cursor ?? null,
        done: true,
      }

      await ack(acknoledgement)
      return acknoledgement
    }

    const entityPrimaryKey = "id"
    const moduleHasId = !!moduleConfig?.primaryKeys?.includes("id")
    if (!moduleHasId) {
      const acknoledgement = {
        lastCursor: pagination.cursor ?? null,
        err: new Error(
          `Entity ${entityName} does not have a property 'id'. The 'id' must be provided and must be orderable (e.g ulid)`
        ),
      }

      await ack(acknoledgement)
      return acknoledgement
    }

    let processed = 0
    let currentCursor = pagination.cursor!
    const batchSize = Math.min(pagination.batchSize ?? 100, 100)
    const limit = pagination.limit ?? Infinity
    let error = null

    while (processed < limit) {
      const filters: Record<string, any> = {}

      if (currentCursor) {
        filters[entityPrimaryKey] = { $gt: currentCursor }
      }

      if (pagination.updated_at) {
        filters["updated_at"] = { $gt: pagination.updated_at }
      }

      const queryResult = await this.#query.graph({
        entity: alias,
        fields: [entityPrimaryKey],
        filters,
        pagination: {
          order: {
            [entityPrimaryKey]: "asc",
          },
          take: batchSize,
        },
      })

      if (!queryResult?.data?.length) {
        break
      }

      const data = queryResult.data

      const envelop: Event = {
        data,
        name: !isLink
          ? `*.${CommonEvents.CREATED}`
          : `*.${CommonEvents.ATTACHED}`,
      }

      try {
        await this.#storageProvider.consumeEvent(
          schemaEntityObjectRepresentation
        )(envelop)
        currentCursor = data[data.length - 1][entityPrimaryKey]
        processed += data.length

        await ack({ lastCursor: currentCursor })
      } catch (err) {
        error = err
        break
      }

      await setTimeout(0, undefined, { ref: false })
    }

    let acknoledgement: { lastCursor: string; done?: boolean; err?: Error } = {
      lastCursor: currentCursor,
      done: true,
    }

    if (error) {
      acknoledgement = {
        lastCursor: currentCursor,
        err: error,
      }
      await ack(acknoledgement)
      return acknoledgement
    }

    await ack(acknoledgement)
    return acknoledgement
  }
}
