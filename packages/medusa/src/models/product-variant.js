/*******************************************************************************
 * models/product-variant.js
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import MoneyAmountSchema from "./schemas/money-amount"
import OptionValueSchema from "./schemas/option-value"

class ProductVariantModel extends BaseModel {
  static modelName = "ProductVariant"
  static schema = {
    title: { type: String, required: true },
    prices: { type: [MoneyAmountSchema], default: [], required: true },
    options: { type: [OptionValueSchema], default: [] },
    sku: { type: String, unique: true, sparse: true },
    ean: { type: String, unique: true, sparse: true },
    image: { type: String, default: "" },
    published: { type: Boolean, default: false },
    inventory_quantity: { type: Number, default: 0 },
    allow_backorder: { type: Boolean, default: false },
    manage_inventory: { type: Boolean, default: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default ProductVariantModel
