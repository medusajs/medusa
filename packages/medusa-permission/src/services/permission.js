import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

class PermissionService extends BaseService {
  constructor({ userService, permissionModel }) {
    super()

    /** @private @const {UserService} */
    this.userService_ = userService

    /** @private @const {PermissionModel} */
    this.permissionModel_ = permissionModel
  }

  validateActions_(actions) {
    const schema = Validator.array().items(
      Validator.object({
        method: Validator.string(),
        route: Validator.string(),
      })
    )

    const { value, error } = schema.validate(actions)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Actions are not valid"
      )
    }

    return value
  }

  async hasPermission(user, method, route) {
    for (let role in user.metadata.roles) {
      const permission = await this.permissionModel_.findOne({ role: role })
      const actionExists = permission.actions.some(action => {
        return action.method === method && action.route === route
      })
      if (actionExists) {
        return true
      }
    }
    return false
  }

  async grantActions(role, actions) {
    const exists = await this.permissionModel_.find({ role: role })
    if (exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} already exists`
      )
    }

    const validatedActions = this.validateActions_(actions)

    return this.permissionModel_.create({
      role_name: roleName,
      actions: validatedActions,
    })
  }

  // async grantPermission(userId, role) {
  //   const exists = await this.permissionModel_.find({ role_name: role })

  //   if (!exists) {
  //     throw new MedusaError(
  //       MedusaError.Types.INVALID_ARGUMENT,
  //       `${role} does not exist`
  //     )
  //   }

  //   return this.userService_.setMetadata(userId, role)
  // }
}

export default PermissionService
