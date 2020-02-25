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
      const permissions = await this.roleModel_.findOne({ name: role })
      return permissions.actions.some(action => {
        return action.method === method && action.route === route
      })
    }
    return false
  }

  async createRole(role, actions) {
    const validatePermissions = this.validatePermissions_(actions)
    const exists = await this.roleModel_.findOne({ name: role })
    if (exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} already exists`
      )
    }

    return this.roleModel_.create({
      name: role,
      permissions: validatePermissions,
    })
  }

  async updateRole() {}

  async grantRole(userId, role) {
    const user = await this.userService_.retrieve(userId)
    if (!user) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `Could not find user with id: ${userId}`
      )
    }

    if (user.metadata.roles.includes(role)) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `User already has role: ${role}`
      )
    }

    const exists = await this.roleModel_.findOne({ name: role })
    if (!exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} does not exist`
      )
    }

    return this.userService_.setMetadata(userId, role)
  }

  async revokeRole(userId, role) {}
}

export default PermissionService
