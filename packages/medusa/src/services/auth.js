import Scrypt from "scrypt-kdf"
import { BaseService } from "medusa-interfaces"

/**
 * Can authenticate a user based on email password combination
 * @implements BaseService
 */
class AuthService extends BaseService {
  constructor({ userService, customerService }) {
    super()

    /** @private @const {UserService} */
    this.userService_ = userService

    /** @private @const {CustomerService} */
    this.customerService_ = customerService
  }

  /**
   * Verifies if a password is valid given the provided password hash
   * @param {string} password - the raw password to check
   * @param {string} hash - the hash to compare against
   * @return {bool} the result of the comparison
   */
  async comparePassword_(password, hash) {
    const buf = Buffer.from(hash, "base64")
    return Scrypt.verify(buf, password)
  }

  /**
   * Authenticates a given user with an API token
   * @param {string} token - the api_token of the user to authenticate
   * @return {{
   *    success: (bool),
   *    user: (object | undefined),
   *    error: (string | undefined)
   * }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticateAPIToken(token) {
    try {
      const user = await this.userService_.retrieveByApiToken(token)
      return {
        success: true,
        user,
      }
    } catch (error) {
      return {
        success: false,
        error: "Invalid API Token",
      }
    }
  }

  /**
   * Authenticates a given user based on an email, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), user: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticate(email, password) {
    try {
      const user = await this.userService_.retrieveByEmail(email)
      const passwordsMatch = await this.comparePassword_(
        password,
        user.password_hash
      )
      if (passwordsMatch) {
        return {
          success: true,
          user,
        }
      } else {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }
  }

  /**
   * Authenticates a customer based on an email, password combination. Uses
   * scrypt to match password with hashed value.
   * @param {string} email - the email of the user
   * @param {string} password - the password of the user
   * @return {{ success: (bool), user: (object | undefined) }}
   *    success: whether authentication succeeded
   *    user: the user document if authentication succeded
   *    error: a string with the error message
   */
  async authenticateCustomer(email, password) {
    try {
      const customer = await this.customerService_.retrieveByEmail(email)
      if (!customer.password_hash) {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }

      const passwordsMatch = await this.comparePassword_(
        password,
        customer.password_hash
      )
      if (passwordsMatch) {
        return {
          success: true,
          customer,
        }
      } else {
        return {
          success: false,
          error: "Invalid email or password",
        }
      }
    } catch (error) {
      return {
        success: false,
        error: "Invalid email or password",
      }
    }
  }
}

export default AuthService
