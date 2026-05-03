import { MedusaModule } from "@medusajs/framework/modules-sdk"
import { IOrderModuleService } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  createRawPropertiesFromBigNumber,
  decorateCartTotals,
  Modules,
} from "@medusajs/framework/utils"
import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"
import { ExecArgs } from "@medusajs/types"

type SummaryRecord = {
  id: string
  order_id: string
  version: number
  totals: Record<string, any> | null
}

const retrieveOrderSummariesMissingTotalsStep = createStep(
  "retrieve-order-summaries-missing-totals",
  async (_, { container }) => {
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    // We join with the order table to only fetch summaries for the CURRENT
    // version of each order. Older versions cannot be accurately recomputed
    // since listOrders always returns the order at its current state.
    const records: SummaryRecord[] = await knex("order_summary as os")
      .join("order as o", function () {
        this.on("o.id", "=", "os.order_id").andOnNull("o.deleted_at")
      })
      .whereNull("os.deleted_at")
      .whereRaw("os.version = o.version")
      .where((builder) => {
        builder
          .whereNull("os.totals")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'subtotal')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'tax_total')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'original_tax_total')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'shipping_total')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'original_shipping_total')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'discount_total')")
          .orWhereRaw("NOT jsonb_exists(os.totals, 'discount_tax_total')")
      })
      .select("os.id", "os.order_id", "os.version", "os.totals")

    return new StepResponse(records)
  }
)

const backfillOrderSummaryTotalsStep = createStep(
  "backfill-order-summary-totals",
  async (records: SummaryRecord[], { container }) => {
    if (!records.length) {
      return new StepResponse(0, [])
    }

    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
    const orderService: IOrderModuleService = container.resolve(Modules.ORDER)

    const previousTotals: { id: string; totals: SummaryRecord["totals"] }[] =
      []

    // Batch-fetch all orders in one query instead of one per record.
    // Including "total" in select triggers shouldIncludeTotals(), which
    // automatically loads items, items.tax_lines, items.adjustments,
    // shipping_methods, shipping_methods.tax_lines, shipping_methods.adjustments
    // — everything decorateCartTotals needs to compute accurate totals.
    const orderIds = records.map((r) => r.order_id)
    const orders = await orderService.listOrders(
      { id: orderIds },
      {
        select: [
          "id",
          "currency_code",
          "total",
          "subtotal",
          "tax_total",
          "shipping_total",
          "discount_total",
        ],
      }
    )
    const ordersById = new Map(orders.map((o) => [o.id, o]))

    for (const record of records) {
      const order = ordersById.get(record.order_id)

      if (!order) {
        continue
      }

      previousTotals.push({ id: record.id, totals: record.totals })

      // decorateCartTotals computes all breakdown fields (subtotal, tax_total,
      // shipping_total, discount_total, etc.) using Medusa's own pricing logic,
      // correctly handling tax-inclusive prices, adjustments, and deleted rows.
      const orderWithTotals = decorateCartTotals(order as any)

      createRawPropertiesFromBigNumber(orderWithTotals)

      const existingTotals = record.totals ?? {}

      const newTotals = {
        ...existingTotals,
        subtotal:
          existingTotals.subtotal ?? (orderWithTotals as any).subtotal,
        tax_total:
          existingTotals.tax_total ?? (orderWithTotals as any).tax_total,
        original_tax_total:
          existingTotals.original_tax_total ??
          (orderWithTotals as any).original_tax_total,
        shipping_total:
          existingTotals.shipping_total ??
          (orderWithTotals as any).shipping_total,
        original_shipping_total:
          existingTotals.original_shipping_total ??
          (orderWithTotals as any).original_shipping_total,
        discount_total:
          existingTotals.discount_total ??
          (orderWithTotals as any).discount_total,
        discount_tax_total:
          existingTotals.discount_tax_total ??
          (orderWithTotals as any).discount_tax_total,
        raw_subtotal:
          existingTotals.raw_subtotal ??
          (orderWithTotals as any).raw_subtotal,
        raw_tax_total:
          existingTotals.raw_tax_total ??
          (orderWithTotals as any).raw_tax_total,
        raw_original_tax_total:
          existingTotals.raw_original_tax_total ??
          (orderWithTotals as any).raw_original_tax_total,
        raw_shipping_total:
          existingTotals.raw_shipping_total ??
          (orderWithTotals as any).raw_shipping_total,
        raw_original_shipping_total:
          existingTotals.raw_original_shipping_total ??
          (orderWithTotals as any).raw_original_shipping_total,
        raw_discount_total:
          existingTotals.raw_discount_total ??
          (orderWithTotals as any).raw_discount_total,
        raw_discount_tax_total:
          existingTotals.raw_discount_tax_total ??
          (orderWithTotals as any).raw_discount_tax_total,
      }

      await knex("order_summary")
        .where("id", record.id)
        .update({ totals: JSON.stringify(newTotals) })
    }

    return new StepResponse(records.length, previousTotals)
  },
  async (previousTotals, { container }) => {
    if (!previousTotals?.length) {
      return
    }

    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    for (const { id, totals } of previousTotals) {
      await knex("order_summary")
        .where("id", id)
        .update({ totals: totals ? JSON.stringify(totals) : null })
    }
  }
)

const migrateOrderSummaryTotalsWorkflow = createWorkflow(
  "migrate-order-summary-totals",
  () => {
    const summaries = retrieveOrderSummariesMissingTotalsStep()
    backfillOrderSummaryTotalsStep(summaries)
    return new WorkflowResponse(void 0)
  }
)

export default async function migrateOrderSummaryTotals({
  container,
}: ExecArgs) {
  if (!MedusaModule.isInstalled(Modules.ORDER)) {
    return
  }

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Starting backfill of order summary breakdown totals...")
  await migrateOrderSummaryTotalsWorkflow(container).run()
  logger.info("Finished backfill of order summary breakdown totals.")
}
