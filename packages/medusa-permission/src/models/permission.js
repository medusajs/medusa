/*******************************************************************************
 * models/permission.js
 *
 ******************************************************************************/
import { BaseModel } from "medusa-interfaces"

import ActionSchema from "./schemas/action"

class PermissionModel extends BaseModel {
  static modelName = "Permission"
  static schema = {
    role: { type: String, required: true },
    actions: { type: [ActionSchema], required: true, default: [] },
  }
}

export default PermissionModel
