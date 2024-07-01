/**
 * TODO: Not sure how to type this properly, as it's unclear to me what is returned
 * by our API. As an example we return `price_list: null` but `price_list_id` is missing.
 *
 * Type in model that aren't currently in this type:
 * - price_list_id
 * - price_list
 * - price_rules
 * - rules_count
 *
 * Also `raw_amount` is typed as `Record<string, unknown>` but it seems to always return:
 * ```ts
 * {
 *   amount: number
 *   precision: number
 * }
 * ```
 */
export interface AdminPrice {
  id: string
  title: string
  currency_code: string
  amount: number
  raw_amount: Record<string, unknown>
  min_quantity: number | null
  max_quantity: number | null
  price_set_id: string
  created_at: string
  updated_at: string
  deleted_at: string | null
}
