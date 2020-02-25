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

  validatePermission_(permission) {
    const schema = Validator.object({
      method: Validator.string().valid(
        "POST",
        "GET",
        "PUT",
        "PATCH",
        "DELETE",
        "CONNECT",
        "OPTIONS",
        "HEAD",
        "TRACE"
      ),
      endpoint: Validator.string(),
    })

    const { value, error } = schema.validate(permission)

    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        "Permission is not valid"
      )
    }

    return value
  }

  retrieveRole(name) {
    return this.roleModel_.findOne({ name }).catch(err => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })
  }

  async hasPermission(user, method, endpoint) {
    for (let i = 0; i < user.metadata.roles.length; i++) {
      const role = user.metadata.roles[i]
      const permissions = await this.roleModel_.findOne({ name: role })
      return permissions.permissions.some(action => {
        return action.method === method && action.endpoint === endpoint
      })
    }
    return false
  }

  async createRole(role, permissions) {
    const validatedPermissions = permissions.map(permission =>
      this.validatePermission_(permission)
    )
    const exists = await this.roleModel_.findOne({ name: role })
    if (exists) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} already exists`
      )
    }

    return this.roleModel_.create({
      name: role,
      permissions: validatedPermissions,
    })
  }

  async deleteRole(role) {
    return this.roleModel_.deleteOne({
      name: role,
      permissions: validatedPermissions,
    })
  }

  async addPermission(role, permission) {
    const roleToUpdate = await this.roleModel_.findOne({ name: role })

    if (!roleToUpdate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} does not exist. Use method createRole to create it.`
      )
    }

    const validatedPermission = this.validatePermission_(permission)

    return this.roleModel_.updateOne(
      { _id: roleToUpdate._id },
      { $push: { permissions: validatedPermission } }
    )
  }

  async removePermission(role, permission) {
    const roleToUpdate = await this.roleModel_.findOne({ name: role })

    if (!roleToUpdate) {
      throw new MedusaError(
        MedusaError.Types.INVALID_ARGUMENT,
        `${role} does not exist. Use method createRole to create it.`
      )
    }

    const validatedPermission = this.validatePermission_(permission)

    return this.roleModel_.updateOne(
      { _id: roleToUpdate._id },
      { $pull: { permissions: validatedPermission } }
    )
  }

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
