import { isEmpty, isEqual } from "lodash"
import { isDefined, MedusaError } from "medusa-core-utils"
import { DeepPartial, EntityManager, In, IsNull, Not } from "typeorm"
import { IPriceSelectionStrategy, TransactionBaseService } from "../interfaces"
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"
import {
  Address,
  Cart,
  Customer,
  CustomShippingOption,
  Discount,
  DiscountRule,
  DiscountRuleType,
  LineItem,
  PaymentSession,
  PaymentSessionStatus,
  SalesChannel,
  ShippingMethod,
} from "../models"
import { AddressRepository } from "../repositories/address"
import { CartRepository } from "../repositories/cart"
import { LineItemRepository } from "../repositories/line-item"
import { PaymentSessionRepository } from "../repositories/payment-session"
import { ShippingMethodRepository } from "../repositories/shipping-method"
import {
  CartCreateProps,
  CartUpdateProps,
  FilterableCartProps,
  isCart,
  LineItemUpdate,
  LineItemValidateData,
} from "../types/cart"
import {
  AddressPayload,
  FindConfig,
  TotalField,
  WithRequiredProperty,
} from "../types/common"
import { buildQuery, setMetadata } from "../utils"
import { FlagRouter } from "../utils/flag-router"
import { validateEmail } from "../utils/is-email"
import { PaymentSessionInput } from "../types/payment"
import {
  CustomerService,
  CustomShippingOptionService,
  DiscountService,
  EventBusService,
  GiftCardService,
  LineItemAdjustmentService,
  LineItemService,
  NewTotalsService,
  PaymentProviderService,
  ProductService,
  ProductVariantInventoryService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingOptionService,
  StoreService,
  TaxProviderService,
  TotalsService,
} from "."

type InjectedDependencies = {
  manager: EntityManager
  cartRepository: typeof CartRepository
  shippingMethodRepository: typeof ShippingMethodRepository
  addressRepository: typeof AddressRepository
  paymentSessionRepository: typeof PaymentSessionRepository
  lineItemRepository: typeof LineItemRepository
  eventBusService: EventBusService
  salesChannelService: SalesChannelService
  taxProviderService: TaxProviderService
  paymentProviderService: PaymentProviderService
  productService: ProductService
  storeService: StoreService
  featureFlagRouter: FlagRouter
  productVariantService: ProductVariantService
  regionService: RegionService
  lineItemService: LineItemService
  shippingOptionService: ShippingOptionService
  customerService: CustomerService
  discountService: DiscountService
  giftCardService: GiftCardService
  totalsService: TotalsService
  newTotalsService: NewTotalsService
  customShippingOptionService: CustomShippingOptionService
  lineItemAdjustmentService: LineItemAdjustmentService
  priceSelectionStrategy: IPriceSelectionStrategy
  productVariantInventoryService: ProductVariantInventoryService
}

type TotalsConfig = {
  force_taxes?: boolean
}

/* Provides layer to manipulate carts.
 * @implements BaseService
 */
class CartService extends TransactionBaseService {
  static readonly Events = {
    CUSTOMER_UPDATED: "cart.customer_updated",
    CREATED: "cart.created",
    UPDATED: "cart.updated",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly shippingMethodRepository_: typeof ShippingMethodRepository
  protected readonly cartRepository_: typeof CartRepository
  protected readonly addressRepository_: typeof AddressRepository
  protected readonly paymentSessionRepository_: typeof PaymentSessionRepository
  protected readonly lineItemRepository_: typeof LineItemRepository
  protected readonly eventBus_: EventBusService
  protected readonly productVariantService_: ProductVariantService
  protected readonly productService_: ProductService
  protected readonly storeService_: StoreService
  protected readonly salesChannelService_: SalesChannelService
  protected readonly regionService_: RegionService
  protected readonly lineItemService_: LineItemService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly customerService_: CustomerService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly discountService_: DiscountService
  protected readonly giftCardService_: GiftCardService
  protected readonly taxProviderService_: TaxProviderService
  protected readonly totalsService_: TotalsService
  protected readonly newTotalsService_: NewTotalsService
  protected readonly customShippingOptionService_: CustomShippingOptionService
  protected readonly priceSelectionStrategy_: IPriceSelectionStrategy
  protected readonly lineItemAdjustmentService_: LineItemAdjustmentService
  protected readonly featureFlagRouter_: FlagRouter
  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService

  constructor({
    manager,
    cartRepository,
    shippingMethodRepository,
    lineItemRepository,
    eventBusService,
    paymentProviderService,
    productService,
    productVariantService,
    taxProviderService,
    regionService,
    lineItemService,
    shippingOptionService,
    customerService,
    discountService,
    giftCardService,
    totalsService,
    newTotalsService,
    addressRepository,
    paymentSessionRepository,
    customShippingOptionService,
    lineItemAdjustmentService,
    priceSelectionStrategy,
    salesChannelService,
    featureFlagRouter,
    storeService,
    productVariantInventoryService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager
    this.shippingMethodRepository_ = shippingMethodRepository
    this.cartRepository_ = cartRepository
    this.lineItemRepository_ = lineItemRepository
    this.eventBus_ = eventBusService
    this.productVariantService_ = productVariantService
    this.productService_ = productService
    this.regionService_ = regionService
    this.lineItemService_ = lineItemService
    this.paymentProviderService_ = paymentProviderService
    this.customerService_ = customerService
    this.shippingOptionService_ = shippingOptionService
    this.discountService_ = discountService
    this.giftCardService_ = giftCardService
    this.totalsService_ = totalsService
    this.newTotalsService_ = newTotalsService
    this.addressRepository_ = addressRepository
    this.paymentSessionRepository_ = paymentSessionRepository
    this.customShippingOptionService_ = customShippingOptionService
    this.taxProviderService_ = taxProviderService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
    this.priceSelectionStrategy_ = priceSelectionStrategy
    this.salesChannelService_ = salesChannelService
    this.featureFlagRouter_ = featureFlagRouter
    this.storeService_ = storeService
    this.productVariantInventoryService_ = productVariantInventoryService
  }

  /**
   * @param selector - the query object for find
   * @param config - config object
   * @return the result of the find operation
   */
  async list(
    selector: FilterableCartProps,
    config: FindConfig<Cart> = {}
  ): Promise<Cart[]> {
    const manager = this.manager_
    const cartRepo = manager.getCustomRepository(this.cartRepository_)

    const query = buildQuery(selector, config)
    return await cartRepo.find(query)
  }

  /**
   * Gets a cart by id.
   * @param cartId - the id of the cart to get.
   * @param options - the options to get a cart
   * @param totalsConfig
   * @return the cart document.
   */
  async retrieve(
    cartId: string,
    options: FindConfig<Cart> = {},
    totalsConfig: TotalsConfig = {}
  ): Promise<Cart> {
    if (!isDefined(cartId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"cartId" must be defined`
      )
    }

    const { totalsToSelect } = this.transformQueryForTotals_(options)

    if (totalsToSelect.length) {
      return await this.retrieveLegacy(cartId, options, totalsConfig)
    }

    const manager = this.manager_
    const cartRepo = manager.getCustomRepository(this.cartRepository_)

    const query = buildQuery({ id: cartId }, options)

    if ((options.select || []).length === 0) {
      query.select = undefined
    }

    const queryRelations = query.relations
    query.relations = undefined

    const raw = await cartRepo.findOneWithRelations(queryRelations, query)

    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Cart with ${cartId} was not found`
      )
    }

    return raw
  }

  /**
   * @deprecated
   * @param cartId
   * @param options
   * @param totalsConfig
   * @protected
   */
  protected async retrieveLegacy(
    cartId: string,
    options: FindConfig<Cart> = {},
    totalsConfig: TotalsConfig = {}
  ): Promise<Cart> {
    const manager = this.manager_
    const cartRepo = manager.getCustomRepository(this.cartRepository_)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals_(options)

    const query = buildQuery({ id: cartId }, { ...options, select, relations })

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    query.select = select?.length ? select : undefined

    const queryRelations = query.relations
    query.relations = undefined
    const raw = await cartRepo.findOneWithRelations(queryRelations, query)
    if (!raw) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Cart with ${cartId} was not found`
      )
    }

    return await this.decorateTotals_(raw, totalsToSelect, totalsConfig)
  }

  async retrieveWithTotals(
    cartId: string,
    options: FindConfig<Cart> = {},
    totalsConfig: TotalsConfig = {}
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const relations = this.getTotalsRelations(options)

    const cart = await this.retrieve(cartId, {
      ...options,
      relations,
    })

    return await this.decorateTotals(cart, totalsConfig)
  }

  /**
   * Creates a cart.
   * @param data - the data to create the cart with
   * @return the result of the create operation
   */
  async create(data: CartCreateProps): Promise<Cart | never> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        const addressRepo = transactionManager.getCustomRepository(
          this.addressRepository_
        )

        const rawCart: DeepPartial<Cart> = {
          context: data.context ?? {},
        }

        if (
          this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
        ) {
          rawCart.sales_channel_id = (
            await this.getValidatedSalesChannel(data.sales_channel_id)
          ).id
        }

        if (data.customer_id) {
          const customer = await this.customerService_
            .withTransaction(transactionManager)
            .retrieve(data.customer_id)
            .catch(() => undefined)
          rawCart.customer = customer
          rawCart.customer_id = customer?.id
          rawCart.email = customer?.email
        }

        if (!rawCart.email && data.email) {
          const customer = await this.createOrFetchGuestCustomerFromEmail_(
            data.email
          )
          rawCart.customer = customer
          rawCart.customer_id = customer.id
          rawCart.email = customer.email
        }

        if (!data.region_id && !data.region) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `A region_id must be provided when creating a cart`
          )
        }

        rawCart.region_id = data.region_id
        const region = data.region
          ? data.region
          : await this.regionService_
              .withTransaction(transactionManager)
              .retrieve(data.region_id!, {
                relations: ["countries"],
              })
        const regCountries = region.countries.map(({ iso_2 }) => iso_2)

        if (!data.shipping_address && !data.shipping_address_id) {
          if (region.countries.length === 1) {
            rawCart.shipping_address = addressRepo.create({
              country_code: regCountries[0],
            })
          }
        } else {
          if (data.shipping_address) {
            if (!regCountries.includes(data.shipping_address.country_code!)) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address = data.shipping_address
          }
          if (data.shipping_address_id) {
            const addr = await addressRepo.findOne(data.shipping_address_id)
            if (
              addr?.country_code &&
              !regCountries.includes(addr.country_code)
            ) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address_id = data.shipping_address_id
          }
        }

        if (data.billing_address) {
          if (!regCountries.includes(data.billing_address.country_code!)) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Billing country not in region"
            )
          }
          rawCart.billing_address = data.billing_address
        }
        if (data.billing_address_id) {
          const addr = await addressRepo.findOne(data.billing_address_id)
          if (addr?.country_code && !regCountries.includes(addr.country_code)) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Billing country not in region"
            )
          }
          rawCart.billing_address_id = data.billing_address_id
        }

        const remainingFields: (keyof Cart)[] = [
          "context",
          "type",
          "metadata",
          "discounts",
          "gift_cards",
        ]

        for (const remainingField of remainingFields) {
          if (isDefined(data[remainingField]) && remainingField !== "object") {
            const key = remainingField as string
            rawCart[key] = data[remainingField]
          }
        }

        const createdCart = cartRepo.create(rawCart)
        const cart = await cartRepo.save(createdCart)
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.CREATED, {
            id: cart.id,
          })
        return cart
      }
    )
  }

  protected async getValidatedSalesChannel(
    salesChannelId?: string
  ): Promise<SalesChannel | never> {
    let salesChannel: SalesChannel
    if (isDefined(salesChannelId)) {
      salesChannel = await this.salesChannelService_
        .withTransaction(this.manager_)
        .retrieve(salesChannelId)
    } else {
      salesChannel = (
        await this.storeService_.withTransaction(this.manager_).retrieve({
          relations: ["default_sales_channel"],
        })
      ).default_sales_channel
    }

    if (salesChannel.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Unable to assign the cart to a disabled Sales Channel "${salesChannel.name}"`
      )
    }

    return salesChannel
  }

