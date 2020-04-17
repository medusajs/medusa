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
    name: { type: String },
    password_hash: { type: String, required: true },
    api_token: { type: String },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default UserModel
