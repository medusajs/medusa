import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class StagedJobModel extends BaseModel {
  static modelName = "StagedJob"
  static schema = {
    event_name: { type: String, required: true },
    data: { type: mongoose.Schema.Types.Mixed },
  }
}

export default StagedJobModel