  /**
   * Removes a line item from the cart.
   * @param cartId - the id of the cart that we will remove from
   * @param lineItemId - the line item to remove.
   * @return the result of the update operation
   */
  async removeLineItem(cartId: string, lineItemId: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: [
            "items",
            "items.variant",
            "items.variant.product",
            "payment_sessions",
          ],
        })

        const lineItem = cart.items.find((item) => item.id === lineItemId)
        if (!lineItem) {
          return cart
        }

        // Remove shipping methods if they are not needed
        if (cart.shipping_methods?.length) {
          await this.shippingOptionService_
            .withTransaction(transactionManager)
            .deleteShippingMethods(cart.shipping_methods)
        }

        const lineItemRepository = transactionManager.getCustomRepository(
          this.lineItemRepository_
        )
        await lineItemRepository.update(
          {
            id: In(cart.items.map((item) => item.id)),
          },
          {
            has_shipping: false,
          }
        )

        await this.lineItemService_
          .withTransaction(transactionManager)
          .delete(lineItem.id)

        const result = await this.retrieve(cartId, {
          relations: ["items", "discounts", "discounts.rule", "region"],
        })

        await this.refreshAdjustments_(result)

        // Notify subscribers
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, {
            id: cart.id,
          })

        return this.retrieve(cartId)
      }
    )
  }

  /**
   * Checks if a given line item has a shipping method that can fulfill it.
   * Returns true if all products in the cart can be fulfilled with the current
   * shipping methods.
   * @param shippingMethods - the set of shipping methods to check from
   * @param lineItem - the line item
   * @return boolean representing whether shipping method is validated
   */
  protected validateLineItemShipping_(
    shippingMethods: ShippingMethod[],
    lineItem: LineItem
  ): boolean {
    if (!lineItem.variant_id) {
      return true
    }

    if (
      shippingMethods &&
      shippingMethods.length &&
      lineItem.variant &&
      lineItem.variant.product
    ) {
      const productProfile = lineItem.variant.product.profile_id
      const selectedProfiles = shippingMethods.map(
        ({ shipping_option }) => shipping_option.profile_id
      )
      return selectedProfiles.includes(productProfile)
    }

    return false
  }

  /**
   * Check if line item's variant belongs to the cart's sales channel.
   *
   * @param sales_channel_id - the cart for the line item
   * @param lineItem - the line item being added
   * @return a boolean indicating validation result
   */
  protected async validateLineItem(
    { sales_channel_id }: { sales_channel_id: string | null },
    lineItem: LineItemValidateData
  ): Promise<boolean> {
    if (!sales_channel_id || !lineItem.variant_id) {
      return true
    }

    const lineItemVariant = lineItem.variant?.product_id
      ? lineItem.variant
      : await this.productVariantService_
          .withTransaction(this.manager_)
          .retrieve(lineItem.variant_id, { select: ["id", "product_id"] })

    return !!(
      await this.productService_
        .withTransaction(this.manager_)
        .filterProductsBySalesChannel(
          [lineItemVariant.product_id],
          sales_channel_id
        )
    ).length
  }

  /**
   * Adds a line item to the cart.
   * @param cartId - the id of the cart that we will add to
   * @param lineItem - the line item to add.
   * @param config
   *    validateSalesChannels - should check if product belongs to the same sales chanel as cart
   *                            (if cart has associated sales channel)
   * @return the result of the update operation
   * @deprecated Use {@link addOrUpdateLineItems} instead.
   */
  async addLineItem(
    cartId: string,
    lineItem: LineItem,
    config = { validateSalesChannels: true }
  ): Promise<void> {
    const select: (keyof Cart)[] = ["id"]

    if (this.featureFlagRouter_.isFeatureEnabled("sales_channels")) {
      select.push("sales_channel_id")
    }

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        let cart = await this.retrieve(cartId, { select })

        if (this.featureFlagRouter_.isFeatureEnabled("sales_channels")) {
          if (config.validateSalesChannels) {
            if (lineItem.variant_id) {
              const lineItemIsValid = await this.validateLineItem(
                cart,
                lineItem as LineItemValidateData
              )

              if (!lineItemIsValid) {
                throw new MedusaError(
                  MedusaError.Types.INVALID_DATA,
                  `The product "${lineItem.title}" must belongs to the sales channel on which the cart has been created.`
                )
              }
            }
          }
        }

        const lineItemServiceTx =
          this.lineItemService_.withTransaction(transactionManager)

        let currentItem: LineItem | undefined
        if (lineItem.should_merge) {
          const [existingItem] = await lineItemServiceTx.list(
            {
              cart_id: cart.id,
              variant_id: lineItem.variant_id,
              should_merge: true,
            },
            { take: 1, select: ["id", "metadata", "quantity"] }
          )
          if (
            existingItem &&
            isEqual(existingItem.metadata, lineItem.metadata)
          ) {
            currentItem = existingItem
          }
        }

        // If content matches one of the line items currently in the cart we can
        // simply update the quantity of the existing line item
        const quantity = currentItem
          ? (currentItem.quantity += lineItem.quantity)
          : lineItem.quantity

        // Confirm inventory or throw error
        if (lineItem.variant_id) {
          const isCovered =
            await this.productVariantInventoryService_.confirmInventory(
              lineItem.variant_id,
              quantity,
              { salesChannelId: cart.sales_channel_id }
            )

          if (!isCovered) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              `Variant with id: ${lineItem.variant_id} does not have the required inventory`,
              MedusaError.Codes.INSUFFICIENT_INVENTORY
            )
          }
        }

        if (currentItem) {
          await lineItemServiceTx.update(currentItem.id, {
            quantity: currentItem.quantity,
          })
        } else {
          await lineItemServiceTx.create({
            ...lineItem,
            has_shipping: false,
            cart_id: cart.id,
          })
        }

        await lineItemServiceTx
          .update(
            { cart_id: cartId, has_shipping: true },
            { has_shipping: false }
          )
          .catch((err: Error | MedusaError) => {
            // We only want to catch the errors related to not found items since we don't care if there is not item to update
            if ("type" in err && err.type === MedusaError.Types.NOT_FOUND) {
              return
            }
            throw err
          })

        cart = await this.retrieve(cart.id, {
          relations: ["items", "discounts", "discounts.rule", "region"],
        })

        await this.refreshAdjustments_(cart)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, { id: cart.id })
      }
    )
  }

  /**
   * Adds or update one or multiple line items to the cart. It also update all existing items in the cart
   * to have has_shipping to false. Finally, the adjustments will be updated.
   * @param cartId - the id of the cart that we will add to
   * @param lineItems - the line items to add.
   * @param config
   *    validateSalesChannels - should check if product belongs to the same sales chanel as cart
   *                            (if cart has associated sales channel)
   * @return the result of the update operation
   */
  async addOrUpdateLineItems(
    cartId: string,
    lineItems: LineItem | LineItem[],
    config = { validateSalesChannels: true }
  ): Promise<void> {
    const items: LineItem[] = Array.isArray(lineItems) ? lineItems : [lineItems]

    const select: (keyof Cart)[] = ["id"]

    if (this.featureFlagRouter_.isFeatureEnabled("sales_channels")) {
      select.push("sales_channel_id")
    }

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        let cart = await this.retrieve(cartId, { select })

        if (this.featureFlagRouter_.isFeatureEnabled("sales_channels")) {
          if (config.validateSalesChannels) {
            const areValid = await Promise.all(
              items.map(async (item) => {
                if (item.variant_id) {
                  return await this.validateLineItem(
                    cart,
                    item as LineItemValidateData
                  )
                }
                return true
              })
            )

            const invalidProducts = areValid
              .map((valid, index) => {
                return !valid ? { title: items[index].title } : undefined
              })
              .filter((v): v is { title: string } => !!v)

            if (invalidProducts.length) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `The products [${invalidProducts
                  .map((item) => item.title)
                  .join(
                    " - "
                  )}] must belongs to the sales channel on which the cart has been created.`
              )
            }
          }
        }

        const lineItemServiceTx =
          this.lineItemService_.withTransaction(transactionManager)
        const productVariantInventoryServiceTx =
          this.productVariantInventoryService_.withTransaction(
            transactionManager
          )

        const existingItems = await lineItemServiceTx.list(
          {
            cart_id: cart.id,
            variant_id: In([items.map((item) => item.variant_id)]),
            should_merge: true,
          },
          { select: ["id", "metadata", "quantity"] }
        )

        const existingItemsVariantMap = new Map()
        existingItems.forEach((item) => {
          existingItemsVariantMap.set(item.variant_id, item)
        })

        const lineItemsToCreate: LineItem[] = []
        const lineItemsToUpdate: { [id: string]: LineItem }[] = []
        for (const item of items) {
          let currentItem: LineItem | undefined

          const existingItem = existingItemsVariantMap.get(item.variant_id)
          if (item.should_merge) {
            if (existingItem && isEqual(existingItem.metadata, item.metadata)) {
              currentItem = existingItem
            }
          }

          // If content matches one of the line items currently in the cart we can
          // simply update the quantity of the existing line item
          item.quantity = currentItem
            ? (currentItem.quantity += item.quantity)
            : item.quantity

          if (item.variant_id) {
            const isSufficient =
              await productVariantInventoryServiceTx.confirmInventory(
                item.variant_id,
                item.quantity,
                { salesChannelId: cart.sales_channel_id }
              )

            if (!isSufficient) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                `Variant with id: ${item.variant_id} does not have the required inventory`,
                MedusaError.Codes.INSUFFICIENT_INVENTORY
              )
            }
          }

          if (currentItem) {
            lineItemsToUpdate[currentItem.id] = {
              quantity: item.quantity,
              has_shipping: false,
            }
          } else {
            // Since the variant is eager loaded, we are removing it before the line item is being created.
            delete (item as Partial<LineItem>).variant
            item.has_shipping = false
            item.cart_id = cart.id
            lineItemsToCreate.push(item)
          }
        }

        const itemKeysToUpdate = Object.keys(lineItemsToUpdate)

        // Update all items that needs to be updated
        if (itemKeysToUpdate.length) {
          await Promise.all(
            itemKeysToUpdate.map(async (id) => {
              return await lineItemServiceTx.update(id, lineItemsToUpdate[id])
            })
          )
        }

        // Create all items that needs to be created
        await lineItemServiceTx.create(lineItemsToCreate)

        await lineItemServiceTx
          .update(
            {
              cart_id: cartId,
              has_shipping: true,
            },
            { has_shipping: false }
          )
          .catch((err: Error | MedusaError) => {
            // We only want to catch the errors related to not found items since we don't care if there is not item to update
            if ("type" in err && err.type === MedusaError.Types.NOT_FOUND) {
              return
            }
            throw err
          })

        cart = await this.retrieve(cart.id, {
          relations: ["items", "discounts", "discounts.rule", "region"],
        })

        await this.refreshAdjustments_(cart)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, { id: cart.id })
      }
    )
  }

  /**
   * Updates a cart's existing line item.
   * @param cartId - the id of the cart to update
   * @param lineItemId - the id of the line item to update.
   * @param lineItemUpdate - the line item to update. Must include an id field.
   * @return the result of the update operation
   */
  async updateLineItem(
    cartId: string,
    lineItemId: string,
    lineItemUpdate: LineItemUpdate
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const lineItem = await this.lineItemService_.retrieve(lineItemId, {
          select: ["id", "quantity", "variant_id", "cart_id"],
        })

        if (lineItem.cart_id !== cartId) {
          // Ensure that the line item exists in the cart
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "A line item with the provided id doesn't exist in the cart"
          )
        }

        if (lineItemUpdate.quantity) {
          if (lineItem.variant_id) {
            const select: (keyof Cart)[] = ["id"]
            if (
              this.featureFlagRouter_.isFeatureEnabled(
                SalesChannelFeatureFlag.key
              )
            ) {
              select.push("sales_channel_id")
            }

            const cart = await this.retrieve(cartId, { select: select })

            const hasInventory =
              await this.productVariantInventoryService_.confirmInventory(
                lineItem.variant_id,
                lineItemUpdate.quantity,
                { salesChannelId: cart.sales_channel_id }
              )

            if (!hasInventory) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Inventory doesn't cover the desired quantity"
              )
            }
          }
        }

        await this.lineItemService_
          .withTransaction(transactionManager)
          .update(lineItemId, lineItemUpdate)

        const updatedCart = await this.retrieve(cartId, {
          relations: ["items", "discounts", "discounts.rule", "region"],
        })

        await this.refreshAdjustments_(updatedCart)

        // Update the line item
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)

        return updatedCart
      }
    )
  }

  /**
   * Ensures shipping total on cart is correct in regards to a potential free
   * shipping discount
   * If a free shipping is present, we set shipping methods price to 0
   * if a free shipping was present, we set shipping methods to original amount
   * @param cart - the the cart to adjust free shipping for
   * @param shouldAdd - flag to indicate, if we should add or remove
   * @return void
   */
  protected async adjustFreeShipping_(
    cart: Cart,
    shouldAdd: boolean
  ): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    if (cart.shipping_methods?.length) {
      const shippingMethodRepository = transactionManager.getCustomRepository(
        this.shippingMethodRepository_
      )

      // if any free shipping discounts, we ensure to update shipping method amount
      if (shouldAdd) {
        await shippingMethodRepository.update(
          {
            id: In(
              cart.shipping_methods.map((shippingMethod) => shippingMethod.id)
            ),
          },
          {
            price: 0,
          }
        )
      } else {
        await Promise.all(
          cart.shipping_methods.map(async (shippingMethod) => {
            // if free shipping discount is removed, we adjust the shipping
            // back to its original amount
            // if shipping option amount is null, we assume the option is calculated
            shippingMethod.price =
              shippingMethod.shipping_option.amount ??
              (await this.shippingOptionService_.getPrice_(
                shippingMethod.shipping_option,
                shippingMethod.data,
                cart
              ))
            return shippingMethodRepository.save(shippingMethod)
          })
        )
      }
    }
  }

  async update(cartId: string, data: CartUpdateProps): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        const relations = [
          "items",
          "shipping_methods",
          "shipping_address",
          "billing_address",
          "gift_cards",
          "customer",
          "region",
          "payment_sessions",
          "region.countries",
          "discounts",
          "discounts.rule",
          "discounts.regions",
        ]

        if (
          this.featureFlagRouter_.isFeatureEnabled(
            SalesChannelFeatureFlag.key
          ) &&
          data.sales_channel_id
        ) {
          relations.push("items.variant", "items.variant.product")
        }

        const cart = await this.retrieve(cartId, {
          relations,
        })

        const originalCartCustomer = { ...(cart.customer ?? {}) }
        if (data.customer_id) {
          await this.updateCustomerId_(cart, data.customer_id)
        } else if (isDefined(data.email)) {
          const customer = await this.createOrFetchGuestCustomerFromEmail_(
            data.email
          )
          cart.customer = customer
          cart.customer_id = customer.id
          cart.email = customer.email
        }

        if (isDefined(data.customer_id) || isDefined(data.region_id)) {
          await this.updateUnitPrices_(cart, data.region_id, data.customer_id)
        }

        if (isDefined(data.region_id)) {
          const shippingAddress =
            typeof data.shipping_address !== "string"
              ? data.shipping_address
              : {}
          const countryCode =
            (data.country_code || shippingAddress?.country_code) ?? null
          await this.setRegion_(cart, data.region_id, countryCode)
        }

        const addrRepo = transactionManager.getCustomRepository(
          this.addressRepository_
        )

        const billingAddress = data.billing_address_id ?? data.billing_address
        if (billingAddress !== undefined) {
          await this.updateBillingAddress_(cart, billingAddress, addrRepo)
        }

        const shippingAddress =
          data.shipping_address_id ?? data.shipping_address
        if (shippingAddress !== undefined) {
          await this.updateShippingAddress_(cart, shippingAddress, addrRepo)
        }

        if (
          this.featureFlagRouter_.isFeatureEnabled(SalesChannelFeatureFlag.key)
        ) {
          if (
            isDefined(data.sales_channel_id) &&
            data.sales_channel_id != cart.sales_channel_id
          ) {
            await this.onSalesChannelChange(cart, data.sales_channel_id)
            cart.sales_channel_id = data.sales_channel_id
          }
        }

        if (isDefined(data.discounts) && data.discounts.length) {
          const previousDiscounts = [...cart.discounts]
          cart.discounts.length = 0

          await this.applyDiscounts(
            cart,
            data.discounts.map((d) => d.code)
          )

          const hasFreeShipping = cart.discounts.some(
            ({ rule }) => rule?.type === DiscountRuleType.FREE_SHIPPING
          )

          // if we previously had a free shipping discount and then removed it,
          // we need to update shipping methods to original price
          if (
            previousDiscounts.some(
              ({ rule }) => rule.type === DiscountRuleType.FREE_SHIPPING
            ) &&
            !hasFreeShipping
          ) {
            await this.adjustFreeShipping_(cart, false)
          }

          if (hasFreeShipping) {
            await this.adjustFreeShipping_(cart, true)
          }
        } else if (isDefined(data.discounts) && !data.discounts.length) {
          cart.discounts.length = 0
          await this.refreshAdjustments_(cart)
        }

        if ("gift_cards" in data) {
          cart.gift_cards = []

          await Promise.all(
            (data.gift_cards ?? []).map(async ({ code }) => {
              return this.applyGiftCard_(cart, code)
            })
          )
        }

        if (data?.metadata) {
          cart.metadata = setMetadata(cart, data.metadata)
        }

        if ("context" in data) {
          const prevContext = cart.context || {}
          cart.context = {
            ...prevContext,
            ...data.context,
          }
        }

        if ("completed_at" in data) {
          cart.completed_at = data.completed_at!
        }

        if ("payment_authorized_at" in data) {
          cart.payment_authorized_at = data.payment_authorized_at!
        }

        const updatedCart = await cartRepo.save(cart)

        if (
          (data.email && data.email !== originalCartCustomer.email) ||
          (data.customer_id && data.customer_id !== originalCartCustomer.id)
        ) {
          await this.eventBus_
            .withTransaction(transactionManager)
            .emit(CartService.Events.CUSTOMER_UPDATED, updatedCart.id)
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)

        return updatedCart
      }
    )
  }

  /**
   * Remove the cart line item that does not belongs to the newly assigned sales channel
   *
   * @param cart - The cart being updated
   * @param newSalesChannelId - The new sales channel being assigned to the cart
   * @return void
   * @protected
   */
  protected async onSalesChannelChange(
    cart: Cart,
    newSalesChannelId: string
  ): Promise<void> {
    await this.getValidatedSalesChannel(newSalesChannelId)

    const productIds = cart.items.map((item) => item.variant.product_id)
    const productsToKeep = await this.productService_
      .withTransaction(this.manager_)
      .filterProductsBySalesChannel(productIds, newSalesChannelId, {
        select: ["id"],
        take: productIds.length,
      })
    const productIdsToKeep = new Set<string>(
      productsToKeep.map((product) => product.id)
    )
    const itemsToRemove = cart.items.filter((item) => {
      return !productIdsToKeep.has(item.variant.product_id)
    })

    if (itemsToRemove.length) {
      const results = await Promise.all(
        itemsToRemove.map(async (item) => {
          return this.removeLineItem(cart.id, item.id)
        })
      )
      cart.items = results.pop()?.items ?? []
    }
  }

  /**
   * Sets the customer id of a cart
   * @param cart - the cart to add email to
   * @param customerId - the customer to add to cart
   * @return the result of the update operation
   */
  protected async updateCustomerId_(
    cart: Cart,
    customerId: string
  ): Promise<void> {
    const customer = await this.customerService_
      .withTransaction(this.transactionManager_)
      .retrieve(customerId)

    cart.customer = customer
    cart.customer_id = customer.id
    cart.email = customer.email
  }

  /**
   * Creates or fetches a user based on an email.
   * @param email - the email to use
   * @return the resultign customer object
   */
  protected async createOrFetchGuestCustomerFromEmail_(
    email: string
  ): Promise<Customer> {
    const validatedEmail = validateEmail(email)

    let customer = await this.customerService_
      .withTransaction(this.transactionManager_)
      .retrieveUnregisteredByEmail(validatedEmail)
      .catch(() => undefined)

    if (!customer) {
      customer = await this.customerService_
        .withTransaction(this.transactionManager_)
        .create({ email: validatedEmail })
    }

    return customer
  }

  /**
   * Updates the cart's billing address.
   * @param cart - the cart to update
   * @param addressOrId - the value to set the billing address to
   * @param addrRepo - the repository to use for address updates
   * @return the result of the update operation
   */
  protected async updateBillingAddress_(
    cart: Cart,
    addressOrId: AddressPayload | Partial<Address> | string,
    addrRepo: AddressRepository
  ): Promise<void> {
    let address: Address
    if (typeof addressOrId === `string`) {
      address = (await addrRepo.findOne({
        where: { id: addressOrId },
      })) as Address
    } else {
      address = addressOrId as Address
    }

    if (address.id) {
      cart.billing_address = await addrRepo.save(address)
    } else {
      if (cart.billing_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: cart.billing_address_id },
        })

        await addrRepo.save({ ...addr, ...address })
      } else {
        cart.billing_address = addrRepo.create({
          ...address,
        })
      }
    }
  }

  /**
   * Updates the cart's shipping address.
   * @param cart - the cart to update
   * @param addressOrId - the value to set the shipping address to
   * @param addrRepo - the repository to use for address updates
   * @return the result of the update operation
   */
  protected async updateShippingAddress_(
    cart: Cart,
    addressOrId: AddressPayload | Partial<Address> | string,
    addrRepo: AddressRepository
  ): Promise<void> {
    let address: Address

    if (addressOrId === null) {
      cart.shipping_address = null
      return
    }

    if (typeof addressOrId === `string`) {
      address = (await addrRepo.findOne({
        where: { id: addressOrId },
      })) as Address
    } else {
      address = addressOrId as Address
    }

    if (
      address.country_code &&
      !cart.region.countries.find(
        ({ iso_2 }) => address.country_code?.toLowerCase() === iso_2
      )
    ) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Shipping country must be in the cart region"
      )
    }

    if (address.id) {
      cart.shipping_address = await addrRepo.save(address)
    } else {
      if (cart.shipping_address_id) {
        const addr = await addrRepo.findOne({
          where: { id: cart.shipping_address_id },
        })

        await addrRepo.save({ ...addr, ...address })
      } else {
        cart.shipping_address = addrRepo.create({
          ...address,
        })
      }
    }
  }

  protected async applyGiftCard_(cart: Cart, code: string): Promise<void> {
    const giftCard = await this.giftCardService_
      .withTransaction(this.transactionManager_)
      .retrieveByCode(code)

    if (giftCard.is_disabled) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "The gift card is disabled"
      )
    }

    if (giftCard.region_id !== cart.region_id) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The gift card cannot be used in the current region"
      )
    }

    // if discount is already there, we simply resolve
    if (cart.gift_cards.find(({ id }) => id === giftCard.id)) {
      return
    }

    cart.gift_cards = [...cart.gift_cards, giftCard]
  }

  /**
   * Updates the cart's discounts.
   * If discount besides free shipping is already applied, this
   * will be overwritten
   * Throws if discount regions does not include the cart region
   * @param cart - the cart to update
   * @param discountCode - the discount code
   */
  async applyDiscount(cart: Cart, discountCode: string): Promise<void> {
    return await this.applyDiscounts(cart, [discountCode])
  }

  /**
   * Updates the cart's discounts.
   * If discount besides free shipping is already applied, this
   * will be overwritten
   * Throws if discount regions does not include the cart region
   * @param cart - the cart to update
   * @param discountCodes - the discount code(s) to apply
   */
  async applyDiscounts(cart: Cart, discountCodes: string[]): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const discounts = await this.discountService_
          .withTransaction(transactionManager)
          .listByCodes(discountCodes, { relations: ["rule", "regions"] })

        await this.discountService_
          .withTransaction(transactionManager)
          .validateDiscountForCartOrThrow(cart, discounts)

        const rules: Map<string, DiscountRule> = new Map()
        const discountsMap = new Map(
          discounts.map((d) => {
            rules.set(d.id, d.rule)
            return [d.id, d]
          })
        )

        cart.discounts.forEach((discount) => {
          if (discountsMap.has(discount.id)) {
            discountsMap.delete(discount.id)
          }
        })

        const toParse = [...cart.discounts, ...discountsMap.values()]

        let sawNotShipping = false
        const newDiscounts = toParse.map((discountToParse) => {
          switch (discountToParse.rule?.type) {
            case DiscountRuleType.FREE_SHIPPING:
              if (
                discountToParse.rule.type ===
                rules.get(discountToParse.id)!.type
              ) {
                return discountsMap.get(discountToParse.id)
              }
              return discountToParse
            default:
              if (!sawNotShipping) {
                sawNotShipping = true
                if (
                  rules.get(discountToParse.id)!.type !==
                  DiscountRuleType.FREE_SHIPPING
                ) {
                  return discountsMap.get(discountToParse.id)
                }
                return discountToParse
              }
              return null
          }
        })

        cart.discounts = newDiscounts.filter(
          (newDiscount): newDiscount is Discount => {
            return !!newDiscount
          }
        )

        const hadNonFreeShippingDiscounts = [...rules.values()].some(
          (rule) => rule.type !== DiscountRuleType.FREE_SHIPPING
        )

        if (hadNonFreeShippingDiscounts && cart?.items) {
          await this.refreshAdjustments_(cart)
        }
      }
    )
  }

  /**
   * Removes a discount based on a discount code.
   * @param cartId - the id of the cart to remove from
   * @param discountCode - the discount code to remove
   * @return the resulting cart
   */
  async removeDiscount(cartId: string, discountCode: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: [
            "items",
            "region",
            "discounts",
            "discounts.rule",
            "payment_sessions",
            "shipping_methods",
          ],
        })

        if (
          cart.discounts.some(
            ({ rule }) => rule.type === DiscountRuleType.FREE_SHIPPING
          )
        ) {
          await this.adjustFreeShipping_(cart, false)
        }

        cart.discounts = cart.discounts.filter(
          (discount) => discount.code !== discountCode
        )

        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        const updatedCart = await cartRepo.save(cart)

        await this.refreshAdjustments_(updatedCart)

        if (cart.payment_sessions?.length) {
          await this.setPaymentSessions(cartId)
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)

        return updatedCart
      }
    )
  }

  /**
   * Updates the currently selected payment session.
   * @param cartId - the id of the cart to update the payment session for
   * @param update - the data to update the payment session with
   * @return the resulting cart
   */
  async updatePaymentSession(
    cartId: string,
    update: Record<string, unknown>
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: ["payment_sessions"],
        })

        if (cart.payment_session) {
          await this.paymentProviderService_
            .withTransaction(transactionManager)
            .updateSessionData(cart.payment_session, update)
        }

        const updatedCart = await this.retrieve(cart.id)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
      }
    )
  }

  /**
   * Authorizes a payment for a cart.
   * Will authorize with chosen payment provider. This will return
   * a payment object, that we will use to update our cart payment with.
   * Additionally, if the payment does not require more or fails, we will
   * set the payment on the cart.
   * @param cartId - the id of the cart to authorize payment for
   * @param context - object containing whatever is relevant for
   *    authorizing the payment with the payment provider. As an example,
   *    this could be IP address or similar for fraud handling.
   * @return the resulting cart
   */
  async authorizePayment(
    cartId: string,
    context: Record<string, unknown> & {
      cart_id: string
    } = { cart_id: "" }
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepository = transactionManager.getCustomRepository(
          this.cartRepository_
        )

        const cart = await this.retrieveWithTotals(cartId, {
          relations: ["payment_sessions"],
        })

        // If cart total is 0, we don't perform anything payment related
        if (cart.total! <= 0) {
          cart.payment_authorized_at = new Date()
          await cartRepository.save({
            id: cart.id,
            payment_authorized_at: cart.payment_authorized_at,
          })

          await this.eventBus_
            .withTransaction(transactionManager)
            .emit(CartService.Events.UPDATED, cart)

          return cart
        }

        if (!cart.payment_session) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "You cannot complete a cart without a payment session."
          )
        }

        const session = (await this.paymentProviderService_
          .withTransaction(transactionManager)
          .authorizePayment(cart.payment_session, context)) as PaymentSession

        const freshCart = (await this.retrieve(cart.id, {
          relations: ["payment_sessions"],
        })) as Cart & { payment_session: PaymentSession }

        if (session.status === "authorized") {
          freshCart.payment = await this.paymentProviderService_
            .withTransaction(transactionManager)
            .createPayment({
              cart_id: cart.id,
              currency_code: cart.region.currency_code,
              amount: cart.total!,
              payment_session: freshCart.payment_session,
            })
          freshCart.payment_authorized_at = new Date()
        }

        const updatedCart = await cartRepository.save(freshCart)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)

        return updatedCart
      }
    )
  }

  /**
   * Selects a payment session for a cart and creates a payment object in the external provider system
   * @param cartId - the id of the cart to add payment method to
   * @param providerId - the id of the provider to be set to the cart
   */
  async setPaymentSession(cartId: string, providerId: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const psRepo = transactionManager.getCustomRepository(
          this.paymentSessionRepository_
        )

        const cart = await this.retrieveWithTotals(cartId, {
          relations: [
            "customer",
            "region",
            "region.payment_providers",
            "payment_sessions",
          ],
        })

        const isProviderPresent = cart.region.payment_providers.find(
          ({ id }) => providerId === id
        )

        if (providerId !== "system" && !isProviderPresent) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `The payment method is not available in this region`
          )
        }

        let currentlySelectedSession = cart.payment_sessions.find(
          (s) => s.is_selected
        )

        if (
          currentlySelectedSession &&
          currentlySelectedSession.provider_id !== providerId
        ) {
          const psRepo = transactionManager.getCustomRepository(
            this.paymentSessionRepository_
          )

          if (currentlySelectedSession.is_initiated) {
            await this.paymentProviderService_
              .withTransaction(transactionManager)
              .deleteSession(currentlySelectedSession)

            currentlySelectedSession = psRepo.create(currentlySelectedSession)
          }

          currentlySelectedSession.is_initiated = false
          currentlySelectedSession.is_selected = false
          await psRepo.save(currentlySelectedSession)
        }

        const cartPaymentSessionIds = cart.payment_sessions.map((p) => p.id)
        await psRepo.update(
          { id: In(cartPaymentSessionIds) },
          {
            is_selected: null,
            is_initiated: false,
          }
        )

        let paymentSession = cart.payment_sessions.find(
          (ps) => ps.provider_id === providerId
        )

        if (!paymentSession) {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Could not find payment session"
          )
        }

        const sessionInput: PaymentSessionInput = {
          cart,
          customer: cart.customer,
          amount: cart.total!,
          currency_code: cart.region.currency_code,
          provider_id: providerId,
          payment_session_id: paymentSession.id,
        }

        if (paymentSession.is_initiated) {
          // update the session remotely
          await this.paymentProviderService_
            .withTransaction(transactionManager)
            .updateSession(paymentSession, sessionInput)
        } else {
          // Create the session remotely
          paymentSession = await this.paymentProviderService_
            .withTransaction(transactionManager)
            .createSession(sessionInput)
        }

        await psRepo.update(paymentSession.id, {
          is_selected: true,
          is_initiated: true,
        })

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, { id: cartId })
      },
      "SERIALIZABLE"
    )
  }

  /**
   * Creates, updates and sets payment sessions associated with the cart. The
   * first time the method is called payment sessions will be created for each
   * provider. Additional calls will ensure that payment sessions have correct
   * amounts, currencies, etc. as well as make sure to filter payment sessions
   * that are not available for the cart's region.
   * @param cartOrCartId - the id of the cart to set payment session for
   * @return the result of the update operation.
   */
  async setPaymentSessions(cartOrCartId: Cart | string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const psRepo = transactionManager.getCustomRepository(
          this.paymentSessionRepository_
        )

        const paymentProviderServiceTx =
          this.paymentProviderService_.withTransaction(transactionManager)

        const cartId =
          typeof cartOrCartId === `string` ? cartOrCartId : cartOrCartId.id

        const cart = await this.retrieveWithTotals(
          cartId,
          {
            relations: [
              "items",
              "items.adjustments",
              "discounts",
              "discounts.rule",
              "gift_cards",
              "shipping_methods",
              "billing_address",
              "shipping_address",
              "region",
              "region.tax_rates",
              "region.payment_providers",
              "payment_sessions",
              "customer",
            ],
          },
          { force_taxes: true }
        )

        const { total, region } = cart

        // Helpers that either delete a session locally or remotely. Will be used in multiple places below.
        const deleteSessionAppropriately = async (session) => {
          if (session.is_initiated) {
            return paymentProviderServiceTx.deleteSession(session)
          }

          return psRepo.delete(session)
        }

        // In the case of a cart that has a total <= 0 we can return prematurely.
        // we are deleting the sessions, and we don't need to create or update anything from now on.
        if (total <= 0) {
          await Promise.all(
            cart.payment_sessions.map(async (session) => {
              return deleteSessionAppropriately(session)
            })
          )
          return
        }

        const providerSet = new Set(region.payment_providers.map((p) => p.id))
        const alreadyConsumedProviderIds: Set<string> = new Set()

        const partialSessionInput: Omit<PaymentSessionInput, "provider_id"> = {
          cart: cart as Cart,
          customer: cart.customer,
          amount: total,
          currency_code: cart.region.currency_code,
        }
        const partialPaymentSessionData = {
          cart_id: cartId,
          data: {},
          status: PaymentSessionStatus.PENDING,
          amount: total,
        }

        await Promise.all(
          cart.payment_sessions.map(async (session) => {
            if (!providerSet.has(session.provider_id)) {
              /**
               * if the provider does not belong to the region then delete the session.
               * The deletion occurs locally if the session is not initiated
               * otherwise the deletion will also occur remotely through the external provider.
               */

              return await deleteSessionAppropriately(session)
            }

            /**
             * if the provider belongs to the region then update or delete the session.
             * The update occurs locally if it is not selected
             * otherwise the update will also occur remotely through the external provider.
             */

            // We are saving the provider id on which the work below will be done. That way,
            // when handling the providers from the cart region at a later point below, we do not double the work on the sessions that already
            // exists for the same provider.
            alreadyConsumedProviderIds.add(session.provider_id)

            // Update remotely
            if (session.is_selected && session.is_initiated) {
              const paymentSessionInput = {
                ...partialSessionInput,
                provider_id: session.provider_id,
              }

              return paymentProviderServiceTx.updateSession(
                session,
                paymentSessionInput
              )
            }

            let updatedSession: PaymentSession

            // At this stage the session is not selected. Delete it remotely if there is some
            // external provider data and create the session locally only. Otherwise, update the existing local session.
            if (session.is_initiated) {
              await paymentProviderServiceTx.deleteSession(session)
              updatedSession = psRepo.create({
                ...partialPaymentSessionData,
                is_initiated: false,
                provider_id: session.provider_id,
              })
            } else {
              updatedSession = { ...session, amount: total } as PaymentSession
            }

            return psRepo.save(updatedSession)
          })
        )

        /**
         * From now on, the sessions have been cleanup. We can now
         * - Set the provider session as selected if it is the only one existing and there is no payment session on the cart
         * - Create a session per provider locally if it does not already exists on the cart as per the previous step
         */

        // If only one provider exists and there is no session on the cart, create the session and select it.
        if (region.payment_providers.length === 1 && !cart.payment_session) {
          const paymentProvider = region.payment_providers[0]

          const paymentSessionInput = {
            ...partialSessionInput,
            provider_id: paymentProvider.id,
          }

          const paymentSession = await this.paymentProviderService_
            .withTransaction(transactionManager)
            .createSession(paymentSessionInput)

          await psRepo.update(paymentSession.id, {
            is_selected: true,
            is_initiated: true,
          })
          return
        }

        await Promise.all(
          region.payment_providers.map(async (paymentProvider) => {
            if (alreadyConsumedProviderIds.has(paymentProvider.id)) {
              return
            }

            const paymentSession = psRepo.create({
              ...partialPaymentSessionData,
              provider_id: paymentProvider.id,
            })
            return psRepo.save(paymentSession)
          })
        )
      }
    )
  }

  /**
   * Removes a payment session from the cart.
   * @param cartId - the id of the cart to remove from
   * @param providerId - the id of the provider whoose payment session
   *    should be removed.
   * @return the resulting cart.
   */
  async deletePaymentSession(
    cartId: string,
    providerId: string
  ): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: ["payment_sessions"],
        })

        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )

        if (cart.payment_sessions) {
          const paymentSession = cart.payment_sessions.find(
            ({ provider_id }) => provider_id === providerId
          )

          cart.payment_sessions = cart.payment_sessions.filter(
            ({ provider_id }) => provider_id !== providerId
          )

          const psRepo = transactionManager.getCustomRepository(
            this.paymentSessionRepository_
          )

          if (paymentSession) {
            if (paymentSession.is_selected || paymentSession.is_initiated) {
              await this.paymentProviderService_
                .withTransaction(transactionManager)
                .deleteSession(paymentSession)
            } else {
              await psRepo.delete(paymentSession)
            }
          }
        }

        await cartRepo.save(cart)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, { id: cart.id })
      }
    )
  }

  /**
   * Refreshes a payment session on a cart
   * @param cartId - the id of the cart to remove from
   * @param providerId - the id of the provider whoose payment session
   *    should be removed.
   * @return {Promise<void>} the resulting cart.
   */
  async refreshPaymentSession(
    cartId: string,
    providerId: string
  ): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieveWithTotals(cartId, {
          relations: ["payment_sessions"],
        })

        if (cart.payment_sessions) {
          const paymentSession = cart.payment_sessions.find(
            ({ provider_id }) => provider_id === providerId
          )

          if (paymentSession) {
            if (paymentSession.is_selected) {
              await this.paymentProviderService_
                .withTransaction(transactionManager)
                .refreshSession(paymentSession, {
                  cart: cart as Cart,
                  customer: cart.customer,
                  amount: cart.total,
                  currency_code: cart.region.currency_code,
                  provider_id: providerId,
                })
            } else {
              const psRepo = transactionManager.getCustomRepository(
                this.paymentSessionRepository_
              )
              await psRepo.update(paymentSession.id, {
                amount: cart.total,
              })
            }
          }
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, { id: cartId })
      }
    )
  }

  /**
   * Adds the shipping method to the list of shipping methods associated with
   * the cart. Shipping Methods are the ways that an order is shipped, whereas a
   * Shipping Option is a possible way to ship an order. Shipping Methods may
   * also have additional details in the data field such as an id for a package
   * shop.
   * @param cartId - the id of the cart to add shipping method to
   * @param optionId - id of shipping option to add as valid method
   * @param data - the fulmillment data for the method
   * @return the result of the update operation
   */
  async addShippingMethod(
    cartId: string,
    optionId: string,
    data: Record<string, unknown> = {}
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieveWithTotals(cartId, {
          relations: [
            "shipping_methods",
            "shipping_methods.shipping_option",
            "items",
            "items.variant",
            "items.variant.product",
          ],
        })

        const cartCustomShippingOptions =
          await this.customShippingOptionService_
            .withTransaction(transactionManager)
            .list({ cart_id: cart.id })

        const customShippingOption = this.findCustomShippingOption(
          cartCustomShippingOptions,
          optionId
        )

        const { shipping_methods } = cart

        /**
         * If we have a custom shipping option configured we want the price
         * override to take effect and do not want `validateCartOption` to check
         * if requirements are met, hence we are not passing the entire cart, but
         * just the id.
         */
        const shippingMethodConfig = customShippingOption
          ? { cart_id: cart.id, price: customShippingOption.price }
          : { cart }

        const newShippingMethod = await this.shippingOptionService_
          .withTransaction(transactionManager)
          .createShippingMethod(optionId, data, shippingMethodConfig)

        const methods = [newShippingMethod]
        if (shipping_methods?.length) {
          const shippingOptionServiceTx =
            this.shippingOptionService_.withTransaction(transactionManager)

          for (const shippingMethod of shipping_methods) {
            if (
              shippingMethod.shipping_option.profile_id ===
              newShippingMethod.shipping_option.profile_id
            ) {
              await shippingOptionServiceTx.deleteShippingMethods(
                shippingMethod
              )
            } else {
              methods.push(shippingMethod)
            }
          }
        }

        if (cart.items?.length) {
          const lineItemServiceTx =
            this.lineItemService_.withTransaction(transactionManager)

          await Promise.all(
            cart.items.map(async (item) => {
              return lineItemServiceTx.update(item.id, {
                has_shipping: this.validateLineItemShipping_(methods, item),
              })
            })
          )
        }

        const updatedCart = await this.retrieve(cartId, {
          relations: ["discounts", "discounts.rule", "shipping_methods"],
        })

        // if cart has freeshipping, adjust price
        if (
          updatedCart.discounts.some(
            ({ rule }) => rule.type === DiscountRuleType.FREE_SHIPPING
          )
        ) {
          await this.adjustFreeShipping_(updatedCart, true)
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
      },
      "SERIALIZABLE"
    )
  }

  /**
   * Finds the cart's custom shipping options based on the passed option id.
   * throws if custom options is not empty and no shipping option corresponds to optionId
   * @param cartCustomShippingOptions - the cart's custom shipping options
   * @param optionId - id of the normal or custom shipping option to find in the cartCustomShippingOptions
   * @return custom shipping option
   */
  findCustomShippingOption(
    cartCustomShippingOptions: CustomShippingOption[],
    optionId: string
  ): CustomShippingOption | undefined {
    const customOption = cartCustomShippingOptions?.find(
      (cso) => cso.shipping_option_id === optionId
    )
    const hasCustomOptions = cartCustomShippingOptions?.length

    if (hasCustomOptions && !customOption) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "Wrong shipping option"
      )
    }

    return customOption
  }

  protected async updateUnitPrices_(
    cart: Cart,
    regionId?: string,
    customer_id?: string
  ): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    // If the cart contains items, we update the price of the items
    // to match the updated region or customer id (keeping the old
    // value if it exists)
    if (cart.items?.length) {
      const region = await this.regionService_
        .withTransaction(this.transactionManager_)
        .retrieve(regionId || cart.region_id, {
          relations: ["countries"],
        })

      const lineItemServiceTx =
        this.lineItemService_.withTransaction(transactionManager)

      cart.items = (
        await Promise.all(
          cart.items.map(async (item) => {
            if (!item.variant_id) {
              return item
            }

            const availablePrice = await this.priceSelectionStrategy_
              .withTransaction(transactionManager)
              .calculateVariantPrice(item.variant_id, {
                region_id: region.id,
                currency_code: region.currency_code,
                quantity: item.quantity,
                customer_id: customer_id || cart.customer_id,
                include_discount_prices: true,
              })
              .catch(() => undefined)

            if (
              availablePrice !== undefined &&
              availablePrice.calculatedPrice !== null
            ) {
              return await lineItemServiceTx.update(item.id, {
                has_shipping: false,
                unit_price: availablePrice.calculatedPrice,
              })
            }

            return await lineItemServiceTx.delete(item.id)
          })
        )
      )
        .flat()
        .filter((item): item is LineItem => !!item)
    }
  }

  /**
   * Set's the region of a cart.
   * @param cart - the cart to set region on
   * @param regionId - the id of the region to set the region to
   * @param countryCode - the country code to set the country to
   * @return the result of the update operation
   */
  protected async setRegion_(
    cart: Cart,
    regionId: string,
    countryCode: string | null
  ): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    if (cart.completed_at || cart.payment_authorized_at) {
      throw new MedusaError(
        MedusaError.Types.NOT_ALLOWED,
        "Cannot change the region of a completed cart"
      )
    }

    const region = await this.regionService_
      .withTransaction(transactionManager)
      .retrieve(regionId, {
        relations: ["countries"],
      })
    cart.region = region
    cart.region_id = region.id

    const addrRepo = transactionManager.getCustomRepository(
      this.addressRepository_
    )
    /*
     * When changing the region you are changing the set of countries that your
     * cart can be shipped to so we need to make sure that the current shipping
     * address adheres to the new country set.
     *
     * First check if there is an existing shipping address on the cart if so
     * fetch the entire thing so we can modify the shipping country
     */
    let shippingAddress: Partial<Address> = {}
    if (cart.shipping_address_id) {
      shippingAddress = (await addrRepo.findOne({
        where: { id: cart.shipping_address_id },
      })) as Address
    }

    /*
     * If the client has specified which country code we are updating to check
     * that that country is in fact in the country and perform the update.
     */
    if (countryCode !== null) {
      if (
        !region.countries.find(
          ({ iso_2 }) => iso_2 === countryCode.toLowerCase()
        )
      ) {
        throw new MedusaError(
          MedusaError.Types.NOT_ALLOWED,
          `Country not available in region`
        )
      }

      const updated = addrRepo.create({
        ...shippingAddress,
        country_code: countryCode.toLowerCase(),
      })

      await addrRepo.save(updated)
      await this.updateShippingAddress_(cart, updated, addrRepo)
    } else {
      /*
       * In the case where the country code is not specified we need to check
       *
       *   1. if the region we are switching to has only one country preselect
       *      that
       *   2. if the region has multiple countries we need to unset the country
       *      and wait for client to decide which country to use
       */

      let updated = { ...shippingAddress }

      // If the country code of a shipping address is set we need to clear it
      if (!isEmpty(shippingAddress) && shippingAddress.country_code) {
        updated = {
          ...updated,
          country_code: null,
        }
      }

      // If there is only one country in the region preset it
      if (region.countries.length === 1) {
        updated = {
          ...updated,
          country_code: region.countries[0].iso_2,
        }
      }

      await this.updateShippingAddress_(cart, updated, addrRepo)
    }

    // Shipping methods are determined by region so the user needs to find a
    // new shipping method
    if (cart.shipping_methods && cart.shipping_methods.length) {
      await this.shippingOptionService_
        .withTransaction(transactionManager)
        .deleteShippingMethods(cart.shipping_methods)
    }

    if (cart.discounts && cart.discounts.length) {
      cart.discounts = cart.discounts.filter((discount) => {
        return discount.regions.find(({ id }) => id === regionId)
      })
    }

    if (cart?.items?.length) {
      // line item adjustments should be refreshed on region change after having filtered out inapplicable discounts
      await this.refreshAdjustments_(cart)
    }

    cart.gift_cards = []

    if (cart.payment_sessions && cart.payment_sessions.length) {
      const paymentSessionRepo = transactionManager.getCustomRepository(
        this.paymentSessionRepository_
      )
      await paymentSessionRepo.delete({
        id: In(
          cart.payment_sessions.map((paymentSession) => paymentSession.id)
        ),
      })
      cart.payment_sessions.length = 0
      cart.payment_session = null
    }
  }

  /**
   * Deletes a cart from the database. Completed carts cannot be deleted.
   * @param cartId - the id of the cart to delete
   * @return the deleted cart or undefined if the cart was not found.
   */
  async delete(cartId: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: [
            "items",
            "discounts",
            "discounts.rule",
            "payment_sessions",
          ],
        })

        if (cart.completed_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Completed carts cannot be deleted"
          )
        }

        if (cart.payment_authorized_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Can't delete a cart with an authorized payment"
          )
        }

        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        return cartRepo.remove(cart)
      }
    )
  }

  /**
   * Dedicated method to set metadata for a cart.
   * To ensure that plugins does not overwrite each
   * others metadata fields, setMetadata is provided.
   * @param cartId - the cart to apply metadata to.
   * @param key - key for metadata field
   * @param value - value for metadata field.
   * @return resolves to the updated result.
   */
  async setMetadata(
    cartId: string,
    key: string,
    value: string | number
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )

        if (typeof key !== "string") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Key type is invalid. Metadata keys must be strings"
          )
        }

        const cart = await cartRepo.findOne(cartId)
        if (!cart) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            "Unable to find the cart with the given id"
          )
        }

        const existing = cart.metadata || {}
        cart.metadata = {
          ...existing,
          [key]: value,
        }

        const updatedCart = await cartRepo.save(cart)
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)

        return updatedCart
      }
    )
  }

  async createTaxLines(cartOrId: string | Cart): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = isCart(cartOrId)
          ? cartOrId
          : await this.retrieve(cartOrId, {
              relations: [
                "customer",
                "discounts",
                "discounts.rule",
                "gift_cards",
                "items",
                "items.adjustments",
                "region",
                "region.tax_rates",
                "shipping_address",
                "shipping_methods",
              ],
            })

        const calculationContext = await this.totalsService_
          .withTransaction(transactionManager)
          .getCalculationContext(cart)

        await this.taxProviderService_
          .withTransaction(transactionManager)
          .createTaxLines(cart, calculationContext)
      }
    )
  }

  async deleteTaxLines(id: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(id, {
          relations: [
            "items",
            "items.tax_lines",
            "shipping_methods",
            "shipping_methods.tax_lines",
          ],
        })
        await transactionManager.remove(cart.items.flatMap((i) => i.tax_lines))
        await transactionManager.remove(
          cart.shipping_methods.flatMap((s) => s.tax_lines)
        )
      }
    )
  }

  async decorateTotals(
    cart: Cart,
    totalsConfig: TotalsConfig = {}
  ): Promise<WithRequiredProperty<Cart, "total">> {
    const manager = this.transactionManager_ ?? this.manager_
    const newTotalsServiceTx = this.newTotalsService_.withTransaction(manager)

    const calculationContext = await this.totalsService_.getCalculationContext(
      cart
    )
    const includeTax = totalsConfig?.force_taxes || cart.region?.automatic_taxes
    const cartItems = [...(cart.items ?? [])]
    const cartShippingMethods = [...(cart.shipping_methods ?? [])]

    if (includeTax) {
      const taxLinesMaps = await this.taxProviderService_
        .withTransaction(manager)
        .getTaxLinesMap(cartItems, calculationContext)

      cartItems.forEach((item) => {
        if (item.is_return) {
          return
        }
        item.tax_lines = taxLinesMaps.lineItemsTaxLines[item.id] ?? []
      })
      cartShippingMethods.forEach((method) => {
        method.tax_lines = taxLinesMaps.shippingMethodsTaxLines[method.id] ?? []
      })
    }

    const itemsTotals = await newTotalsServiceTx.getLineItemTotals(cartItems, {
      includeTax,
      calculationContext,
    })
    const shippingTotals = await newTotalsServiceTx.getShippingMethodTotals(
      cartShippingMethods,
      {
        discounts: cart.discounts,
        includeTax,
        calculationContext,
      }
    )

    cart.subtotal = 0
    cart.discount_total = 0
    cart.item_tax_total = 0
    cart.shipping_total = 0
    cart.shipping_tax_total = 0

    cart.items = (cart.items || []).map((item) => {
      const itemWithTotals = Object.assign(item, itemsTotals[item.id] ?? {})

      cart.subtotal! += itemWithTotals.subtotal ?? 0
      cart.discount_total! += itemWithTotals.discount_total ?? 0
      cart.item_tax_total! += itemWithTotals.tax_total ?? 0

      return itemWithTotals
    })

    cart.shipping_methods = (cart.shipping_methods || []).map(
      (shippingMethod) => {
        const methodWithTotals = Object.assign(
          shippingMethod,
          shippingTotals[shippingMethod.id] ?? {}
        )

        cart.shipping_total! += methodWithTotals.subtotal ?? 0
        cart.shipping_tax_total! += methodWithTotals.tax_total ?? 0

        return methodWithTotals
      }
    )

    const giftCardTotal = await this.newTotalsService_.getGiftCardTotals(
      cart.subtotal - cart.discount_total,
      {
        region: cart.region,
        giftCards: cart.gift_cards,
      }
    )
    cart.gift_card_total = giftCardTotal.total || 0
    cart.gift_card_tax_total = giftCardTotal.tax_total || 0

    cart.tax_total = cart.item_tax_total + cart.shipping_tax_total

    cart.total =
      cart.subtotal +
      cart.shipping_total +
      cart.tax_total -
      (cart.gift_card_total + cart.discount_total + cart.gift_card_tax_total)

    return cart as Cart & { total: number }
  }

  protected async refreshAdjustments_(cart: Cart): Promise<void> {
    const transactionManager = this.transactionManager_ ?? this.manager_

    const nonReturnLineIDs = cart.items
      .filter((item) => !item.is_return)
      .map((i) => i.id)

    // delete all old non return line item adjustments
    await this.lineItemAdjustmentService_
      .withTransaction(transactionManager)
      .delete({
        item_id: nonReturnLineIDs,
        discount_id: Not(IsNull()),
      })

    // potentially create/update line item adjustments
    await this.lineItemAdjustmentService_
      .withTransaction(transactionManager)
      .createAdjustments(cart)
  }

  protected transformQueryForTotals_(
    config: FindConfig<Cart>
  ): FindConfig<Cart> & { totalsToSelect: TotalField[] } {
    let { select, relations } = config

    if (!select) {
      return {
        select,
        relations,
        totalsToSelect: [],
      }
    }

    const totalFields = [
      "subtotal",
      "tax_total",
      "shipping_total",
      "discount_total",
      "gift_card_total",
      "total",
    ]

    const totalsToSelect = select.filter((v) =>
      totalFields.includes(v)
    ) as TotalField[]
    if (totalsToSelect.length > 0) {
      const relationSet = new Set(relations)
      relationSet.add("items")
      relationSet.add("items.tax_lines")
      relationSet.add("gift_cards")
      relationSet.add("discounts")
      relationSet.add("discounts.rule")
      // relationSet.add("discounts.parent_discount")
      // relationSet.add("discounts.parent_discount.rule")
      // relationSet.add("discounts.parent_discount.regions")
      relationSet.add("shipping_methods")
      relationSet.add("shipping_address")
      relationSet.add("region")
      relationSet.add("region.tax_rates")
      relations = Array.from(relationSet.values())

      select = select.filter((v) => !totalFields.includes(v))
    }

    return {
      relations,
      select,
      totalsToSelect,
    }
  }

  /**
   * @deprecated Use decorateTotals instead
   * @param cart
   * @param totalsToSelect
   * @param options
   * @protected
   */
  protected async decorateTotals_(
    cart: Cart,
    totalsToSelect: TotalField[],
    options: TotalsConfig = { force_taxes: false }
  ): Promise<Cart> {
    const totals: { [K in TotalField]?: number | null } = {}

    for (const key of totalsToSelect) {
      switch (key) {
        case "total": {
          totals.total = await this.totalsService_.getTotal(cart, {
            force_taxes: options.force_taxes,
          })
          break
        }
        case "shipping_total": {
          totals.shipping_total = await this.totalsService_.getShippingTotal(
            cart
          )
          break
        }
        case "discount_total":
          totals.discount_total = await this.totalsService_.getDiscountTotal(
            cart
          )
          break
        case "tax_total":
          totals.tax_total = await this.totalsService_.getTaxTotal(
            cart,
            options.force_taxes
          )
          break
        case "gift_card_total": {
          const giftCardBreakdown = await this.totalsService_.getGiftCardTotal(
            cart
          )
          totals.gift_card_total = giftCardBreakdown.total
          totals.gift_card_tax_total = giftCardBreakdown.tax_total
          break
        }
        case "subtotal":
          totals.subtotal = await this.totalsService_.getSubtotal(cart)
          break
        default:
          break
      }
    }

    return Object.assign(cart, totals)
  }

  private getTotalsRelations(config: FindConfig<Cart>): string[] {
    const relationSet = new Set(config.relations)

    relationSet.add("items")
    relationSet.add("items.tax_lines")
    relationSet.add("items.adjustments")
    relationSet.add("gift_cards")
    relationSet.add("discounts")
    relationSet.add("discounts.rule")
    relationSet.add("shipping_methods")
    relationSet.add("shipping_methods.tax_lines")
    relationSet.add("shipping_address")
    relationSet.add("region")
    relationSet.add("region.tax_rates")

    return Array.from(relationSet.values())
  }
}

export default CartService
