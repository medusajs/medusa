import { isDefined, MedusaError } from "medusa-core-utils"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import {
  Cart,
  CustomShippingOption,
  ShippingOption,
  ShippingProfile,
  ShippingProfileType,
} from "../models"
import { ProductRepository } from "../repositories/product"
import { ShippingProfileRepository } from "../repositories/shipping-profile"
import { FindConfig, Selector } from "../types/common"
import {
  CreateShippingProfile,
  UpdateShippingProfile,
} from "../types/shipping-profile"
import { buildQuery, isString, setMetadata } from "../utils"
import CustomShippingOptionService from "./custom-shipping-option"
import ProductService from "./product"
import ShippingOptionService from "./shipping-option"

type InjectedDependencies = {
  manager: EntityManager
  productService: ProductService
  shippingOptionService: ShippingOptionService
  customShippingOptionService: CustomShippingOptionService
  shippingProfileRepository: typeof ShippingProfileRepository
  productRepository: typeof ProductRepository
}

/**
 * Provides layer to manipulate profiles.
 * @constructor
 * @implements {BaseService}
 */
class ShippingProfileService extends TransactionBaseService {
  protected readonly productService_: ProductService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly customShippingOptionService_: CustomShippingOptionService
  // eslint-disable-next-line max-len
  protected readonly shippingProfileRepository_: typeof ShippingProfileRepository
  protected readonly productRepository_: typeof ProductRepository

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  constructor({
    manager,
    shippingProfileRepository,
    productService,
    productRepository,
    shippingOptionService,
    customShippingOptionService,
  }: InjectedDependencies) {
    super(arguments[0])

    this.manager_ = manager
    this.shippingProfileRepository_ = shippingProfileRepository
    this.productService_ = productService
    this.productRepository_ = productRepository
    this.shippingOptionService_ = shippingOptionService
    this.customShippingOptionService_ = customShippingOptionService
  }

  /**
   * @param selector - the query object for find
   * @param config - the config object for find
   * @return the result of the find operation
   */
  async list(
    selector: Selector<ShippingProfile> = {},
    config: FindConfig<ShippingProfile> = { relations: [], skip: 0, take: 10 }
  ): Promise<ShippingProfile[]> {
    const shippingProfileRepo = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )

