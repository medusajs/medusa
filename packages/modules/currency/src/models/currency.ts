import { model } from "@medusajs/utils"

export default model.define("currency", {
  code: model.id({ generateId: false }),
  symbol: model.text(),
  symbol_native: model.text(),
  name: model.text(),
  decimal_digits: model.number().default(0),
  rounding: model.bigNumber().default(0),
})
