/*******************************************************************************
 * models/product-variant.js
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "../interfaces"

import MoneyAmountSchema from "./schemas/money-amount"
import OptionValueSchema from "./schemas/option-value"

class ProductVariantModel extends BaseModel {
  static modelName = "ProductVariant"
  static schema = {
    title: { type: String, required: true },
    prices: { type: [MoneyAmountSchema], default: [], required: true },
    options: { type: [OptionValueSchema], default: [] },
    image: { type: String, default: "" },
  }
}

export default ProductVariantModel
