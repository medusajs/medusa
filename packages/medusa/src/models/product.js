/*******************************************************************************
 * models/product.js
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

import OptionSchema from "./schemas/option"

class ProductModel extends BaseModel {
  static modelName = "Product"
  static schema = {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    tags: { type: String, default: "" },
    handle: { type: String, unique: true, sparse: true },
    images: { type: [String], default: [] },
    options: { type: [OptionSchema], default: [] },
    variants: { type: [String], default: [] },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    published: { type: Boolean, default: false },
  }
}

export default ProductModel
