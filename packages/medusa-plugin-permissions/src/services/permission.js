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

  async retrieveRole(name) {
    const role = await this.roleModel_.findOne({ name }).catch((err) => {
      throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
    })

    if (!role) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `${name} does not exist. Use method createRole to create it.`
      )
    }
    return role
  }

  async hasPermission(user, method, endpoint) {
    for (let i = 0; i < user.metadata.roles.length; i++) {
      const role = user.metadata.roles[i]
      const permissions = await this.retrieveRole(role)
      return permissions.permissions.some((action) => {
        return action.method === method && action.endpoint === endpoint
      })
    }
    return false
  }

  async createRole(roleName, permissions) {
    const validatedPermissions = permissions.map((permission) =>
      this.validatePermission_(permission)
    )

    return this.retrieveRole(roleName)
      .then((role) => {
        throw new MedusaError(
          MedusaError.Types.INVALID_ARGUMENT,
          `${role.name} already exists`
        )
      })
      .catch((error) => {
        if (error.name === MedusaError.Types.NOT_FOUND) {
          return this.roleModel_.create({
            name: roleName,
            permissions: validatedPermissions,
          })
        } else {
          throw error
        }
      })
  }

  async deleteRole(roleName) {
    const role = await this.retrieve(roleName)
    // Delete is idempotent, but we return a promise to allow then-chaining
    if (!role) {
      return Promise.resolve()
    }

    return this.roleModel_
      .deleteOne({
        _id: role._id,
      })
      .catch((err) => {
        throw new MedusaError(MedusaError.Types.DB_ERROR, err.message)
      })
  }

  async addPermission(roleName, permission) {
    const role = await this.retrieveRole(roleName)
    const validatedPermission = this.validatePermission_(permission)

    return this.roleModel_.updateOne(
      { _id: role._id },
      { $push: { permissions: validatedPermission } }
    )
  }

  async removePermission(roleName, permission) {
    const role = await this.retrieveRole(roleName)
    const validatedPermission = this.validatePermission_(permission)

    return this.roleModel_.updateOne(
      { _id: role._id },
      { $pull: { permissions: validatedPermission } }
    )
  }

  async grantRole(userId, roleName) {
    const role = await this.retrieveRole(roleName)
    const user = await this.userService_.retrieve(userId)

    if (!user.metadata.roles) {
      return this.userService_.setMetadata(userId, "roles", [roleName])
    }

    if (user.metadata.roles.includes(role.name)) {
      throw new MedusaError(
        MedusaError.Types.DB_ERROR,
        `User already has role: ${role.name}`
      )
    }

    user.metadata.roles.push(roleName)
    return this.userService_.setMetadata(userId, "roles", user.metadata.roles)
  }

  async revokeRole(userId, roleName) {
    const user = await this.userService_.retrieve(userId)

    if (!user.metadata.roles || !user.metadata.roles.includes(roleName)) {
      // revokeRole is idempotent, we return a promise to allow then-chaining
      return Promise.resolve()
    }
    // remove role from metadata.roles
    const newRoles = user.metadata.roles.filter((r) => r !== roleName)

    return this.userService_.setMetadata(userId, "roles", newRoles)
  }
}

export default PermissionService
