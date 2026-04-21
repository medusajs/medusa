import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/framework/types"

export default async function migrateOrderSummaryTotals({
  container,
}: ExecArgs) {
  const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  logger.info("Backfilling order summary breakdown totals")

  await knex.transaction(async (trx) => {
    await trx.raw(`
      WITH summary_rows AS (
        SELECT
          id,
          order_id,
          version,
          COALESCE(totals, '{}'::jsonb) AS totals
        FROM "order_summary"
        WHERE deleted_at IS NULL
          AND (
            totals IS NULL
            OR NOT totals ? 'subtotal'
            OR NOT totals ? 'tax_total'
            OR NOT totals ? 'original_tax_total'
            OR NOT totals ? 'shipping_total'
            OR NOT totals ? 'original_shipping_total'
            OR NOT totals ? 'discount_total'
            OR NOT totals ? 'discount_tax_total'
          )
      ),
      line_item_adjustments AS (
        SELECT
          item_id,
          version,
          SUM(
            CASE
              WHEN is_tax_inclusive = true THEN amount / (1 + tax_rate)
              ELSE amount
            END
          ) AS discount_subtotal
        FROM (
          SELECT
            adj.item_id,
            adj.version,
            adj.amount,
            adj.is_tax_inclusive,
            COALESCE(SUM(tax.rate), 0) / 100 AS tax_rate
          FROM "order_line_item_adjustment" adj
          LEFT JOIN "order_line_item_tax_line" tax ON tax.item_id = adj.item_id
          GROUP BY adj.id, adj.item_id, adj.version, adj.amount, adj.is_tax_inclusive
        ) adjustment_totals
        GROUP BY item_id, version
      ),
      line_item_totals AS (
        SELECT
          sr.id AS summary_id,
          SUM(amounts.subtotal) AS item_subtotal,
          SUM(taxes.tax_total) AS item_tax_total,
          SUM(taxes.original_tax_total) AS item_original_tax_total,
          SUM(discount_totals.discount_total) AS item_discount_total,
          SUM(discounts.discount_tax_total) AS item_discount_tax_total
        FROM summary_rows sr
        JOIN "order_item" oi ON oi.order_id = sr.order_id
          AND oi.version = sr.version
          AND oi.deleted_at IS NULL
        JOIN "order_line_item" oli ON oli.id = oi.item_id
        LEFT JOIN line_item_adjustments lia ON lia.item_id = oi.item_id
          AND lia.version = oi.version
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(rate), 0) / 100 AS tax_rate
          FROM "order_line_item_tax_line"
          WHERE item_id = oi.item_id
        ) tax ON true
        CROSS JOIN LATERAL (
          SELECT
            GREATEST(
              oi.quantity - COALESCE(oi.return_received_quantity, 0) - COALESCE(oi.return_dismissed_quantity, 0),
              0
            ) AS current_quantity
        ) quantity
        CROSS JOIN LATERAL (
          SELECT
            CASE
              WHEN oli.is_tax_inclusive = true THEN (oli.unit_price * quantity.current_quantity) / (1 + tax.tax_rate)
              ELSE oli.unit_price * quantity.current_quantity
            END AS subtotal,
            CASE
              WHEN oi.quantity = 0 THEN 0
              ELSE COALESCE(lia.discount_subtotal, 0) / oi.quantity * quantity.current_quantity
            END AS discount_subtotal
        ) amounts
        CROSS JOIN LATERAL (
          SELECT
            amounts.subtotal * tax.tax_rate AS original_tax_total,
            (amounts.subtotal - amounts.discount_subtotal) * tax.tax_rate AS tax_total
        ) taxes
        CROSS JOIN LATERAL (
          SELECT
            taxes.original_tax_total - taxes.tax_total AS discount_tax_total
        ) discounts
        CROSS JOIN LATERAL (
          SELECT
            amounts.discount_subtotal + discounts.discount_tax_total AS discount_total
        ) discount_totals
        GROUP BY sr.id
      ),
      shipping_adjustments AS (
        SELECT
          shipping_method_id,
          version,
          SUM(amount) AS discount_subtotal
        FROM "order_shipping_method_adjustment"
        GROUP BY shipping_method_id, version
      ),
      shipping_totals AS (
        SELECT
          sr.id AS summary_id,
          SUM(totals.shipping_total) AS shipping_total,
          SUM(totals.original_shipping_total) AS original_shipping_total,
          SUM(taxes.tax_total) AS shipping_tax_total,
          SUM(taxes.original_tax_total) AS shipping_original_tax_total,
          SUM(totals.discount_total) AS shipping_discount_total,
          SUM(discounts.discount_tax_total) AS shipping_discount_tax_total
        FROM summary_rows sr
        JOIN "order_shipping" os ON os.order_id = sr.order_id
          AND os.version = sr.version
          AND os.deleted_at IS NULL
        JOIN "order_shipping_method" osm ON osm.id = os.shipping_method_id
        LEFT JOIN shipping_adjustments sa ON sa.shipping_method_id = os.shipping_method_id
          AND sa.version = os.version
        LEFT JOIN LATERAL (
          SELECT COALESCE(SUM(rate), 0) / 100 AS tax_rate
          FROM "order_shipping_method_tax_line"
          WHERE shipping_method_id = os.shipping_method_id
        ) tax ON true
        CROSS JOIN LATERAL (
          SELECT
            CASE
              WHEN osm.is_tax_inclusive = true THEN osm.amount / (1 + tax.tax_rate)
              ELSE osm.amount
            END AS subtotal,
            COALESCE(sa.discount_subtotal, 0) AS discount_subtotal
        ) amounts
        CROSS JOIN LATERAL (
          SELECT
            amounts.subtotal * tax.tax_rate AS original_tax_total,
            (amounts.subtotal - amounts.discount_subtotal) * tax.tax_rate AS tax_total
        ) taxes
        CROSS JOIN LATERAL (
          SELECT
            taxes.original_tax_total - taxes.tax_total AS discount_tax_total
        ) discounts
        CROSS JOIN LATERAL (
          SELECT
            amounts.subtotal - amounts.discount_subtotal + taxes.tax_total AS shipping_total,
            CASE
              WHEN osm.is_tax_inclusive = true THEN osm.amount
              ELSE amounts.subtotal + taxes.original_tax_total
            END AS original_shipping_total,
            amounts.discount_subtotal + discounts.discount_tax_total AS discount_total
        ) totals
        GROUP BY sr.id
      ),
      backfill_totals AS (
        SELECT
          sr.id,
          COALESCE(li.item_subtotal, 0) + COALESCE(sh.shipping_total, 0) - COALESCE(sh.shipping_tax_total, 0) + COALESCE(sh.shipping_discount_total, 0) - COALESCE(sh.shipping_discount_tax_total, 0) AS subtotal,
          COALESCE(li.item_tax_total, 0) + COALESCE(sh.shipping_tax_total, 0) AS tax_total,
          COALESCE(li.item_original_tax_total, 0) + COALESCE(sh.shipping_original_tax_total, 0) AS original_tax_total,
          COALESCE(sh.shipping_total, 0) AS shipping_total,
          COALESCE(sh.original_shipping_total, 0) AS original_shipping_total,
          COALESCE(li.item_discount_total, 0) + COALESCE(sh.shipping_discount_total, 0) AS discount_total,
          COALESCE(li.item_discount_tax_total, 0) + COALESCE(sh.shipping_discount_tax_total, 0) AS discount_tax_total
        FROM summary_rows sr
        LEFT JOIN line_item_totals li ON li.summary_id = sr.id
        LEFT JOIN shipping_totals sh ON sh.summary_id = sr.id
      )
      UPDATE "order_summary" os
      SET totals = sr.totals || jsonb_build_object(
        'subtotal', COALESCE(sr.totals->'subtotal', to_jsonb(bt.subtotal)),
        'tax_total', COALESCE(sr.totals->'tax_total', to_jsonb(bt.tax_total)),
        'original_tax_total', COALESCE(sr.totals->'original_tax_total', to_jsonb(bt.original_tax_total)),
        'shipping_total', COALESCE(sr.totals->'shipping_total', to_jsonb(bt.shipping_total)),
        'original_shipping_total', COALESCE(sr.totals->'original_shipping_total', to_jsonb(bt.original_shipping_total)),
        'discount_total', COALESCE(sr.totals->'discount_total', to_jsonb(bt.discount_total)),
        'discount_tax_total', COALESCE(sr.totals->'discount_tax_total', to_jsonb(bt.discount_tax_total)),
        'raw_subtotal', COALESCE(sr.totals->'raw_subtotal', jsonb_build_object('value', bt.subtotal::text, 'precision', 20)),
        'raw_tax_total', COALESCE(sr.totals->'raw_tax_total', jsonb_build_object('value', bt.tax_total::text, 'precision', 20)),
        'raw_original_tax_total', COALESCE(sr.totals->'raw_original_tax_total', jsonb_build_object('value', bt.original_tax_total::text, 'precision', 20)),
        'raw_shipping_total', COALESCE(sr.totals->'raw_shipping_total', jsonb_build_object('value', bt.shipping_total::text, 'precision', 20)),
        'raw_original_shipping_total', COALESCE(sr.totals->'raw_original_shipping_total', jsonb_build_object('value', bt.original_shipping_total::text, 'precision', 20)),
        'raw_discount_total', COALESCE(sr.totals->'raw_discount_total', jsonb_build_object('value', bt.discount_total::text, 'precision', 20)),
        'raw_discount_tax_total', COALESCE(sr.totals->'raw_discount_tax_total', jsonb_build_object('value', bt.discount_tax_total::text, 'precision', 20))
      )
      FROM summary_rows sr
      JOIN backfill_totals bt ON bt.id = sr.id
      WHERE os.id = sr.id
    `)
  })

  logger.info("Order summary breakdown totals backfilled successfully")
}
