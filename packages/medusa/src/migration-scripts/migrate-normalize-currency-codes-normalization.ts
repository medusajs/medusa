import { ContainerRegistrationKeys, promiseAll } from "@medusajs/framework/utils"
import { createStep, createWorkflow, StepResponse, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { ExecArgs } from "@medusajs/types"

type CurrencyRecord = { id: string; currency_code: string }

const retrieveNonNormalizedCurrencyCodesStep = createStep(
    `retrieve-non-normalized-currency-codes`,
    async ({ table }: { table: string }, { container }) => {
      const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
      const records: CurrencyRecord[] = await knex(table)
        .whereNotNull("currency_code")
        .whereRaw("currency_code <> LOWER(currency_code)")
        .select("id", "currency_code")
      return new StepResponse(records)
    }
  )

const updateCurrencyCodesStep = createStep(
    `update-currency-codes`,
    async ({ records, table }: { records: CurrencyRecord[]; table: string }, { container }) => {
      if (!records.length) {
        return new StepResponse(0, { records, table })
      }
      const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
      const response = await knex(table)
        .whereIn("id", records.map((r) => r.id))
        .update({ currency_code: knex.raw("LOWER(currency_code)") })

      return new StepResponse(response, { records, table })
    },
    async (data, { container }) => {
      if (!data) return
      const { records, table } = data
      const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)
      await promiseAll(
        records.map((r) =>
          knex(table).where("id", r.id).update({ currency_code: r.currency_code })
        )
      )
    }
  )

const updateIndexDataStep = createStep(
  "update-index-data-currency-codes",
  async (_, { container }) => {
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    const indexDataTableExists = await knex.raw(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables
        WHERE table_name = 'index_data'
      )
    `)
    let prevData: any[] | undefined = undefined

    if (indexDataTableExists.rows[0]?.exists) {
      const result = await knex.raw(`
        WITH prev AS (
          SELECT id, data FROM index_data
          WHERE name = 'Price'
            AND data->>'currency_code' IS NOT NULL
            AND data->>'currency_code' <> LOWER(data->>'currency_code')
        ),
        updated AS (
          UPDATE index_data
          SET data = jsonb_set(data, '{currency_code}', to_jsonb(LOWER(data->>'currency_code')))
          WHERE id IN (SELECT id FROM prev)
          RETURNING id
        )
        SELECT id, data FROM prev
      `)
      prevData = result.rows
    }

    return new StepResponse(void 0, prevData)
  },
  async (data, { container }) => {
    if (!data) {
      return
    }
    const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

    await promiseAll(
      data.map(async (d: any) => {
        await knex("index_data")
          .where("id", d.id)
          .update({
            data: d.data,
          })
      })
    )
  }
)

const migrateNormalizeCurrencyCodesWorkflow = createWorkflow(
  "migrate-normalize-currency-codes",
  () => {
    const carts = retrieveNonNormalizedCurrencyCodesStep({ table: "cart" })
      .config({ name: "retrieve-cart-currency-codes" })
    updateCurrencyCodesStep({
      records: carts,
      table: "cart",
    }).config({ name: "update-cart-currency-codes" })

    const paymentCollections = retrieveNonNormalizedCurrencyCodesStep({ table: "payment_collection" })
      .config({ name: "retrieve-payment-collection-currency-codes" })
    updateCurrencyCodesStep({
      records: paymentCollections,
      table: "payment_collection",
    }).config({ name: "update-payment-collection-currency-codes" })

    const paymentSessions = retrieveNonNormalizedCurrencyCodesStep({ table: "payment_session" })
      .config({ name: "retrieve-payment-session-currency-codes" })
    updateCurrencyCodesStep({
      records: paymentSessions,
      table: "payment_session",
    }).config({ name: "update-payment-session-currency-codes" })

    const payments = retrieveNonNormalizedCurrencyCodesStep({ table: "payment" })
      .config({ name: "retrieve-payment-currency-codes" })
    updateCurrencyCodesStep({
      records: payments,
      table: "payment",
    }).config({ name: "update-payment-currency-codes" })

    const orders = retrieveNonNormalizedCurrencyCodesStep({ table: "order" })
      .config({ name: "retrieve-order-currency-codes" })
    updateCurrencyCodesStep({
      records: orders,
      table: "order",
    }).config({ name: "update-order-currency-codes" })

    const orderTransactions = retrieveNonNormalizedCurrencyCodesStep({ table: "order_transaction" })
      .config({ name: "retrieve-order-transaction-currency-codes" })
    updateCurrencyCodesStep({
      records: orderTransactions,
      table: "order_transaction",
    }).config({ name: "update-order-transaction-currency-codes" })

    const prices = retrieveNonNormalizedCurrencyCodesStep({ table: "price" })
      .config({ name: "retrieve-price-currency-codes" })
    updateCurrencyCodesStep({
      records: prices,
      table: "price",
    }).config({ name: "update-price-currency-codes" })

    const regions = retrieveNonNormalizedCurrencyCodesStep({ table: "region" })
      .config({ name: "retrieve-region-currency-codes" })
    updateCurrencyCodesStep({
      records: regions,
      table: "region",
    }).config({ name: "update-region-currency-codes" })

    const storeCurrencies = retrieveNonNormalizedCurrencyCodesStep({ table: "store_currency" })
      .config({ name: "retrieve-store-currency-currency-codes" })
    updateCurrencyCodesStep({
      records: storeCurrencies,
      table: "store_currency",
    }).config({ name: "update-store-currency-currency-codes" })
    
    updateIndexDataStep()

    return new WorkflowResponse({})
  }
)

export default async function migrateNormalizeCurrencyCodes({
  container,
}: ExecArgs) {
  const logger = container.resolve("logger")

  logger.info("Starting migration to normalize currency codes...")
  await migrateNormalizeCurrencyCodesWorkflow(container).run({})
  logger.info("Finished migration to normalize currency codes.")
}