    const query = buildQuery(selector, config)
    return shippingProfileRepo.find(query)
  }

  async fetchOptionsByProductIds(
    productIds: string[],
    filter: Selector<ShippingOption>
  ): Promise<ShippingOption[]> {
    const products = await this.productService_.list(
      {
        id: productIds,
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

    const shippingOptions = profiles.reduce(
      (acc: ShippingOption[], next: ShippingProfile) =>
        acc.concat(next.shipping_options),
      []
    )

    const options = await Promise.all(
      shippingOptions.map(async (option) => {
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

    return options.filter(Boolean) as ShippingOption[]
  }

  /**
   * Gets a profile by id.
   * Throws in case of DB Error and if profile was not found.
   * @param profileId - the id of the profile to get.
   * @param options - options opf the query.
   * @return {Promise<Product>} the profile document.
   */
  async retrieve(
    profileId: string,
    options: FindConfig<ShippingProfile> = {}
  ): Promise<ShippingProfile> {
    if (!isDefined(profileId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"profileId" must be defined`
      )
    }

    const profileRepository = this.manager_.getCustomRepository(
      this.shippingProfileRepository_
    )

    const query = buildQuery({ id: profileId }, options)

    const profile = await profileRepository.findOne(query)

    if (!profile) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Profile with id: ${profileId} was not found`
      )
    }

    return profile
  }

  async retrieveDefault(): Promise<ShippingProfile | undefined> {
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
  async createDefault(): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      let profile = await this.retrieveDefault()

      if (!profile) {
        const profileRepository = manager.getCustomRepository(
          this.shippingProfileRepository_
        )

        const toCreate = {
          type: ShippingProfileType.DEFAULT,
          name: "Default Shipping Profile",
        }

        const created = profileRepository.create(toCreate)

        profile = await profileRepository.save(created)
      }

      return profile
    })
  }

  /**
   * Retrieves the default gift card profile
   * @return the shipping profile for gift cards
   */
  async retrieveGiftCardDefault(): Promise<ShippingProfile | undefined> {
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
   * @return the shipping profile
   */
  async createGiftCardDefault(): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      let profile = await this.retrieveGiftCardDefault()

      if (!profile) {
        const profileRepository = manager.getCustomRepository(
          this.shippingProfileRepository_
        )

        const created = profileRepository.create({
          type: ShippingProfileType.GIFT_CARD,
          name: "Gift Card Profile",
        })

        profile = await profileRepository.save(created)
      }

      return profile
    })
  }

  /**
   * Creates a new shipping profile.
   * @param profile - the shipping profile to create from
   * @return the result of the create operation
   */
  async create(profile: CreateShippingProfile): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      const profileRepository = manager.getCustomRepository(
        this.shippingProfileRepository_
      )

      if (profile["products"] || profile["shipping_options"]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          "Please add products and shipping_options after creating Shipping Profiles"
        )
      }

      const { metadata, ...rest } = profile

      const created = profileRepository.create(rest)

      if (metadata) {
        created.metadata = setMetadata(created, metadata)
      }

      const result = await profileRepository.save(created)
      return result
    })
  }

  /**
   * Updates a profile. Metadata updates and product updates should use
   * dedicated methods, e.g. `setMetadata`, `addProduct`, etc. The function
   * will throw errors if metadata or product updates are attempted.
   * @param profileId - the id of the profile. Must be a string that
   *   can be casted to an ObjectId
   * @param update - an object with the update values.
   * @return resolves to the update result.
   */
  async update(
    profileId: string,
    update: UpdateShippingProfile
  ): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      const profileRepository = manager.getCustomRepository(
        this.shippingProfileRepository_
      )

      let profile = await this.retrieve(profileId, {
        relations: [
          "products",
          "products.profile",
          "shipping_options",
          "shipping_options.profile",
        ],
      })

      const { metadata, products, shipping_options, ...rest } = update

      if (products) {
        profile = await this.addProduct(profile.id, products)
      }

      if (shipping_options) {
        profile = await this.addShippingOption(profile.id, shipping_options)
      }

      if (metadata) {
        profile.metadata = setMetadata(profile, metadata)
      }

      for (const [key, value] of Object.entries(rest)) {
        profile[key] = value
      }

      return await profileRepository.save(profile)
    })
  }

  /**
   * Deletes a profile with a given profile id.
   * @param profileId - the id of the profile to delete. Must be
   *   castable as an ObjectId
   * @return the result of the delete operation.
   */
  async delete(profileId: string): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
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
   * Adds a product of an array of products to the profile.
   * @param profileId - the profile to add the products to.
   * @param productId - the ID of the product or multiple products to add.
   * @return the result of update
   */
  async addProduct(
    profileId: string,
    productId: string | string[]
  ): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      const productServiceTx = this.productService_.withTransaction(manager)

      await productServiceTx.updateShippingProfile(
        isString(productId) ? [productId] : productId,
        profileId
      )

      return await this.retrieve(profileId, {
        relations: [
          "products",
          "products.profile",
          "shipping_options",
          "shipping_options.profile",
        ],
      })
    })
  }

  /**
   * Adds a shipping option to the profile. The shipping option can be used to
   * fulfill the products in the products field.
   * @param profileId - the profile to apply the shipping option to
   * @param optionId - the ID of the option or multiple options to add to the profile
   * @return the result of the model update operation
   */
  async addShippingOption(
    profileId: string,
    optionId: string | string[]
  ): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      const shippingOptionServiceTx =
        this.shippingOptionService_.withTransaction(manager)

      await shippingOptionServiceTx.updateShippingProfile(
        isString(optionId) ? [optionId] : optionId,
        profileId
      )

      return await this.retrieve(profileId, {
        relations: [
          "products",
          "products.profile",
          "shipping_options",
          "shipping_options.profile",
        ],
      })
    })
  }

  /**
   * Finds all the shipping profiles that cover the products in a cart, and
   * validates all options that are available for the cart.
   * @param cart - the cart object to find shipping options for
   * @return a list of the available shipping options
   */
  async fetchCartOptions(cart): Promise<ShippingOption[]> {
    return await this.atomicPhase_(async (manager) => {
      const profileIds = this.getProfilesInCart(cart)

      const selector: Selector<ShippingOption> = {
        profile_id: profileIds,
        admin_only: false,
      }

      const customShippingOptions = await this.customShippingOptionService_
        .withTransaction(manager)
        .list(
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

      const rawOpts = await this.shippingOptionService_
        .withTransaction(manager)
        .list(selector, {
          relations: ["requirements", "profile"],
        })

      // if there are custom shipping options associated with the cart, return cart shipping options with custom price
      if (hasCustomShippingOptions) {
        const customShippingOptionsMap = new Map<string, CustomShippingOption>()

        customShippingOptions.forEach((option) => {
          customShippingOptionsMap.set(option.shipping_option_id, option)
        })

        return rawOpts.map((so) => {
          const customOption = customShippingOptionsMap.get(so.id)

          return {
            ...so,
            amount: customOption?.price,
          }
        }) as ShippingOption[]
      }

      return (
        await Promise.all(
          rawOpts.map(async (so) => {
            return await this.shippingOptionService_
              .withTransaction(manager)
              .validateCartOption(so, cart)
              .catch(() => null) // if validateCartOption fails it means the option is not valid
          })
        )
      ).filter((option): option is ShippingOption => !!option)
    })
  }

  /**
   * Returns a list of all the productIds in the cart.
   * @param cart - the cart to extract products from
   * @return a list of product ids
   */
  protected getProfilesInCart(cart: Cart): string[] {
    const profileIds = new Set<string>()

    cart.items.forEach((item) => {
      if (item.variant?.product) {
        profileIds.add(item.variant.product.profile_id)
      }
    })

    return [...profileIds]
  }
}

export default ShippingProfileService
