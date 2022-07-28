import { isEmpty, isEqual } from "lodash"
import { MedusaError, Validator } from "medusa-core-utils"
import { DeepPartial, EntityManager, In } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import { IPriceSelectionStrategy } from "../interfaces/price-selection-strategy"
import {
  DiscountRuleType,
  Address,
  Cart,
  CustomShippingOption,
  Customer,
  Discount,
  LineItem,
  ShippingMethod,
  SalesChannel,
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
  LineItemUpdate,
} from "../types/cart"
import { AddressPayload, FindConfig, TotalField } from "../types/common"
import { buildQuery, setMetadata, validateId } from "../utils"
import CustomShippingOptionService from "./custom-shipping-option"
import CustomerService from "./customer"
import DiscountService from "./discount"
import EventBusService from "./event-bus"
import GiftCardService from "./gift-card"
import InventoryService from "./inventory"
import LineItemService from "./line-item"
import LineItemAdjustmentService from "./line-item-adjustment"
import PaymentProviderService from "./payment-provider"
import ProductService from "./product"
import ProductVariantService from "./product-variant"
import RegionService from "./region"
import ShippingOptionService from "./shipping-option"
import TaxProviderService from "./tax-provider"
import TotalsService from "./totals"
import SalesChannelFeatureFlag from "../loaders/feature-flags/sales-channels"
import { FlagRouter } from "../utils/flag-router"
import StoreService from "./store"
import { SalesChannelService } from "./index"

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
  inventoryService: InventoryService
  customShippingOptionService: CustomShippingOptionService
  lineItemAdjustmentService: LineItemAdjustmentService
  priceSelectionStrategy: IPriceSelectionStrategy
}

type TotalsConfig = {
  force_taxes?: boolean
}

/* Provides layer to manipulate carts.
 * @implements BaseService
 */
