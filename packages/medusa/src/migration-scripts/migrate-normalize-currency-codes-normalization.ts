import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { ExecArgs } from "@medusajs/types"

export default async function migrateNormalizeCurrencyCodes({
  container,
}: ExecArgs) {
  const knex = container.resolve(ContainerRegistrationKeys.PG_CONNECTION)

  await knex.transaction(async (trx) => {
    const tables = [
      "cart",
      "payment_collection",
      "payment_session",
      "payment",
      "order",
      "order_transaction",
      "price",
      "region",
      "store_currency",
    ]

    for (const table of tables) {
      await trx(table)
        .whereNotNull("currency_code")
        .update({
          currency_code: knex.raw("LOWER(currency_code)"),
        })
    }

    await trx.raw(`
      UPDATE index_data
      SET data = jsonb_set(data, '{currency_code}', to_jsonb(LOWER(data->>'currency_code')))
      WHERE name = 'Price'
        AND data->>'currency_code' IS NOT NULL
        AND data->>'currency_code' <> LOWER(data->>'currency_code')
    `)
  })
}
