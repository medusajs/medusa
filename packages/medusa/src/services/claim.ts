import { isDefined, MedusaError } from "medusa-core-utils"
import { DeepPartial, EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import {
  ClaimFulfillmentStatus,
  ClaimOrder,
  ClaimPaymentStatus,
  ClaimType,
  FulfillmentItem,
  LineItem,
  Order,
  ReturnItem,
} from "../models"
import { AddressRepository } from "../repositories/address"
import { ClaimRepository } from "../repositories/claim"
import { LineItemRepository } from "../repositories/line-item"
import { ShippingMethodRepository } from "../repositories/shipping-method"
import {
  CreateClaimInput,
  CreateClaimItemInput,
  UpdateClaimInput,
} from "../types/claim"
import { FindConfig } from "../types/common"
import { buildQuery, setMetadata } from "../utils"
import ClaimItemService from "./claim-item"
import EventBusService from "./event-bus"
import FulfillmentService from "./fulfillment"
import FulfillmentProviderService from "./fulfillment-provider"
import LineItemService from "./line-item"
import PaymentProviderService from "./payment-provider"
import ProductVariantInventoryService from "./product-variant-inventory"
import RegionService from "./region"
import ReturnService from "./return"
import ShippingOptionService from "./shipping-option"
import TaxProviderService from "./tax-provider"
import TotalsService from "./totals"

type InjectedDependencies = {
  manager: EntityManager
  addressRepository: typeof AddressRepository
  shippingMethodRepository: typeof ShippingMethodRepository
  lineItemRepository: typeof LineItemRepository
  claimRepository: typeof ClaimRepository
  claimItemService: ClaimItemService
  eventBusService: EventBusService
  fulfillmentProviderService: FulfillmentProviderService
  fulfillmentService: FulfillmentService
  productVariantInventoryService: ProductVariantInventoryService
  lineItemService: LineItemService
  paymentProviderService: PaymentProviderService
  regionService: RegionService
  returnService: ReturnService
  shippingOptionService: ShippingOptionService
  taxProviderService: TaxProviderService
  totalsService: TotalsService
}

export default class ClaimService extends TransactionBaseService {
  static readonly Events = {
    CREATED: "claim.created",
    UPDATED: "claim.updated",
    CANCELED: "claim.canceled",
    FULFILLMENT_CREATED: "claim.fulfillment_created",
    SHIPMENT_CREATED: "claim.shipment_created",
    REFUND_PROCESSED: "claim.refund_processed",
  }

  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly addressRepository_: typeof AddressRepository
  protected readonly claimRepository_: typeof ClaimRepository
  protected readonly shippingMethodRepository_: typeof ShippingMethodRepository
  protected readonly lineItemRepository_: typeof LineItemRepository
  protected readonly claimItemService_: ClaimItemService
  protected readonly eventBus_: EventBusService
  protected readonly fulfillmentProviderService_: FulfillmentProviderService
  protected readonly fulfillmentService_: FulfillmentService
  protected readonly lineItemService_: LineItemService
  protected readonly paymentProviderService_: PaymentProviderService
  protected readonly regionService_: RegionService
  protected readonly returnService_: ReturnService
  protected readonly shippingOptionService_: ShippingOptionService
  protected readonly taxProviderService_: TaxProviderService
  protected readonly totalsService_: TotalsService
  // eslint-disable-next-line max-len
  protected readonly productVariantInventoryService_: ProductVariantInventoryService

  constructor({
    manager,
    addressRepository,
    claimRepository,
    shippingMethodRepository,
    lineItemRepository,
    claimItemService,
    eventBusService,
    fulfillmentProviderService,
    fulfillmentService,
    productVariantInventoryService,
    lineItemService,
    paymentProviderService,
    regionService,
    returnService,
    shippingOptionService,
    taxProviderService,
    totalsService,
  }: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0])

    this.manager_ = manager

    this.addressRepository_ = addressRepository
    this.claimRepository_ = claimRepository
    this.shippingMethodRepository_ = shippingMethodRepository
    this.lineItemRepository_ = lineItemRepository
    this.claimItemService_ = claimItemService
    this.eventBus_ = eventBusService
    this.fulfillmentProviderService_ = fulfillmentProviderService
    this.fulfillmentService_ = fulfillmentService
    this.productVariantInventoryService_ = productVariantInventoryService
    this.lineItemService_ = lineItemService
    this.paymentProviderService_ = paymentProviderService
    this.regionService_ = regionService
    this.returnService_ = returnService
    this.shippingOptionService_ = shippingOptionService
    this.taxProviderService_ = taxProviderService
    this.totalsService_ = totalsService
  }

  async update(id: string, data: UpdateClaimInput): Promise<ClaimOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        const claim = await this.retrieve(id, {
          relations: ["shipping_methods"],
        })

        if (claim.canceled_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Canceled claim cannot be updated"
          )
        }

        const { claim_items, shipping_methods, metadata, no_notification } =
          data

        if (metadata) {
          claim.metadata = setMetadata(claim, metadata)
          await claimRepo.save(claim)
        }

        if (shipping_methods) {
          const shippingOptionServiceTx =
            this.shippingOptionService_.withTransaction(transactionManager)

          for (const m of claim.shipping_methods) {
            await shippingOptionServiceTx.updateShippingMethod(m.id, {
              claim_order_id: null,
            })
          }

          for (const method of shipping_methods) {
            if (method.id) {
              await shippingOptionServiceTx.updateShippingMethod(method.id, {
                claim_order_id: claim.id,
              })
            } else {
              await shippingOptionServiceTx.createShippingMethod(
                method.option_id as string,
                method.data ?? {},
                {
                  claim_order_id: claim.id,
                  price: method.price,
                }
              )
            }
          }
        }

        if (no_notification !== undefined) {
          claim.no_notification = no_notification
          await claimRepo.save(claim)
        }

        if (claim_items) {
          const claimItemServiceTx =
            this.claimItemService_.withTransaction(transactionManager)

          for (const i of claim_items) {
            if (i.id) {
              await claimItemServiceTx.update(i.id, i)
            }
          }
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(ClaimService.Events.UPDATED, {
            id: claim.id,
            no_notification: claim.no_notification,
          })

        return claim
      }
    )
  }

  protected async validateCreateClaimInput(
    data: CreateClaimInput
  ): Promise<void> {
    const lineItemServiceTx = this.lineItemService_.withTransaction(
      this.manager_
    )

    const { type, claim_items, additional_items, refund_amount } = data

    if (type !== ClaimType.REFUND && type !== ClaimType.REPLACE) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Claim type must be one of "refund" or "replace".`
      )
    }

    if (type === ClaimType.REPLACE && !additional_items?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Claims with type "replace" must have at least one additional item.`
      )
    }

    if (!claim_items?.length) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Claims must have at least one claim item.`
      )
    }

    if (refund_amount && type !== ClaimType.REFUND) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `Claim has type "${type}" but must be type "refund" to have a refund_amount.`
      )
    }

    const claimLineItems = await lineItemServiceTx.list(
      { id: claim_items.map((c) => c.item_id) },
      { relations: ["order", "swap", "claim_order", "tax_lines"] }
    )

    for (const line of claimLineItems) {
      if (
        line.order?.canceled_at ||
        line.swap?.canceled_at ||
        line.claim_order?.canceled_at
      ) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Cannot create a claim on a canceled item.`
        )
      }
    }
  }

  /**
   * Finds claim line items on an order and calculates the refund amount.
   * There are three places too look:
   * - Order items
   * - Swap items
   * - Claim items (from previous claims)
   * Note, it will attempt to return early from each of these places to avoid having to iterate over all items every time.
   * @param order - the order to find claim lines on
   * @param claimItems - the claim items to match against
   * @return the refund amount
   */
  protected async getRefundTotalForClaimLinesOnOrder(
    order: Order,
    claimItems: CreateClaimItemInput[]
  ) {
    const claimLines = claimItems
      .map((ci) => {
        const predicate = (it: LineItem) =>
          it.shipped_quantity! > 0 &&
          ci.quantity <= it.shipped_quantity! &&
          it.id === ci.item_id

        const claimLine = order.items.find(predicate)

        if (claimLine) {
          return { ...claimLine, quantity: ci.quantity }
        }

        if (order.swaps?.length) {
          for (const swap of order.swaps) {
            const claimLine = swap.additional_items.find(predicate)

            if (claimLine) {
              return { ...claimLine, quantity: ci.quantity }
            }
          }
        }

        if (order.claims?.length) {
          for (const claim of order.claims) {
            const claimLine = claim.additional_items.find(predicate)

            if (claimLine) {
              return { ...claimLine, quantity: ci.quantity }
            }
          }
        }

        return null
      })
      .filter(Boolean) as LineItem[]

    const refunds: number[] = []

    for (const item of claimLines) {
      const refund = await this.totalsService_.getLineItemRefund(order, item)
      refunds.push(refund)
    }

    return Math.round(refunds.reduce((acc, next) => acc + next, 0))
  }

  /**
   * Creates a Claim on an Order. Claims consists of items that are claimed and
   * optionally items to be sent as replacement for the claimed items. The
   * shipping address that the new items will be shipped to
   * @param data - the object containing all data required to create a claim
   * @return created claim
   */
  async create(data: CreateClaimInput): Promise<ClaimOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )

        const {
          type,
          claim_items,
          order,
          return_shipping,
          additional_items,
          shipping_methods,
          refund_amount,
          shipping_address,
          shipping_address_id,
          no_notification,
          ...rest
        } = data

        await this.validateCreateClaimInput(data)

        let addressId = shipping_address_id || order.shipping_address_id
        if (shipping_address) {
          const addressRepo = transactionManager.getCustomRepository(
            this.addressRepository_
          )
          const created = addressRepo.create(shipping_address)
          const saved = await addressRepo.save(created)
          addressId = saved.id
        }

        let toRefund = refund_amount
        if (type === ClaimType.REFUND && typeof refund_amount === "undefined") {
          // In case no refund amount is passed, we calculate it based on the claim items on the order
          toRefund = await this.getRefundTotalForClaimLinesOnOrder(
            order,
            claim_items
          )
        }

        const lineItemServiceTx =
          this.lineItemService_.withTransaction(transactionManager)

        let newItems: LineItem[] = []

        if (isDefined(additional_items)) {
          newItems = await Promise.all(
            additional_items.map(async (i) =>
              lineItemServiceTx.generate(
                i.variant_id,
                order.region_id,
                i.quantity
              )
            )
          )

          await Promise.all(
            newItems.map(async (newItem) => {
              if (newItem.variant_id) {
                await this.productVariantInventoryService_.reserveQuantity(
                  newItem.variant_id,
                  newItem.quantity,
                  {
                    lineItemId: newItem.id,
                    salesChannelId: order.sales_channel_id,
                  }
                )
              }
            })
          )
        }

        const evaluatedNoNotification =
          no_notification !== undefined
            ? no_notification
            : order.no_notification

        const created = claimRepo.create({
          shipping_address_id: addressId,
          payment_status: type === ClaimType.REFUND ? "not_refunded" : "na",
          refund_amount: toRefund,
          type,
          additional_items: newItems,
          order_id: order.id,
          no_notification: evaluatedNoNotification,
          ...rest,
        } as DeepPartial<ClaimOrder>)

        const result: ClaimOrder = await claimRepo.save(created)

        if (result.additional_items && result.additional_items.length) {
          const calcContext = await this.totalsService_.getCalculationContext(
            order
          )
          const lineItems = await lineItemServiceTx.list({
            id: result.additional_items.map((i) => i.id),
          })
          await this.taxProviderService_
            .withTransaction(transactionManager)
            .createTaxLines(lineItems, calcContext)
        }

        if (shipping_methods) {
          const shippingOptionServiceTx =
            this.shippingOptionService_.withTransaction(transactionManager)

          for (const method of shipping_methods) {
            if (method.id) {
              await shippingOptionServiceTx.updateShippingMethod(method.id, {
                claim_order_id: result.id,
              })
            } else {
              await shippingOptionServiceTx.createShippingMethod(
                method.option_id as string,
                method.data ?? {},
                {
                  claim_order_id: result.id,
                  price: method.price,
                }
              )
            }
          }
        }

        const claimItemServiceTx =
          this.claimItemService_.withTransaction(transactionManager)

        for (const ci of claim_items) {
          await claimItemServiceTx.create({
            ...ci,
            claim_order_id: result.id,
          })
        }

        if (return_shipping) {
          await this.returnService_.withTransaction(transactionManager).create({
            refund_amount: toRefund,
            order_id: order.id,
            claim_order_id: result.id,
            items: claim_items.map(
              (ci) =>
                ({
                  item_id: ci.item_id,
                  quantity: ci.quantity,
                  metadata: (ci as any).metadata,
                } as ReturnItem)
            ),
            shipping_method: return_shipping,
            no_notification: evaluatedNoNotification,
          })
        }

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(ClaimService.Events.CREATED, {
            id: result.id,
            no_notification: result.no_notification,
          })

        return result
      }
    )
  }

  /**
   * @param id - the object containing all data required to create a claim
   * @param config - config object
   * @param config.metadata - config metadata
   * @param config.no_notification - config no notification
   * @return created claim
   */
  async createFulfillment(
    id: string,
    config: {
      metadata?: Record<string, unknown>
      no_notification?: boolean
    } = {
      metadata: {},
    }
  ): Promise<ClaimOrder> {
    const { metadata, no_notification } = config

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claim = await this.retrieve(id, {
          relations: [
            "additional_items",
            "additional_items.tax_lines",
            "shipping_methods",
            "shipping_methods.tax_lines",
            "shipping_address",
            "order",
            "order.billing_address",
            "order.discounts",
            "order.discounts.rule",
            "order.payments",
          ],
        })

        if (claim.canceled_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Canceled claim cannot be fulfilled"
          )
        }

        const order = claim.order

        if (
          claim.fulfillment_status !== "not_fulfilled" &&
          claim.fulfillment_status !== "canceled"
        ) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "The claim has already been fulfilled."
          )
        }

        if (claim.type !== "replace") {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Claims with the type "${claim.type}" can not be fulfilled.`
          )
        }

        if (!claim.shipping_methods?.length) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Cannot fulfill a claim without a shipping method."
          )
        }

        const evaluatedNoNotification =
          no_notification !== undefined
            ? no_notification
            : claim.no_notification

        const fulfillments = await this.fulfillmentService_
          .withTransaction(transactionManager)
          .createFulfillment(
            {
              ...claim,
              email: order.email,
              payments: order.payments,
              discounts: order.discounts,
              currency_code: order.currency_code,
              tax_rate: order.tax_rate,
              region_id: order.region_id,
              display_id: order.display_id,
              billing_address: order.billing_address,
              items: claim.additional_items,
              shipping_methods: claim.shipping_methods,
              is_claim: true,
              no_notification: evaluatedNoNotification,
            },
            claim.additional_items.map((i) => ({
              item_id: i.id,
              quantity: i.quantity,
            })),
            { claim_order_id: id, metadata }
          )

        let successfullyFulfilledItems: FulfillmentItem[] = []
        for (const fulfillment of fulfillments) {
          successfullyFulfilledItems = successfullyFulfilledItems.concat(
            fulfillment.items
          )
        }

        claim.fulfillment_status = ClaimFulfillmentStatus.FULFILLED

        for (const item of claim.additional_items) {
          const fulfillmentItem = successfullyFulfilledItems.find(
            (successfullyFulfilledItem) => {
              return successfullyFulfilledItem.item_id === item.id
            }
          )

          if (fulfillmentItem) {
            const fulfilledQuantity =
              (item.fulfilled_quantity || 0) + fulfillmentItem.quantity

            // Update the fulfilled quantity
            await this.lineItemService_
              .withTransaction(transactionManager)
              .update(item.id, {
                fulfilled_quantity: fulfilledQuantity,
              })

            if (item.quantity !== fulfilledQuantity) {
              claim.fulfillment_status = ClaimFulfillmentStatus.REQUIRES_ACTION
            }
          } else if (item.quantity !== item.fulfilled_quantity) {
            claim.fulfillment_status = ClaimFulfillmentStatus.REQUIRES_ACTION
          }
        }

        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        const claimOrder = await claimRepo.save(claim)

        const eventsToEmit = fulfillments.map((fulfillment) => ({
          eventName: ClaimService.Events.FULFILLMENT_CREATED,
          data: {
            id: id,
            fulfillment_id: fulfillment.id,
            no_notification: claim.no_notification,
          },
        }))
        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(eventsToEmit)

        return claimOrder
      }
    )
  }

  async cancelFulfillment(fulfillmentId: string): Promise<ClaimOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const canceled = await this.fulfillmentService_
          .withTransaction(transactionManager)
          .cancelFulfillment(fulfillmentId)

        if (!canceled.claim_order_id) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Fufillment not related to a claim`
          )
        }

        const claim = await this.retrieve(canceled.claim_order_id)

        claim.fulfillment_status = ClaimFulfillmentStatus.CANCELED

        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        return claimRepo.save(claim)
      }
    )
  }

  async processRefund(id: string): Promise<ClaimOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claim = await this.retrieve(id, {
          relations: ["order", "order.payments"],
        })

        if (claim.canceled_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Canceled claim cannot be processed"
          )
        }

        if (claim.type !== "refund") {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            `Claim must have type "refund" to create a refund.`
          )
        }

        if (claim.refund_amount) {
          await this.paymentProviderService_
            .withTransaction(transactionManager)
            .refundPayment(claim.order.payments, claim.refund_amount, "claim")
        }

        claim.payment_status = ClaimPaymentStatus.REFUNDED

        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        const claimOrder = await claimRepo.save(claim)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(ClaimService.Events.REFUND_PROCESSED, {
            id,
            no_notification: claimOrder.no_notification,
          })

        return claimOrder
      }
    )
  }

  async createShipment(
    id: string,
    fulfillmentId: string,
    trackingLinks: { tracking_number: string }[] = [],
    config = {
      metadata: {},
      no_notification: undefined,
    }
  ): Promise<ClaimOrder> {
    const { metadata, no_notification } = config

    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claim = await this.retrieve(id, {
          relations: ["additional_items"],
        })

        if (claim.canceled_at) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Canceled claim cannot be fulfilled as shipped"
          )
        }
        const evaluatedNoNotification =
          no_notification !== undefined
            ? no_notification
            : claim.no_notification

        const shipment = await this.fulfillmentService_
          .withTransaction(transactionManager)
          .createShipment(fulfillmentId, trackingLinks, {
            metadata,
            no_notification: evaluatedNoNotification,
          })

        claim.fulfillment_status = ClaimFulfillmentStatus.SHIPPED

        const lineItemServiceTx =
          this.lineItemService_.withTransaction(transactionManager)

        for (const additionalItem of claim.additional_items) {
          const shipped = shipment.items.find(
            (si) => si.item_id === additionalItem.id
          )
          if (shipped) {
            const shippedQty =
              (additionalItem.shipped_quantity || 0) + shipped.quantity
            await lineItemServiceTx.update(additionalItem.id, {
              shipped_quantity: shippedQty,
            })

            if (shippedQty !== additionalItem.quantity) {
              claim.fulfillment_status =
                ClaimFulfillmentStatus.PARTIALLY_SHIPPED
            }
          } else if (
            additionalItem.shipped_quantity !== additionalItem.quantity
          ) {
            claim.fulfillment_status = ClaimFulfillmentStatus.PARTIALLY_SHIPPED
          }
        }

        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        const claimOrder = await claimRepo.save(claim)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(ClaimService.Events.SHIPMENT_CREATED, {
            id,
            fulfillment_id: shipment.id,
            no_notification: evaluatedNoNotification,
          })

        return claimOrder
      }
    )
  }

  async cancel(id: string): Promise<ClaimOrder> {
    return await this.atomicPhase_(
      async (transactionManager: EntityManager) => {
        const claim = await this.retrieve(id, {
          relations: ["return_order", "fulfillments", "order", "order.refunds"],
        })
        if (claim.refund_amount) {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Claim with a refund cannot be canceled"
          )
        }

        if (claim.fulfillments) {
          for (const f of claim.fulfillments) {
            if (!f.canceled_at) {
              throw new MedusaError(
                MedusaError.Types.NOT_ALLOWED,
                "All fulfillments must be canceled before the claim can be canceled"
              )
            }
          }
        }

        if (claim.return_order && claim.return_order.status !== "canceled") {
          throw new MedusaError(
            MedusaError.Types.NOT_ALLOWED,
            "Return must be canceled before the claim can be canceled"
          )
        }

        claim.fulfillment_status = ClaimFulfillmentStatus.CANCELED
        claim.canceled_at = new Date()

        const claimRepo = transactionManager.getCustomRepository(
          this.claimRepository_
        )
        const claimOrder = await claimRepo.save(claim)

        await this.eventBus_
          .withTransaction(transactionManager)
          .emit(ClaimService.Events.CANCELED, {
            id: claimOrder.id,
            no_notification: claimOrder.no_notification,
          })

        return claimOrder
      }
    )
  }

  /**
   * @param selector - the query object for find
   * @param config - the config object containing query settings
   * @return the result of the find operation
   */
  async list(
    selector,
    config: FindConfig<ClaimOrder> = {
      skip: 0,
      take: 50,
      order: { created_at: "DESC" },
    }
  ): Promise<ClaimOrder[]> {
    const manager = this.manager_
    const claimRepo = manager.getCustomRepository(this.claimRepository_)
    const query = buildQuery(selector, config)
    return await claimRepo.find(query)
  }

  /**
   * Gets an order by id.
   * @param claimId - id of the claim order to retrieve
   * @param config - the config object containing query settings
   * @return the order document
   */
  async retrieve(
    claimId: string,
    config: FindConfig<ClaimOrder> = {}
  ): Promise<ClaimOrder> {
    if (!isDefined(claimId)) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `"claimId" must be defined`
      )
    }

    const manager = this.manager_
    const claimRepo = manager.getCustomRepository(this.claimRepository_)

    const query = buildQuery({ id: claimId }, config)
    const claim = await claimRepo.findOne(query)

    if (!claim) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Claim with ${claimId} was not found`
      )
    }

    return claim
  }
}
