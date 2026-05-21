import {
  ContainerRegistrationKeys,
  promiseAll,
} from "@medusajs/framework/utils"
import {
  StepResponse,
  WorkflowResponse,
  createStep,
  createWorkflow,
} from "@medusajs/framework/workflows-sdk"
import { ExecArgs } from "@medusajs/types"

type InventoryLevelMismatch = {
  id: string
  inventory_item_id: string
  location_id: string
  current_reserved_quantity: string
  current_raw_reserved_quantity: { value: string; precision: number } | null
  expected_reserved_quantity: string
}

const BIG_NUMBER_PRECISION = 20

const findMismatchedReservedQuantitiesStep = createStep(
  "find-mismatched-reserved-quantities",
  async (_, { container }) => {
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const result = await knex.raw(`
      WITH expected AS (
        SELECT
          il.id,
          il.inventory_item_id,
          il.location_id,
          il.reserved_quantity::text AS current_reserved_quantity,
          il.raw_reserved_quantity AS current_raw_reserved_quantity,
          COALESCE((
            SELECT SUM(ri.quantity)
            FROM reservation_item ri
            WHERE ri.inventory_item_id = il.inventory_item_id
              AND ri.location_id = il.location_id
              AND ri.deleted_at IS NULL
          ), 0)::text AS expected_reserved_quantity
        FROM inventory_level il
        WHERE il.deleted_at IS NULL
      )
      SELECT *
      FROM expected
      WHERE current_reserved_quantity::numeric <> expected_reserved_quantity::numeric
    `)

    return new StepResponse(result.rows as InventoryLevelMismatch[])
  }
)

const reconcileReservedQuantitiesStep = createStep(
  "reconcile-reserved-quantities",
  async ({ rows }: { rows: InventoryLevelMismatch[] }, { container }) => {
    if (!rows.length) {
      return new StepResponse(0, [])
    }

    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    await promiseAll(
      rows.map((row) => {
        const rawValue = {
          value: Number(row.expected_reserved_quantity).toPrecision(
            BIG_NUMBER_PRECISION
          ),
          precision: BIG_NUMBER_PRECISION,
        }

        return knex("inventory_level")
          .where({ id: row.id })
          .update({
            reserved_quantity: knex.raw("?::numeric", [
              row.expected_reserved_quantity,
            ]),
            raw_reserved_quantity: JSON.stringify(rawValue),
          })
      })
    )

    return new StepResponse(rows.length, rows)
  },
  async (rows, { container }) => {
    if (!rows?.length) {
      return
    }

    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    await promiseAll(
      rows.map((row) =>
        knex("inventory_level")
          .where({ id: row.id })
          .update({
            reserved_quantity: knex.raw("?::numeric", [
              row.current_reserved_quantity,
            ]),
            raw_reserved_quantity: row.current_raw_reserved_quantity
              ? JSON.stringify(row.current_raw_reserved_quantity)
              : null,
          })
      )
    )
  }
)

const reconcileInventoryReservedQuantityWorkflow = createWorkflow(
  "reconcile-inventory-reserved-quantity",
  () => {
    const rows = findMismatchedReservedQuantitiesStep()
    reconcileReservedQuantitiesStep({ rows })
    return new WorkflowResponse({})
  }
)

export default async function reconcileInventoryReservedQuantity({
  container,
}: ExecArgs) {
  const logger = container.resolve("logger")

  logger.info(
    "Starting reconciliation of inventory_level.reserved_quantity against active reservation_item rows..."
  )

  await reconcileInventoryReservedQuantityWorkflow(container).run({})

  logger.info("Finished reconciliation of inventory_level.reserved_quantity.")
}
