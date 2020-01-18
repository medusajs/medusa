import bcrypt from "bcrypt"
import { BaseService } from "../interfaces"

/**
 * Can authenticate a user based on email password combination
 * @implements BaseService
 */
class AuthService extends BaseService {
  /** @param { userModel: (UserModel) } */
  constructor({ userModel }) {
    super()
    /** @private @const {UserModel} */
    this.userModel_ = userModel
  }

  /**
   * Authenticates a given user based on an email, password combination. Uses
   * bcrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), user: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   */
  async authenticate(email, password) {
    const user = await this.userModel_.findOne({ email })
    const passwordsMatch = await bcrypt.compare(password, user.passwordHash)

    if (passwordsMatch) {
      return {
        success: true,
        user,
      }
    } else {
      return {
        success: false,
      }
    }
  }
}

export default AuthService
