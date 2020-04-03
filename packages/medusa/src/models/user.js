/*******************************************************************************
 * models/user.js
 *
 ******************************************************************************/
import mongoose from "mongoose"
import { BaseModel } from "medusa-interfaces"

class UserModel extends BaseModel {
  static modelName = "User"
  static schema = {
    email: { type: String, required: true },
    passwordHash: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default UserModel
