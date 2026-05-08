import * as zod from "zod"

export const AddCurrenciesSchema = zod.object({
  currencies: zod.array(zod.string()),
  pricePreferences: zod.record(zod.string(), zod.boolean()),
})
