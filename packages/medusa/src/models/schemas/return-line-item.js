/*******************************************************************************
 *
 ******************************************************************************/
import mongoose from "mongoose"

/**
 * @typedef ReturnLineItem
 * @property {String} item_id
 * @property {Object} content
 * @property {Number} quantity
 * @property {Boolean} is_requested
 * @property {Boolean} is_registered
 * @property {Object} metadata
 */
export default new mongoose.Schema({
  item_id: { type: String, required: true },
  content: { type: mongoose.Schema.Types.Mixed, required: true },
  quantity: { type: Number, required: true },
  is_requested: { type: Boolean, required: true },
  requested_quantity: { type: Number },
  is_registered: { type: Boolean, default: false },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
})
