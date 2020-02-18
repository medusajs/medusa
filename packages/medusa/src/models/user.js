/*******************************************************************************
 * models/user.js
 *
 ******************************************************************************/
import { BaseModel } from "medusa-interfaces"

class UserModel extends BaseModel {
  static modelName = "User"
  static schema = {
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  }
}

export default UserModel