class CartService extends TransactionBaseService<CartService> {
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
  protected readonly inventoryService_: InventoryService
  protected readonly customShippingOptionService_: CustomShippingOptionService
  protected readonly priceSelectionStrategy_: IPriceSelectionStrategy
  protected readonly lineItemAdjustmentService_: LineItemAdjustmentService
  protected readonly featureFlagRouter_: FlagRouter

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
    addressRepository,
    paymentSessionRepository,
    inventoryService,
    customShippingOptionService,
    lineItemAdjustmentService,
    priceSelectionStrategy,
    salesChannelService,
    featureFlagRouter,
    storeService,
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
    this.addressRepository_ = addressRepository
    this.paymentSessionRepository_ = paymentSessionRepository
    this.inventoryService_ = inventoryService
    this.customShippingOptionService_ = customShippingOptionService
    this.taxProviderService_ = taxProviderService
    this.lineItemAdjustmentService_ = lineItemAdjustmentService
    this.priceSelectionStrategy_ = priceSelectionStrategy
    this.salesChannelService_ = salesChannelService
    this.featureFlagRouter_ = featureFlagRouter
    this.storeService_ = storeService
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
          totals.shipping_total = this.totalsService_.getShippingTotal(cart)
          break
        }
        case "discount_total":
          totals.discount_total = this.totalsService_.getDiscountTotal(cart)
          break
        case "tax_total":
          totals.tax_total = await this.totalsService_.getTaxTotal(
            cart,
            options.force_taxes
          )
          break
        case "gift_card_total": {
          const giftCardBreakdown = this.totalsService_.getGiftCardTotal(cart)
          totals.gift_card_total = giftCardBreakdown.total
          totals.gift_card_tax_total = giftCardBreakdown.tax_total
          break
        }
        case "subtotal":
          totals.subtotal = this.totalsService_.getSubtotal(cart)
          break
        default:
          break
      }
    }

    return Object.assign(cart, totals)
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
   * @param totalsConfig - configuration for retrieval of totals
   * @return the cart document.
   */
  async retrieve(
    cartId: string,
    options: FindConfig<Cart> = {},
    totalsConfig: TotalsConfig = {}
  ): Promise<Cart> {
    const manager = this.manager_
    const cartRepo = manager.getCustomRepository(this.cartRepository_)
    const validatedId = validateId(cartId)

    const { select, relations, totalsToSelect } =
      this.transformQueryForTotals_(options)

    const query = buildQuery(
      { id: validatedId },
      { ...options, select, relations }
    )

    if (relations && relations.length > 0) {
      query.relations = relations
    }

    if (select && select.length > 0) {
      query.select = select
    } else {
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

    return await this.decorateTotals_(raw, totalsToSelect, totalsConfig)
  }

  /**
   * Creates a cart.
   * @param data - the data to create the cart with
   * @return the result of the create operation
   */
  async create(data: CartCreateProps): Promise<Cart> {
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

        if (data.email) {
          const customer = await this.createOrFetchUserFromEmail_(data.email)
          rawCart.customer = customer
          rawCart.customer_id = customer.id
          rawCart.email = customer.email
        }

        if (!data.region_id) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            `A region_id must be provided when creating a cart`
          )
        }

        rawCart.region_id = data.region_id
        const region = await this.regionService_
          .withTransaction(transactionManager)
          .retrieve(data.region_id, {
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
            if (!regCountries.includes(data.shipping_address.country_code)) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address = data.shipping_address
          }
          if (data.shipping_address_id) {
            const addr = await addressRepo.findOne(data.shipping_address_id)
            if (addr && !regCountries.includes(addr.country_code)) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "Shipping country not in region"
              )
            }
            rawCart.shipping_address_id = data.shipping_address_id
          }
        }

        const remainingFields: (keyof Cart)[] = [
          "billing_address_id",
          "context",
          "type",
          "metadata",
          "discounts",
          "gift_cards",
        ]

        for (const remainingField of remainingFields) {
          if (
            typeof data[remainingField] !== "undefined" &&
            remainingField !== "object"
          ) {
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
    if (typeof salesChannelId !== "undefined") {
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
          relations: ["items", "discounts", "discounts.rule"],
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
   * @param cart - the cart for the line item
   * @param lineItem - the line item being added
   * @return a boolean indicating validation result
   */
  protected async validateLineItem(
    cart: Cart,
    lineItem: LineItem
  ): Promise<boolean> {
    if (!cart.sales_channel_id) {
      return true
    }

    const lineItemVariant = await this.productVariantService_
      .withTransaction(this.manager_)
      .retrieve(lineItem.variant_id)

    return !!(
      await this.productService_
        .withTransaction(this.manager_)
        .filterProductsBySalesChannel(
          [lineItemVariant.product_id],
          cart.sales_channel_id
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
   */
  async addLineItem(
    cartId: string,
    lineItem: LineItem,
    config = { validateSalesChannels: true }
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: [
            "shipping_methods",
            "items",
            "items.adjustments",
            "payment_sessions",
            "items.variant",
            "items.variant.product",
            "discounts",
            "discounts.rule",
          ],
        })

        if (this.featureFlagRouter_.isFeatureEnabled("sales_channels")) {
          if (config.validateSalesChannels) {
            if (!(await this.validateLineItem(cart, lineItem))) {
              throw new MedusaError(
                MedusaError.Types.INVALID_DATA,
                `The product "${lineItem.title}" must belongs to the sales channel on which the cart has been created.`
              )
            }
          }
        }

        let currentItem: LineItem | undefined
        if (lineItem.should_merge) {
          currentItem = cart.items.find((item) => {
            if (item.should_merge && item.variant_id === lineItem.variant_id) {
              return isEqual(item.metadata, lineItem.metadata)
            }
            return false
          })
        }

        // If content matches one of the line items currently in the cart we can
        // simply update the quantity of the existing line item
        const quantity = currentItem
          ? (currentItem.quantity += lineItem.quantity)
          : lineItem.quantity

        // Confirm inventory or throw error
        await this.inventoryService_
          .withTransaction(transactionManager)
          .confirmInventory(lineItem.variant_id, quantity)

        if (currentItem) {
          await this.lineItemService_
            .withTransaction(transactionManager)
            .update(currentItem.id, {
              quantity: currentItem.quantity,
            })
        } else {
          await this.lineItemService_
            .withTransaction(transactionManager)
            .create({
              ...lineItem,
              has_shipping: false,
              cart_id: cartId,
            })
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

        const result = await this.retrieve(cartId, {
          relations: ["items", "discounts", "discounts.rule"],
        })

        await this.refreshAdjustments_(result)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, result)

        return result
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
        const cart = await this.retrieve(cartId, {
          relations: ["items", "items.adjustments", "payment_sessions"],
        })

        // Ensure that the line item exists in the cart
        const lineItemExists = cart.items.find((i) => i.id === lineItemId)
        if (!lineItemExists) {
          throw new MedusaError(
            MedusaError.Types.INVALID_DATA,
            "A line item with the provided id doesn't exist in the cart"
          )
        }

        if (lineItemUpdate.quantity) {
          const hasInventory = await this.inventoryService_
            .withTransaction(transactionManager)
            .confirmInventory(
              lineItemExists.variant_id,
              lineItemUpdate.quantity
            )

          if (!hasInventory) {
            throw new MedusaError(
              MedusaError.Types.NOT_ALLOWED,
              "Inventory doesn't cover the desired quantity"
            )
          }
        }

        await this.lineItemService_
          .withTransaction(transactionManager)
          .update(lineItemId, lineItemUpdate)

        const updatedCart = await this.retrieve(cartId, {
          relations: ["items", "discounts", "discounts.rule"],
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
          select: [
            "subtotal",
            "tax_total",
            "shipping_total",
            "discount_total",
            "total",
          ],
          relations,
        })

        if (data.customer_id) {
          await this.updateCustomerId_(cart, data.customer_id)
        } else {
          if (typeof data.email !== "undefined") {
            const customer = await this.createOrFetchUserFromEmail_(data.email)
            cart.customer = customer
            cart.customer_id = customer.id
            cart.email = customer.email
          }
        }

        if (
          typeof data.customer_id !== "undefined" ||
          typeof data.region_id !== "undefined"
        ) {
          await this.updateUnitPrices_(cart, data.region_id, data.customer_id)
        }

        if (typeof data.region_id !== "undefined") {
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
            typeof data.sales_channel_id !== "undefined" &&
            data.sales_channel_id != cart.sales_channel_id
          ) {
            await this.onSalesChannelChange(cart, data.sales_channel_id)
            cart.sales_channel_id = data.sales_channel_id
          }
        }

        if (typeof data.discounts !== "undefined") {
          const previousDiscounts = [...cart.discounts]
          cart.discounts.length = 0

          await Promise.all(
            data.discounts.map(({ code }) => {
              return this.applyDiscount(cart, code)
            })
          )

          const hasFreeShipping = cart.discounts.some(
            ({ rule }) => rule?.type === "free_shipping"
          )

          // if we previously had a free shipping discount and then removed it,
          // we need to update shipping methods to original price
          if (
            previousDiscounts.some(
              ({ rule }) => rule.type === "free_shipping"
            ) &&
            !hasFreeShipping
          ) {
            await this.adjustFreeShipping_(cart, false)
          }

          if (hasFreeShipping) {
            await this.adjustFreeShipping_(cart, true)
          }
        }

        if ("gift_cards" in data) {
          cart.gift_cards = []

          await Promise.all(
            (data.gift_cards ?? []).map(({ code }) => {
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

        if ("email" in data || "customer_id" in data) {
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
        select: ["id", "sales_channels"],
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
        itemsToRemove.map((item) => {
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
  protected async createOrFetchUserFromEmail_(
    email: string
  ): Promise<Customer> {
    const schema = Validator.string().email().required()
    const { value, error } = schema.validate(email.toLowerCase())
    if (error) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        "The email is not valid"
      )
    }

    let customer = await this.customerService_
      .withTransaction(this.transactionManager_)
      .retrieveByEmail(value)
      .catch(() => undefined)

    if (!customer) {
      customer = await this.customerService_
        .withTransaction(this.transactionManager_)
        .create({ email: value })
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

    address.country_code = address.country_code?.toLowerCase() ?? null

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

    address.country_code = address.country_code?.toLowerCase() ?? null

    if (
      address.country_code &&
      !cart.region.countries.find(({ iso_2 }) => address.country_code === iso_2)
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
   * @return the result of the update operation
   */
  async applyDiscount(cart: Cart, discountCode: string): Promise<void> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const discount = await this.discountService_
          .withTransaction(transactionManager)
          .retrieveByCode(discountCode, { relations: ["rule", "regions"] })

        await this.discountService_
          .withTransaction(transactionManager)
          .validateDiscountForCartOrThrow(cart, discount)

        const rule = discount.rule

        // if discount is already there, we simply resolve
        if (cart.discounts.find(({ id }) => id === discount.id)) {
          return
        }

        const toParse = [...cart.discounts, discount]

        let sawNotShipping = false
        const newDiscounts = toParse.map((discountToParse) => {
          switch (discountToParse.rule?.type) {
            case DiscountRuleType.FREE_SHIPPING:
              if (discountToParse.rule.type === rule.type) {
                return discount
              }
              return discountToParse
            default:
              if (!sawNotShipping) {
                sawNotShipping = true
                if (rule?.type !== "free_shipping") {
                  return discount
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

        // ignore if free shipping
        if (rule?.type !== "free_shipping" && cart?.items) {
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
            "discounts",
            "discounts.rule",
            "payment_sessions",
            "shipping_methods",
          ],
        })

        if (cart.discounts.some(({ rule }) => rule.type === "free_shipping")) {
          await this.adjustFreeShipping_(cart, false)
        }

        cart.discounts = cart.discounts.filter(
          (discount) => discount.code !== discountCode
        )

        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        const updatedCart = await cartRepo.save(cart)

        if (updatedCart.payment_sessions?.length) {
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
  async updatePaymentSession(cartId: string, update: object): Promise<Cart> {
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
    context: Record<string, unknown> = {}
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepository = transactionManager.getCustomRepository(
          this.cartRepository_
        )

        const cart = await this.retrieve(cartId, {
          select: ["total"],
          relations: [
            "items",
            "items.adjustments",
            "region",
            "payment_sessions",
          ],
        })

        if (typeof cart.total === "undefined") {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "cart.total should be defined"
          )
        }

        // If cart total is 0, we don't perform anything payment related
        if (cart.total <= 0) {
          cart.payment_authorized_at = new Date()
          return cartRepository.save(cart)
        }

        if (!cart.payment_session) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "You cannot complete a cart without a payment session."
          )
        }

        const session = await this.paymentProviderService_
          .withTransaction(transactionManager)
          .authorizePayment(cart.payment_session, context)

        const freshCart = await this.retrieve(cart.id, {
          select: ["total"],
          relations: ["payment_sessions", "items", "items.adjustments"],
        })

        if (session.status === "authorized") {
          freshCart.payment = await this.paymentProviderService_
            .withTransaction(transactionManager)
            .createPayment(freshCart)
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
   * Sets a payment method for a cart.
   * @param cartId - the id of the cart to add payment method to
   * @param providerId - the id of the provider to be set to the cart
   * @return result of update operation
   */
  async setPaymentSession(cartId: string, providerId: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const psRepo = transactionManager.getCustomRepository(
          this.paymentSessionRepository_
        )

        const cart = await this.retrieve(cartId, {
          select: [
            "total",
            "subtotal",
            "tax_total",
            "discount_total",
            "gift_card_total",
          ],
          relations: ["region", "region.payment_providers", "payment_sessions"],
        })

        // The region must have the provider id in its providers array
        if (
          providerId !== "system" &&
          !(
            cart.region.payment_providers.length &&
            cart.region.payment_providers.find(({ id }) => providerId === id)
          )
        ) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `The payment method is not available in this region`
          )
        }

        await Promise.all(
          cart.payment_sessions.map(async (paymentSession) => {
            return psRepo.save({ ...paymentSession, is_selected: null })
          })
        )

        const paymentSession = cart.payment_sessions.find(
          (ps) => ps.provider_id === providerId
        )

        if (!paymentSession) {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "Could not find payment session"
          )
        }

        paymentSession.is_selected = true

        await psRepo.save(paymentSession)

        const updatedCart = await this.retrieve(cartId)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
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

        const cartId =
          typeof cartOrCartId === `string` ? cartOrCartId : cartOrCartId.id

        const cart = await this.retrieve(
          cartId,
          {
            select: [
              "total",
              "subtotal",
              "tax_total",
              "discount_total",
              "shipping_total",
              "gift_card_total",
            ],
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

        if (typeof total === "undefined") {
          throw new MedusaError(
            MedusaError.Types.UNEXPECTED_STATE,
            "cart.total must be defined"
          )
        }

        // If there are existing payment sessions ensure that these are up to date
        const seen: string[] = []
        if (cart.payment_sessions?.length) {
          await Promise.all(
            cart.payment_sessions.map(async (paymentSession) => {
              if (
                total <= 0 ||
                !region.payment_providers.find(
                  ({ id }) => id === paymentSession.provider_id
                )
              ) {
                return this.paymentProviderService_
                  .withTransaction(transactionManager)
                  .deleteSession(paymentSession)
              } else {
                seen.push(paymentSession.provider_id)
                return this.paymentProviderService_
                  .withTransaction(transactionManager)
                  .updateSession(paymentSession, cart)
              }
            })
          )
        }

        if (total > 0) {
          // If only one payment session exists, we preselect it
          if (region.payment_providers.length === 1 && !cart.payment_session) {
            const paymentProvider = region.payment_providers[0]
            const paymentSession = await this.paymentProviderService_
              .withTransaction(transactionManager)
              .createSession(paymentProvider.id, cart)

            paymentSession.is_selected = true

            await psRepo.save(paymentSession)
          } else {
            await Promise.all(
              region.payment_providers.map(async (paymentProvider) => {
                if (!seen.includes(paymentProvider.id)) {
                  return this.paymentProviderService_
                    .withTransaction(transactionManager)
                    .createSession(paymentProvider.id, cart)
                }
                return
              })
            )
          }
        }
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
  ): Promise<Cart> {
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

          if (paymentSession) {
            // Delete the session with the provider
            await this.paymentProviderService_
              .withTransaction(transactionManager)
              .deleteSession(paymentSession)
          }
        }

        await cartRepo.save(cart)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, cart)
        return cart
      }
    )
  }

  /**
   * Refreshes a payment session on a cart
   * @param cartId - the id of the cart to remove from
   * @param providerId - the id of the provider whoose payment session
   *    should be removed.
   * @return {Promise<Cart>} the resulting cart.
   */
  async refreshPaymentSession(
    cartId: string,
    providerId: string
  ): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(cartId, {
          relations: ["payment_sessions"],
        })

        if (cart.payment_sessions) {
          const paymentSession = cart.payment_sessions.find(
            ({ provider_id }) => provider_id === providerId
          )

          if (paymentSession) {
            // Delete the session with the provider
            await this.paymentProviderService_
              .withTransaction(transactionManager)
              .refreshSession(paymentSession, cart)
          }
        }

        const updatedCart = await this.retrieve(cartId)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
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
        const cart = await this.retrieve(cartId, {
          select: ["subtotal"],
          relations: [
            "shipping_methods",
            "discounts",
            "discounts.rule",
            "shipping_methods.shipping_option",
            "items",
            "items.variant",
            "payment_sessions",
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
          for (const shippingMethod of shipping_methods) {
            if (
              shippingMethod.shipping_option.profile_id ===
              newShippingMethod.shipping_option.profile_id
            ) {
              await this.shippingOptionService_
                .withTransaction(transactionManager)
                .deleteShippingMethods(shippingMethod)
            } else {
              methods.push(shippingMethod)
            }
          }
        }

        if (cart.items?.length) {
          await Promise.all(
            cart.items.map(async (item) => {
              return this.lineItemService_
                .withTransaction(transactionManager)
                .update(item.id, {
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
            ({ rule }) => rule.type === "free_shipping"
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

      cart.items = (
        await Promise.all(
          cart.items.map(async (item) => {
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
              return this.lineItemService_
                .withTransaction(transactionManager)
                .update(item.id, {
                  has_shipping: false,
                  unit_price: availablePrice.calculatedPrice,
                })
            } else {
              await this.lineItemService_
                .withTransaction(transactionManager)
                .delete(item.id)
              return
            }
          })
        )
      ).filter((item): item is LineItem => !!item)
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

      const updated = {
        ...shippingAddress,
        country_code: countryCode.toLowerCase(),
      }

      await addrRepo.save(updated)
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

        const validatedId = validateId(cartId)
        if (typeof key !== "string") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Key type is invalid. Metadata keys must be strings"
          )
        }

        const cart = await cartRepo.findOne(validatedId)
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
        this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
      }
    )
  }

  async createTaxLines(id: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cart = await this.retrieve(id, {
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

        const calculationContext = this.totalsService_
          .withTransaction(transactionManager)
          .getCalculationContext(cart)

        await this.taxProviderService_
          .withTransaction(transactionManager)
          .createTaxLines(cart, calculationContext)

        return cart
      }
    )
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
      })

    // potentially create/update line item adjustments
    await this.lineItemAdjustmentService_
      .withTransaction(transactionManager)
      .createAdjustments(cart)
  }

  /**
   * Dedicated method to delete metadata for a cart.
   * @param cartId - the cart to delete metadata from.
   * @param key - key for metadata field
   * @return resolves to the updated result.
   */
  async deleteMetadata(cartId: string, key: string): Promise<Cart> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const cartRepo = transactionManager.getCustomRepository(
          this.cartRepository_
        )
        const validatedId = validateId(cartId)

        if (typeof key !== "string") {
          throw new MedusaError(
            MedusaError.Types.INVALID_ARGUMENT,
            "Key type is invalid. Metadata keys must be strings"
          )
        }

        const cart = await cartRepo.findOne(validatedId)
        if (!cart) {
          throw new MedusaError(
            MedusaError.Types.NOT_FOUND,
            `Cart with id: ${validatedId} was not found`
          )
        }

        const updated = cart.metadata || {}
        delete updated[key]
        cart.metadata = updated

        const updatedCart = await cartRepo.save(cart)
        this.eventBus_
          .withTransaction(transactionManager)
          .emit(CartService.Events.UPDATED, updatedCart)
        return updatedCart
      }
    )
  }
}

export default CartService
