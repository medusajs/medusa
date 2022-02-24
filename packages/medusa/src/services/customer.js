import jwt from "jsonwebtoken"
import _ from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import Scrypt from "scrypt-kdf"
import { Brackets, ILike } from "typeorm"

/**
 * Provides layer to manipulate customers.
 * @implements {BaseService}
 */
class CustomerService extends BaseService {
  static Events = {
    PASSWORD_RESET: "customer.password_reset",
    CREATED: "customer.created",
    UPDATED: "customer.updated",
  }

  constructor({
    manager,
    customerRepository,
    eventBusService,
    addressRepository,
    customerGroupService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {CustomerRepository} */
    this.customerRepository_ = customerRepository

    /** @private @const {EventBus} */
    this.eventBus_ = eventBusService

    /** @private @const {AddressRepository} */
    this.addressRepository_ = addressRepository

    this.customerGroupService_ = customerGroupService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new CustomerService({
      manager: transactionManager,
      customerRepository: this.customerRepository_,
      eventBusService: this.eventBus_,
      addressRepository: this.addressRepository_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * Used to validate customer email.
   * @param {string} email - email to validate
   * @return {string} the validated email
   */
  validateEmail_(email) {
    const schema = Validator.string()
      .email()
      .required()
    const { value, error } = schema.validate(email)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    return value.toLowerCase()
  }

  validateBillingAddress_(address) {
    const { value, error } = Validator.address().validate(address)
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The address is not valid"
      )
    }

    return value
  }

  /**
   * Generate a JSON Web token, that will be sent to a customer, that wishes to
   * reset password.
   * The token will be signed with the customer's current password hash as a
   * secret a long side a payload with userId and the expiry time for the token,
   * which is always 15 minutes.
   * @param {string} customerId - the customer to reset the password for
   * @return {string} the generated JSON web token
   */
  async generateResetPasswordToken(customerId) {
    const customer = await this.retrieve(customerId, {
      select: [
        "id",
        "has_account",
        "password_hash",
        "email",
        "first_name",
        "last_name",
      ],
    })

    if (!customer.has_account) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "You must have an account to reset the password. Create an account first"
      )
    }

    const secret = customer.password_hash
    const expiry = Math.floor(Date.now() / 1000) + 60 * 15 // 15 minutes ahead
    const payload = { customer_id: customer.id, exp: expiry }
    const token = jwt.sign(payload, secret)
    // Notify subscribers
    this.eventBus_.emit(CustomerService.Events.PASSWORD_RESET, {
      id: customerId,
      email: customer.email,
      first_name: customer.first_name,
      last_name: customer.last_name,
      token,
    })
    return token
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 50 }) {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.email
      delete where.first_name
      delete where.last_name

      query.where = (qb) => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where({ email: ILike(`%${q}%`) })
              .orWhere({ first_name: ILike(`%${q}%`) })
              .orWhere({ last_name: ILike(`%${q}%`) })
          })
        )
      }
    }

    return customerRepo.find(query)
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {FindConfig<Customer>} config - the config object containing query settings
   * @return {Promise} the result of the find operation
   */
  async listAndCount(
    selector,
    config = { relations: [], skip: 0, take: 50, order: { created_at: "DESC" } }
  ) {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )

    let q
    if ("q" in selector) {
      q = selector.q
      delete selector.q
    }

    const query = this.buildQuery_(selector, config)

    if (q) {
      const where = query.where

      delete where.email
      delete where.first_name
      delete where.last_name

      query.where = (qb) => {
        qb.where(where)

        qb.andWhere(
          new Brackets((qb) => {
            qb.where({ email: ILike(`%${q}%`) })
              .orWhere({ first_name: ILike(`%${q}%`) })
              .orWhere({ last_name: ILike(`%${q}%`) })
          })
        )
      }
    }

    const [customers, count] = await customerRepo.findAndCount(query)
    return [customers, count]
  }

  /**
   * Return the total number of documents in database
   * @return {Promise} the result of the count operation
   */
  count() {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )
    return customerRepo.count({})
  }

  /**
   * Gets a customer by id.
   * @param {string} customerId - the id of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieve(customerId, config = {}) {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )

    const validatedId = this.validateId_(customerId)
    const query = this.buildQuery_({ id: validatedId }, config)

    const customer = await customerRepo.findOne(query)
    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with ${customerId} was not found`
      )
    }

    return customer
  }

  /**
   * Gets a customer by email.
   * @param {string} email - the email of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieveByEmail(email, config = {}) {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )

    const query = this.buildQuery_({ email: email.toLowerCase() }, config)
    const customer = await customerRepo.findOne(query)

    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with email ${email} was not found`
      )
    }

    return customer
  }

  /**
   * Gets a customer by phone.
   * @param {string} phone - the phone of the customer to get.
   * @param {Object} config - the config object containing query settings
   * @return {Promise<Customer>} the customer document.
   */
  async retrieveByPhone(phone, config = {}) {
    const customerRepo = this.manager_.getCustomRepository(
      this.customerRepository_
    )

    const query = this.buildQuery_({ phone }, config)
    const customer = await customerRepo.findOne(query)

    if (!customer) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Customer with phone ${phone} was not found`
      )
    }

    return customer
  }

  /**
   * Hashes a password
   * @param {string} password - the value to hash
   * @return {Promise<string>} hashed password
   */
  async hashPassword_(password) {
    const buf = await Scrypt.kdf(password, { logN: 1, r: 1, p: 1 })
    return buf.toString("base64")
  }

  /**
   * Creates a customer from an email - customers can have accounts associated,
   * e.g. to login and view order history, etc. If a password is provided the
   * customer will automatically get an account, otherwise the customer is just
   * used to hold details of customers.
   * @param {object} customer - the customer to create
   * @return {Promise} the result of create
   */
  async create(customer) {
    return this.atomicPhase_(async (manager) => {
      const customerRepository = manager.getCustomRepository(
        this.customerRepository_
      )

      const { email, billing_address, password } = customer
      customer.email = this.validateEmail_(email)

      if (billing_address) {
        customer.billing_address = this.validateBillingAddress_(billing_address)
      }

      const existing = await this.retrieveByEmail(email).catch(
        (err) => undefined
      )

      if (existing && existing.has_account) {
        throw new MedusaError(
          MedusaError.Types.DUPLICATE_ERROR,
          "A customer with the given email already has an account. Log in instead"
        )
      }

      if (existing && password && !existing.has_account) {
        const hashedPassword = await this.hashPassword_(password)
        customer.password_hash = hashedPassword
        customer.has_account = true
        delete customer.password

        const toUpdate = { ...existing, ...customer }
        const updated = await customerRepository.save(toUpdate)
        await this.eventBus_
          .withTransaction(manager)
          .emit(CustomerService.Events.UPDATED, updated)
        return updated
      } else {
        if (password) {
          const hashedPassword = await this.hashPassword_(password)
          customer.password_hash = hashedPassword
          customer.has_account = true
          delete customer.password
        }

        const created = await customerRepository.create(customer)
        const result = await customerRepository.save(created)
        await this.eventBus_
          .withTransaction(manager)
          .emit(CustomerService.Events.CREATED, result)
        return result
      }
    })
  }

  /**
   * Updates a customer.
   * @param {string} customerId - the id of the variant. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(customerId, update) {
    return this.atomicPhase_(async (manager) => {
      const customerRepository = manager.getCustomRepository(
        this.customerRepository_
      )
      const addrRepo = manager.getCustomRepository(this.addressRepository_)

      const customer = await this.retrieve(customerId)

      const {
        email,
        password,
        metadata,
        billing_address,
        billing_address_id,
        groups,
        ...rest
      } = update

      if (metadata) {
        customer.metadata = this.setMetadata_(customer, metadata)
      }

      if (email) {
        customer.email = this.validateEmail_(email)
      }

      if ("billing_address_id" in update || "billing_address" in update) {
        const address = billing_address_id || billing_address
        if (typeof address !== "undefined") {
          await this.updateBillingAddress_(customer, address, addrRepo)
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        customer[key] = value
      }

      if (password) {
        customer.password_hash = await this.hashPassword_(password)
      }

      if (groups) {
        const id = groups.map((g) => g.id)
        customer.groups = await this.customerGroupService_.list({ id })
      }

      const updated = await customerRepository.save(customer)

      await this.eventBus_
        .withTransaction(manager)
        .emit(CustomerService.Events.UPDATED, updated)
      return updated
    })
  }

  /**
   * Updates the customers' billing address.
   * @param {Customer} customer - the Customer to update
   * @param {Object|string} addressOrId - the value to set the billing address to
   * @param {Object} addrRepo - address repository
   * @return {Promise} the result of the update operation
   */
  async updateBillingAddress_(customer, addressOrId, addrRepo) {
    if (addressOrId === null) {
      customer.billing_address_id = null
      return
    }

    if (typeof addressOrId === `string`) {
      addressOrId = await addrRepo.findOne({
        where: { id: addressOrId },
      })
    }

    addressOrId.country_code = addressOrId.country_code.toLowerCase()

    if (addressOrId.id) {
      customer.billing_address_id = addressOrId.id
    } else {
      if (customer.billing_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: customer.billing_address_id },
        })

        await addrRepo.save({ ...addr, ...addressOrId })
      } else {
        const created = addrRepo.create({
          ...addressOrId,
        })
        const saved = await addrRepo.save(created)
        customer.billing_address = saved
      }
    }
  }

  async updateAddress(customerId, addressId, address) {
    return this.atomicPhase_(async (manager) => {
      const addressRepo = manager.getCustomRepository(this.addressRepository_)

      address.country_code = address.country_code.toLowerCase()

      const toUpdate = await addressRepo.findOne({
        where: { id: addressId, customer_id: customerId },
      })

      this.validateBillingAddress_(address)

      for (const [key, value] of Object.entries(address)) {
        toUpdate[key] = value
      }

      const result = addressRepo.save(toUpdate)
      return result
    })
  }

  async removeAddress(customerId, addressId) {
    return this.atomicPhase_(async (manager) => {
      const addressRepo = manager.getCustomRepository(this.addressRepository_)

      // Should not fail, if user does not exist, since delete is idempotent
      const address = await addressRepo.findOne({
        where: { id: addressId, customer_id: customerId },
      })

      if (!address) {
        return Promise.resolve()
      }

      await addressRepo.softRemove(address)

      return Promise.resolve()
    })
  }

  async addAddress(customerId, address) {
    return this.atomicPhase_(async (manager) => {
      const addressRepository = manager.getCustomRepository(
        this.addressRepository_
      )

      address.country_code = address.country_code.toLowerCase()

      const customer = await this.retrieve(customerId, {
        relations: ["shipping_addresses"],
      })
      this.validateBillingAddress_(address)

      const shouldAdd = !customer.shipping_addresses.find(
        (a) =>
          a.country_code.toLowerCase() === address.country_code.toLowerCase() &&
          a.address_1 === address.address_1 &&
          a.address_2 === address.address_2 &&
          a.city === address.city &&
          a.phone === address.phone &&
          a.postal_code === address.postal_code &&
          a.province === address.province &&
          a.first_name === address.first_name &&
          a.last_name === address.last_name
      )

      if (shouldAdd) {
        const created = await addressRepository.create({
          customer_id: customerId,
          ...address,
        })
        const result = await addressRepository.save(created)
        return result
      } else {
        return customer
      }
    })
  }

  /**
   * Deletes a customer from a given customer id.
   * @param {string} customerId - the id of the customer to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(customerId) {
    return this.atomicPhase_(async (manager) => {
      const customerRepo = manager.getCustomRepository(this.customerRepository_)

      // Should not fail, if user does not exist, since delete is idempotent
      const customer = await customerRepo.findOne({ where: { id: customerId } })

      if (!customer) {
        return Promise.resolve()
      }

      await customerRepo.softRemove(customer)

      return Promise.resolve()
    })
  }

  /**
   * Decorates a customer.
   * @param {Customer} customer - the cart to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Customer} return the decorated customer.
   */
  async decorate(customer, fields = [], expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(customer, fields.concat(requiredFields))

    const final = await this.runDecorators_(decorated)
    return final
  }
}

export default CustomerService
