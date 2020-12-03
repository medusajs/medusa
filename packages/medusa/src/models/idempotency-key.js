import { BaseModel } from "medusa-interfaces"
import mongoose from "mongoose"

class IdempotencyKeyModel extends BaseModel {
  static modelName = "IdempotencyKey"

  static schema = {
    idempotency_key: { type: String, required: true, unique: true },
    created_at: { type: Date, required: true, default: Date.now() },
    locked_at: { type: Number },
    request_method: { type: String, required: true },
    request_params: { type: mongoose.Schema.Types.Mixed, required: true },
    request_path: { type: String, required: true },
    response_code: { type: Number },
    response_body: { type: mongoose.Schema.Types.Mixed },
    recovery_point: { type: String, required: true, default: "started" },
  }
}

export default IdempotencyKeyModel
