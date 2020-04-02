import { BaseModel } from "medusa-interfaces"

import PermissionSchema from "./schemas/permission"

class RoleModel extends BaseModel {
  static modelName = "Role"
  static schema = {
    name: { type: String, required: true, unique: true },
    permissions: { type: [PermissionSchema], required: true, default: [] },
  }
}

export default RoleModel
