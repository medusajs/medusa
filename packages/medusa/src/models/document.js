import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class DocumentModel extends BaseModel {
  static modelName = "Document"

  static schema = {
    base_64: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, required: true },
    created: { type: String, default: Date.now },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default DocumentModel
