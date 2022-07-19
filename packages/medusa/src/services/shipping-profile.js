import _ from "lodash"
import { MedusaError } from "medusa-core-utils"
import { BaseService } from "medusa-interfaces"
import { Any } from "typeorm"

/**
 * Provides layer to manipulate profiles.
 * @class
 * @implements {BaseService}
 */
class ShippingProfileService extends BaseService {
  constructor({
    manager,
    shippingProfileRepository,
    productService,
    productRepository,
    shippingOptionService,
    customShippingOptionService,
  }) {
    super()

    /** @private @const {EntityManager} */
    this.manager_ = manager

    /** @private @const {ShippingProfileRepository} */
    this.shippingProfileRepository_ = shippingProfileRepository

    /** @private @const {ProductService} */
    this.productService_ = productService

    /** @private @const {ProductReppsitory} */
    this.productRepository_ = productRepository

    /** @private @const {ShippingOptionService} */
    this.shippingOptionService_ = shippingOptionService

    /** @private @const {CustomShippingOptionService} */
    this.customShippingOptionService_ = customShippingOptionService
  }

  withTransaction(transactionManager) {
    if (!transactionManager) {
      return this
    }

    const cloned = new ShippingProfileService({
      manager: transactionManager,
      shippingProfileRepository: this.shippingProfileRepository_,
      productService: this.productService_,
      shippingOptionService: this.shippingOptionService_,
      customShippingOptionService: this.customShippingOptionService_,
    })

    cloned.transactionManager_ = transactionManager

    return cloned
  }

  /**
   * @param {Object} selector - the query object for find
   * @param {Object} config - the config object for find
   * @return {Promise} the result of the find operation
   */
  async list(selector = {}, config = { relations: [], skip: 0, take: 10 }) {
    const shippingProfileRepo = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )

