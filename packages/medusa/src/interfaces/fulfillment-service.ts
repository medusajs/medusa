import { MedusaContainer } from "@medusajs/types"
import { Cart, Fulfillment, LineItem, Order } from "../models"
import { CreateReturnType } from "../types/fulfillment-provider"

export interface FulfillmentService {
  /**
   * Return a unique identifier to retrieve the fulfillment plugin provider
   */
  getIdentifier(): string

  /**
   * Called before a shipping option is created in Admin. The method should
   * return all of the options that the fulfillment provider can be used with,
   * and it is here the distinction between different shipping options are
   * enforced. For example, a fulfillment provider may offer Standard Shipping
   * and Express Shipping as fulfillment options, it is up to the store operator
   * to create shipping options in Medusa that can be chosen between by the
   * customer.
   */
  getFulfillmentOptions(): Promise<any[]>

  /**
   * Called before a shipping method is set on a cart to ensure that the data
   * sent with the shipping method is valid. The data object may contain extra
   * data about the shipment such as an id of a drop point. It is up to the
   * fulfillment provider to enforce that the correct data is being sent
   * through.
   * @param {object} optionData - the data to validate
   * @param {object} data - the data to validate
   * @param {object | undefined} cart - the cart to which the shipping method will be applied
   * @return {object} the data to populate `cart.shipping_methods.$.data` this
   *    is usually important for future actions like generating shipping labels
   */
  validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<Record<string, unknown>>

  /**
   * Called before a shipping option is created in Admin. Use this to ensure
   * that a fulfillment option does in fact exist.
   */
  validateOption(data: Record<string, unknown>): Promise<boolean>

  canCalculate(data): Promise<boolean>

  /**
   * Used to calculate a price for a given shipping option.
   */
  calculatePrice(optionData, data, cart): Promise<number>

  createFulfillment(
    data: Record<string, unknown>,
    items: LineItem,
    order: Order,
    fulfillment: Omit<Fulfillment, "beforeInsert">
  )

  cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any>

  /**
   * Used to retrieve documents associated with a fulfillment.
   * Will default to returning no documents.
   */
  getFulfillmentDocuments(data: Record<string, unknown>): Promise<any>

  /**
   * Used to create a return order. Should return the data necessary for future
   * operations on the return; in particular the data may be used to receive
   * documents attached to the return.
   */
  createReturn(returnOrder: CreateReturnType): Promise<Record<string, unknown>>

  /**
   * Used to retrieve documents related to a return order.
   */
  getReturnDocuments(data: Record<string, unknown>): Promise<any>

  /**
   * Used to retrieve documents related to a shipment.
   */
  getShipmentDocuments(data: Record<string, unknown>): Promise<any>

  retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any>
}

/**
 * The interface that all fulfillment services must inherit from. The intercace
 * provides the necessary methods for creating, authorizing and managing
 * fulfillment orders.
 * @interface
 */
export abstract class AbstractFulfillmentService implements FulfillmentService {
  protected constructor(
    protected readonly container: MedusaContainer,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}

  public static identifier: string

  public getIdentifier(): string {
    const ctr = this.constructor as typeof AbstractFulfillmentService

    if (!ctr.identifier) {
      throw new Error(`Missing static property "identifier".`)
    }

    return ctr.identifier
  }

  abstract getFulfillmentOptions(): Promise<any[]>

  abstract validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    cart: Cart
  ): Promise<Record<string, unknown>>

  abstract validateOption(data: Record<string, unknown>): Promise<boolean>

  abstract canCalculate(data): Promise<boolean>

  /**
   * Used to calculate a price for a given shipping option.
   */
  abstract calculatePrice(optionData, data, cart): Promise<number>

  abstract createFulfillment(
    data: Record<string, unknown>,
    items: LineItem,
    order: Order,
    fulfillment: Omit<Fulfillment, "beforeInsert">
  )

  abstract cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any>

  abstract getFulfillmentDocuments(data: Record<string, unknown>): Promise<any>

  abstract createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>>

  abstract getReturnDocuments(data: Record<string, unknown>): Promise<any>

  abstract getShipmentDocuments(data: Record<string, unknown>): Promise<any>

  abstract retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any>
}

export default AbstractFulfillmentService
