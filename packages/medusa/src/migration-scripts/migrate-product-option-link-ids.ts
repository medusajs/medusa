import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { ExecArgs, Logger } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  generateEntityId,
} from "@medusajs/framework/utils"

const BATCH_SIZE = 1000

type PgConnection = {
  raw: <T = unknown>(
    query: string,
    bindings?: unknown[]
  ) => Promise<{ rows: T[] }>
}

type UpdateIdsOptions = {
  tableName: string
  idPrefix: string
  pgConnection: PgConnection
  logger: Logger
}

async function updateIdsInBatches({
  tableName,
  idPrefix,
  pgConnection,
  logger,
}: UpdateIdsOptions): Promise<void> {
  const idPrefixPattern = `${idPrefix}_%`

  const { rows: countRows } = await pgConnection.raw<{ count: string }>(
    `select count(id)::int as count from "${tableName}" where id not like ?`,
    [idPrefixPattern]
  )
  const totalRows = Number(countRows[0]?.count ?? 0)
  const maxBatches = Math.ceil(totalRows / BATCH_SIZE)
  let batchCount = 0
  let updatedRows = 0

  if (!totalRows) {
    logger.info(`No ids to rewrite in ${tableName}. Skipping.`)
    return
  }

  logger.info(`Rewriting ${totalRows} ids in ${tableName}...`)

  while (batchCount < maxBatches) {
    const { rows } = await pgConnection.raw<{ id: string }>(
      `select id from "${tableName}" where id not like ? order by id limit ?`,
      [idPrefixPattern, BATCH_SIZE]
    )

    if (!rows.length) {
      break
    }

    batchCount += 1

    const idMappings = rows.map((row) => ({
      oldId: row.id,
      newId: generateEntityId(undefined, idPrefix),
    }))

    const valuesClause = idMappings.map(() => "(?, ?)").join(", ")
    const bindings = idMappings.flatMap((entry) => [entry.oldId, entry.newId])

    await pgConnection.raw(
      `update "${tableName}" as t
        set id = v.new_id
        from (values ${valuesClause}) as v(old_id, new_id)
        where t.id = v.old_id`,
      bindings
    )

    updatedRows += rows.length

    logger.info(`Rewrote ${updatedRows}/${totalRows} ids in ${tableName}.`)
  }

  logger.info(`Finished rewriting ${updatedRows} ids in ${tableName}.`)
}

export default async function migrateProductOptionLinkIds({
  container,
}: ExecArgs) {
  if (!MedusaModule.isInstalled(Modules.PRODUCT)) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const pgConnection = container.resolve(
    ContainerRegistrationKeys.PG_CONNECTION
  )

  logger.info("Starting migration of product option link ids...")

  try {
    await pgConnection.transaction(async (trx) => {
      await updateIdsInBatches({
        tableName: "product_product_option",
        idPrefix: "prodopt",
        pgConnection: trx,
        logger,
      })

      await updateIdsInBatches({
        tableName: "product_product_option_value",
        idPrefix: "prodoptval",
        pgConnection: trx,
        logger,
      })
    })

    logger.info("Finished migration of product option link ids.")
  } catch (error) {
    logger.error(error)
    throw error
  }
}
