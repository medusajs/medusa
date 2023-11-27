import {
  FlagRouter,
  MedusaV2Flag,
  isDefined,
  promiseAll,
} from "@medusajs/utils"
import { MedusaError } from "medusa-core-utils"
import { EntityManager, In } from "typeorm"
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
  featureFlagRouter: FlagRouter
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
  protected readonly featureFlagRouter_: FlagRouter

  constructor({
    shippingProfileRepository,
    productService,
    productRepository,
    shippingOptionService,
    customShippingOptionService,
    featureFlagRouter,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.shippingProfileRepository_ = shippingProfileRepository
    this.productService_ = productService
    this.productRepository_ = productRepository
    this.shippingOptionService_ = shippingOptionService
    this.customShippingOptionService_ = customShippingOptionService
    this.featureFlagRouter_ = featureFlagRouter
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
    const shippingProfileRepo = this.activeManager_.withRepository(
      this.shippingProfileRepository_
    )

    const query = buildQuery<Selector<ShippingProfile>, ShippingProfile>(
      selector,
      config
    )
    return shippingProfileRepo.find(query)
  }

  async getMapProfileIdsByProductIds(
    productIds: string[]
  ): Promise<Map<string, string>> {
    const mappedProfiles = new Map<string, string>()

    if (!productIds?.length) {
      return mappedProfiles
    }

    const shippingProfiles = await this.shippingProfileRepository_.find({
      select: {
        id: true,
        products: {
          id: true,
        },
      },
      where: {
        products: {
          id: In(productIds),
        },
      },
      relations: {
        products: true,
      },
    })

    shippingProfiles.forEach((profile) => {
      profile.products.forEach((product) => {
        mappedProfiles.set(product.id, profile.id)
      })
    })

    return mappedProfiles
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

    const profileRepository = this.activeManager_.withRepository(
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

  async retrieveForProducts(
    productIds: string | string[]
  ): Promise<{ [product_id: string]: ShippingProfile[] }> {
    if (!isDefined(productIds)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"productIds" must be defined`
      )
    }

    productIds = isString(productIds) ? [productIds] : productIds

    const profileRepository = this.activeManager_.withRepository(
      this.shippingProfileRepository_
    )

    const productProfilesMap = await profileRepository.findByProducts(
      productIds
    )

    if (!Object.keys(productProfilesMap)?.length) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `No Profile found for products with id: ${productIds.join(", ")}`
      )
    }

    return productProfilesMap
  }

  async retrieveDefault(): Promise<ShippingProfile | null> {
    const profileRepository = this.activeManager_.withRepository(
      this.shippingProfileRepository_
    )

    const profile = await profileRepository.findOne({
      where: { type: ShippingProfileType.DEFAULT },
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
        const profileRepository = manager.withRepository(
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
  async retrieveGiftCardDefault(): Promise<ShippingProfile | null> {
    const profileRepository = this.activeManager_.withRepository(
      this.shippingProfileRepository_
    )

    const giftCardProfile = await profileRepository.findOne({
      where: { type: ShippingProfileType.GIFT_CARD },
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
        const profileRepository = manager.withRepository(
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
      const profileRepository = manager.withRepository(
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
      const profileRepository = manager.withRepository(
        this.shippingProfileRepository_
      )

      const profile = await this.retrieve(profileId)

      const { metadata, products, shipping_options, ...rest } = update

      if (products) {
        await this.addProduct(profile.id, products)
      }

      if (shipping_options) {
        await this.addShippingOption(profile.id, shipping_options)
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
      const profileRepo = manager.withRepository(
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
   * @deprecated use {@link addProducts} instead
   */
  async addProduct(
    profileId: string,
    productId: string | string[]
  ): Promise<ShippingProfile> {
    return await this.addProducts(profileId, productId)
  }

  /**
   * Adds a product or an array of products to the profile.
   * @param profileId - the profile to add the products to.
   * @param productId - the ID of the product or multiple products to add.
   * @return the result of update
   */
  async addProducts(
    profileId: string,
    productId: string | string[]
  ): Promise<ShippingProfile> {
    return await this.atomicPhase_(async (manager) => {
      const productServiceTx = this.productService_.withTransaction(manager)

      await productServiceTx.updateShippingProfile(
        isString(productId) ? [productId] : productId,
        profileId
      )

      return await this.retrieve(profileId)
    })
  }

  /**
   * Removes a product or an array of products from the profile.
   * @param profileId - the profile to add the products to.
   * @param productId - the ID of the product or multiple products to add.
   * @return the result of update
   */
  async removeProducts(
    profileId: string | null,
    productId: string | string[]
  ): Promise<ShippingProfile | void> {
    return await this.atomicPhase_(async (manager) => {
      const productServiceTx = this.productService_.withTransaction(manager)

      await productServiceTx.updateShippingProfile(
        isString(productId) ? [productId] : productId,
        null
      )
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
        relations: ["products.profiles", "shipping_options.profile"],
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
      const profileIds = await this.getProfilesInCart(cart)

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
        await promiseAll(
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
  protected async getProfilesInCart(cart: Cart): Promise<string[]> {
    let profileIds = new Set<string>()

    if (this.featureFlagRouter_.isFeatureEnabled(MedusaV2Flag.key)) {
      const productShippinProfileMap = await this.getMapProfileIdsByProductIds(
        cart.items.map((item) => item.variant?.product_id)
      )
      profileIds = new Set([...productShippinProfileMap.values()])
    } else {
      cart.items.forEach((item) => {
        if (item.variant?.product) {
          profileIds.add(item.variant.product.profile_id)
        }
      })
    }

    return [...profileIds]
  }
}

export default ShippingProfileService
