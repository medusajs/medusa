/*******************************************************************************
 * models/user.js
 *
 ******************************************************************************/
import { BaseModel } from "../interfaces"

class UserModel extends BaseModel {
  static modelName = "User"
  static schema = {
    name: { type: String, required: true },
    email: { type: String, required: true },
    passwordHash: { type: String, required: true },
  }
}

export default UserModel
