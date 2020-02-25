import { BaseService } from "medusa-interfaces"
import { Validator, MedusaError } from "medusa-core-utils"

class PermissionService extends BaseService {
  constructor({ userService, roleModel }) {
    super()

    /** @private @const {UserService} */
    this.userService_ = userService

    /** @private @const {RoleModel} */
    this.roleModel_ = roleModel
  }

  validatePermissions_(permissions) {
    const schema = Validator.array().items(
      Validator.object({
        method: Validator.string(),
        route: Validator.string(),
      })
    )

    const { value, error } = schema.validate(permissions)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Actions are not valid"
      )
    }

    return value
  }

  retrieveRole(name) {
    return this.roleModel_.findOne({ name }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  async hasPermission(user, method, route) {
    for (let i = 0; i < user.metadata.roles.length; i++) {
      const role = user.metadata.roles[i]
      const permissions = await this.roleModel_.findOne({ role: role })
      return permissions.actions.some(action => {
        return action.method === method && action.route === route
      })
    }
    return false
  }

  async createRole(role, actions) {
    const validatedActions = this.validateActions_(actions)
    const exists = await this.roleModel_.findOne({ role })
    if (exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} already exists`
      )
    }

    return this.roleModel_.create({
      role,
      actions: validatedActions,
    })
  }

  async updateRole() {}

  async grantRole(userId, role) {
    const exists = await this.roleModel_.findOne({ role })
    if (!exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} does not exist`
      )
    }
    // Check if user already has role

    return this.userService_.setMetadata(userId, role)
  }

  async revokeRole(userId, role) {}
}

export default PermissionService
