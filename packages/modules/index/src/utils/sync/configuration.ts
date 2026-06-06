import { simpleHash } from "@zjedene-medusa/framework/utils"
import { IndexTypes, InferEntityType, Logger } from "@zjedene-medusa/types"
import { IndexMetadata } from "@models"
import { schemaObjectRepresentationPropertiesToOmit } from "@types"
import { DataSynchronizer } from "../../services/data-synchronizer"
import { IndexMetadataService } from "../../services/index-metadata"
import { IndexSyncService } from "../../services/index-sync"
import { IndexMetadataStatus } from "../index-metadata-status"

export class Configuration {
  #schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
  #indexMetadataService: IndexMetadataService
  #indexSyncService: IndexSyncService
  #dataSynchronizer: DataSynchronizer
  #logger: Logger

  constructor({
    schemaObjectRepresentation,
    indexMetadataService,
    indexSyncService,
    dataSynchronizer,
    logger,
  }: {
    schemaObjectRepresentation: IndexTypes.SchemaObjectRepresentation
    indexMetadataService: IndexMetadataService
    indexSyncService: IndexSyncService
    dataSynchronizer: DataSynchronizer
    logger: Logger
  }) {
    this.#schemaObjectRepresentation = schemaObjectRepresentation ?? {}
    this.#indexMetadataService = indexMetadataService
    this.#indexSyncService = indexSyncService
    this.#dataSynchronizer = dataSynchronizer
    this.#logger = logger
  }

  async checkChanges(): Promise<InferEntityType<typeof IndexMetadata>[]> {
    this.#logger.info("[Index engine] Checking for index changes")
    const schemaObjectRepresentation = this.#schemaObjectRepresentation

    const currentConfig = await this.#indexMetadataService.list({})
    const currentConfigMap = new Map(
      currentConfig.map((c) => [c.entity, c] as const)
    )

    type modifiedConfig = {
      id?: string
      entity: string
      fields: string[]
      fields_hash: string
      status?: IndexMetadataStatus
    }[]

    type dataSyncEntry = {
      id?: string
      entity: string
      last_key: null
    }[]

    const entityPresent = new Set<string>()
    const newConfig: modifiedConfig = []
    const updatedConfig: modifiedConfig = []
    const deletedConfig: { entity: string }[] = []
    const idxSyncData: dataSyncEntry = []

    for (const [entityName, schemaEntityObjectRepresentation] of Object.entries(
      schemaObjectRepresentation
    )) {
      if (schemaObjectRepresentationPropertiesToOmit.includes(entityName)) {
        continue
      }

      const entity = schemaEntityObjectRepresentation.entity
      const fields = schemaEntityObjectRepresentation.fields.sort().join(",")
      const fields_hash = simpleHash(fields)

      const existingEntityConfig = currentConfigMap.get(entity)

      entityPresent.add(entity)
      if (
        !existingEntityConfig ||
        existingEntityConfig.fields_hash !== fields_hash
      ) {
        const meta = {
          id: existingEntityConfig?.id,
          entity,
          fields,
          fields_hash,
        }

        if (!existingEntityConfig) {
          newConfig.push(meta)
        } else {
          updatedConfig.push({
            ...meta,
            status: IndexMetadataStatus.PENDING,
          })
        }

        idxSyncData.push({
          entity,
          last_key: null,
        })
      }
    }

    for (const [entity] of currentConfigMap) {
      if (!entityPresent.has(entity)) {
        deletedConfig.push({ entity })
      }
    }

    if (newConfig.length > 0) {
      await this.#indexMetadataService.create(newConfig)
    }
    if (updatedConfig.length > 0) {
      await this.#indexMetadataService.update(updatedConfig)
    }

    if (deletedConfig.length > 0) {
      await this.#indexMetadataService.delete(deletedConfig)
      await this.#dataSynchronizer.removeEntities(
        deletedConfig.map((c) => c.entity)
      )
    }

    if (idxSyncData.length > 0) {
      const ids = await this.#indexSyncService.list({
        entity: idxSyncData.map((c) => c.entity),
      })
      idxSyncData.forEach((sync) => {
        const id = ids.find((i) => i.entity === sync.entity)?.id
        if (id) {
          sync.id = id
        }
      })

      await this.#indexSyncService.upsert(idxSyncData)
    }

    const changes = await this.#indexMetadataService.list({
      status: [
        IndexMetadataStatus.PENDING,
        IndexMetadataStatus.PROCESSING,
        IndexMetadataStatus.ERROR,
      ],
    })

    this.#logger.info(
      `[Index engine] Found ${changes.length} index change${
        changes.length > 1 ? "s" : ""
      } that are either pending or processing`
    )

    return changes
  }
}