    const query = this.buildQuery_(selector, config)
    return shippingProfileRepo.find(query)
  }

  async fetchOptionsByProductIds(productIds, filter) {
    const products = await this.productService_.list(
      {
        id: Any(productIds),
      },
      {
        relations: [
          "profile",
          "profile.shipping_options",
          "profile.shipping_options.requirements",
        ],
      }
    )

    const profiles = products.map((p) => p.profile)

    const optionIds = profiles.reduce(
      (acc, next) => acc.concat(next.shipping_options),
      []
    )

    const options = await Promise.all(
      optionIds.map(async (option) => {
        let canSend = true
        if (filter.region_id) {
          if (filter.region_id !== option.region_id) {
            canSend = false
          }
        }

        if (option.deleted_at !== null) {
          canSend = false
        }

        return canSend ? option : null
      })
    )

    return options.filter((o) => !!o)
  }

  /**
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param {string} profileId - the id of the profile to get.
   * @param {Object} options - options opf the query.
   * @return {Promise<Product>} the profile document.
   */
  async retrieve(profileId, options = {}) {
    const profileRepository = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )
    const validatedId = this.validateId_(profileId)

    const query = {
      where: { id: validatedId },
    }

    if (options.select) {
      query.select = options.select
    }

    if (options.relations) {
      query.relations = options.relations
    }

    const profile = await profileRepository.findOne(query)

    if (!profile) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Profile with id: ${profileId} was not found`
      )
    }

    return profile
  }

  async retrieveDefault() {
    const profileRepository = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )

    const profile = await profileRepository.findOne({
      where: { type: "default" },
    })

    return profile
  }

  /**
   * Creates a default shipping profile, if this does not already exist.
   * @return {Promise<ShippingProfile>} the shipping profile
   */
  async createDefault() {
    return this.atomicPhase_(async (manager) => {
      let profile = await this.retrieveDefault()

      if (!profile) {
        const profileRepository = manager.getCustomRepository(
          this.shippingProfileRepository_
        )

        const p = await profileRepository.create({
          type: "default",
          name: "Default Shipping Profile",
        })

        profile = await profileRepository.save(p)
      }

      return profile
    })
  }

  /**
   * Retrieves the default gift card profile
   * @return {Object} the shipping profile for gift cards
   */
  async retrieveGiftCardDefault() {
    const profileRepository = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )

    const giftCardProfile = await profileRepository.findOne({
      where: { type: "gift_card" },
    })

    return giftCardProfile
  }

  /**
   * Creates a default shipping profile, for gift cards if unless it already
   * exists.
   * @return {Promise<ShippingProfile>} the shipping profile
   */
  async createGiftCardDefault() {
    return this.atomicPhase_(async (manager) => {
      let profile = await this.retrieveGiftCardDefault()

      if (!profile) {
        const profileRepository = manager.getCustomRepository(
          this.shippingProfileRepository_
        )

        const p = await profileRepository.create({
          type: "gift_card",
          name: "Gift Card Profile",
        })

        profile = await profileRepository.save(p)
      }

      return profile
    })
  }

  /**
   * Creates a new shipping profile.
   * @param {ShippingProfile} profile - the shipping profile to create from
   * @return {Promise} the result of the create operation
   */
  async create(profile) {
    return this.atomicPhase_(async (manager) => {
      const profileRepository = manager.getCustomRepository(
        this.shippingProfileRepository_
      )

      if (profile.products || profile.shipping_options) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Please add products and shipping_options after creating Shipping Profiles"
        )
      }

      const created = profileRepository.create(profile)
      const result = await profileRepository.save(created)
      return result
    })
  }

  /**
   * Updates a profile. Metadata updates and product updates should use
   * dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
   * will throw errors if metadata or product updates are attempted.
   * @param {string} profileId - the id of the profile. Must be a string that
   *   can be casted to an ObjectId
   * @param {object} update - an object with the update values.
   * @return {Promise} resolves to the update result.
   */
  async update(profileId, update) {
    return this.atomicPhase_(async (manager) => {
      const profileRepository = manager.getCustomRepository(
        this.shippingProfileRepository_
      )

      const profile = await this.retrieve(profileId, {
        relations: [
          "products",
          "products.profile",
          "shipping_options",
          "shipping_options.profile",
        ],
      })

      const { metadata, products, shipping_options, ...rest } = update

      if (metadata) {
        profile.metadata = this.setMetadata_(profile, metadata)
      }

      if (products) {
        for (const pId of products) {
          await this.productService_.withTransaction(manager).update(pId, {
            profile_id: profile.id,
          })
        }
      }

      if (shipping_options) {
        for (const oId of shipping_options) {
          await this.shippingOptionService_
            .withTransaction(manager)
            .update(oId, {
              profile_id: profile.id,
            })
        }
      }

      for (const [key, value] of Object.entries(rest)) {
        profile[key] = value
      }

      const result = await profileRepository.save(profile)
      return result
    })
  }

  /**
   * Deletes a profile with a given profile id.
   * @param {string} profileId - the id of the profile to delete. Must be
   *   castable as an ObjectId
   * @return {Promise} the result of the delete operation.
   */
  async delete(profileId) {
    return this.atomicPhase_(async (manager) => {
      const profileRepo = manager.getCustomRepository(
        this.shippingProfileRepository_
      )

      // Should not fail, if profile does not exist, since delete is idempotent
      const profile = await profileRepo.findOne({ where: { id: profileId } })

      if (!profile) {
        return Promise.resolve()
      }

      await profileRepo.softRemove(profile)

      return Promise.resolve()
    })
  }

  /**
   * Adds a product to a profile. The method is idempotent, so multiple calls
   * with the same product variant will have the same result.
   * @param {string} profileId - the profile to add the product to.
   * @param {string} productId - the product to add.
   * @return {Promise} the result of update
   */
  async addProduct(profileId, productId) {
    return this.atomicPhase_(async (manager) => {
      await this.productService_
        .withTransaction(manager)
        .update(productId, { profile_id: profileId })

      const updated = await this.retrieve(profileId)
      return updated
    })
  }

  /**
   * Adds a shipping option to the profile. The shipping option can be used to
   * fulfill the products in the products field.
   * @param {string} profileId - the profile to apply the shipping option to
   * @param {string} optionId - the option to add to the profile
   * @return {Promise} the result of the model update operation
   */
  async addShippingOption(profileId, optionId) {
    return this.atomicPhase_(async (manager) => {
      await this.shippingOptionService_
        .withTransaction(manager)
        .update(optionId, { profile_id: profileId })

      const updated = await this.retrieve(profileId)
      return updated
    })
  }

  /**
   * Decorates a profile.
   * @param {Profile} profile - the profile to decorate.
   * @param {string[]} fields - the fields to include.
   * @param {string[]} expandFields - fields to expand.
   * @return {Profile} return the decorated profile.
   */
  async decorate(profile, fields, expandFields = []) {
    const requiredFields = ["_id", "metadata"]
    const decorated = _.pick(profile, fields.concat(requiredFields))

    if (expandFields.includes("products") && profile.products) {
      decorated.products = await Promise.all(
        profile.products.map((pId) => this.productService_.retrieve(pId))
      )
    }

    if (expandFields.includes("shipping_options") && profile.shipping_options) {
      decorated.shipping_options = await Promise.all(
        profile.shipping_options.map((oId) =>
          this.shippingOptionService_.retrieve(oId)
        )
      )
    }

    const final = await this.runDecorators_(decorated)
    return final
  }

  /**
   * Returns a list of all the productIds in the cart.
   * @param {Cart} cart - the cart to extract products from
   * @return {[string]} a list of product ids
   */
  getProfilesInCart_(cart) {
    return cart.items.reduce((acc, next) => {
      // We may have line items that are not associated with a product
      if (next.variant && next.variant.product) {
        if (!acc.includes(next.variant.product.profile_id)) {
          acc.push(next.variant.product.profile_id)
        }
      }

      return acc
    }, [])
  }

  /**
   * Finds all the shipping profiles that cover the products in a cart, and
   * validates all options that are available for the cart.
   * @param {Cart} cart - the cart object to find shipping options for
   * @return {Promise<[ShippingOption]>} a list of the available shipping options
   */
  async fetchCartOptions(cart) {
    const profileIds = this.getProfilesInCart_(cart)

    const selector = {
      profile_id: profileIds,
      admin_only: false,
    }

    const customShippingOptions = await this.customShippingOptionService_.list(
      {
        cart_id: cart.id,
      },
      { select: ["id", "shipping_option_id", "price"] }
    )

    const hasCustomShippingOptions = customShippingOptions?.length
    // if there are custom shipping options associated with the cart, use those
    if (hasCustomShippingOptions) {
      selector.id = customShippingOptions.map((cso) => cso.shipping_option_id)
    }

    const rawOpts = await this.shippingOptionService_.list(selector, {
      relations: ["requirements", "profile"],
    })

    // if there are custom shipping options associated with the cart, return cart shipping options with custom price
    if (hasCustomShippingOptions) {
      return rawOpts.map((so) => {
        const customOption = customShippingOptions.find(
          (cso) => cso.shipping_option_id === so.id
        )

        return {
          ...so,
          amount: customOption?.price,
        }
      })
    }

    const options = await Promise.all(
      rawOpts.map(async (so) => {
        try {
          const option = await this.shippingOptionService_.validateCartOption(
            so,
            cart
          )
          if (option) {
            return option
          }
          return null
        } catch (err) {
          // if validateCartOption fails it means the option is not valid
          return null
        }
      })
    )

    return options.filter(Boolean)
  }
}

export default ShippingProfileService
