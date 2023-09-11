import { MedusaContainer } from "@medusajs/types"
import { Cart, Fulfillment, LineItem, Order } from "../models"
import { CreateReturnType } from "../types/fulfillment-provider"

type FulfillmentProviderData = Record<string, unknown>
type ShippingOptionData = Record<string, unknown>
type ShippingMethodData = Record<string, unknown>

/**
 * Fulfillment Provider interface
 * Fullfillment provider plugin services should extend the AbstractFulfillmentService from this file
 */
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
   * to create shipping options in Medusa that are offered to the customer.
   */
  getFulfillmentOptions(): Promise<any[]>

  /**
   * Called before a shipping method is set on a cart to ensure that the data
   * sent with the shipping method is valid. The data object may contain extra
   * data about the shipment such as an id of a drop point. It is up to the
   * fulfillment provider to enforce that the correct data is being sent
   * through.
   * @return the data to populate `cart.shipping_methods.$.data` this
   *    is usually important for future actions like generating shipping labels
   */
  validateFulfillmentData(
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<Record<string, unknown>>

  /**
   * Called before a shipping option is created in Admin. Use this to ensure
   * that a fulfillment option does in fact exist.
   */
  validateOption(data: ShippingOptionData): Promise<boolean>

  /**
   * Used to determine if a shipping option can have a calculated price
   */
  canCalculate(data: ShippingOptionData): Promise<boolean>

  /**
   * Used to calculate a price for a given shipping option.
   */
  calculatePrice(
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<number>

  /**
   * Create a fulfillment using data from shipping method, line items, and fulfillment. All from the order.
   * The returned value of this method will populate the `fulfillment.data` field.
   */
  createFulfillment(
    data: ShippingMethodData,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<FulfillmentProviderData>

  /**
   * Cancel a fulfillment using data from the fulfillment
   */
  cancelFulfillment(fulfillmentData: FulfillmentProviderData): Promise<any>

  /**
   * Used to create a return order. Should return the data necessary for future
   * operations on the return; in particular the data may be used to receive
   * documents attached to the return.
   */
  createReturn(returnOrder: CreateReturnType): Promise<Record<string, unknown>>

  /**
   * Used to retrieve documents associated with a fulfillment.
   */
  getFulfillmentDocuments(data: FulfillmentProviderData): Promise<any>

  /**
   * Used to retrieve documents related to a return order.
   */
  getReturnDocuments(data: Record<string, unknown>): Promise<any>

  /**
   * Used to retrieve documents related to a shipment.
   */
  getShipmentDocuments(data: Record<string, unknown>): Promise<any>

  retrieveDocuments(
    fulfillmentData: FulfillmentProviderData,
    documentType: "invoice" | "label"
  ): Promise<any>
}

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
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<Record<string, unknown>>

  abstract validateOption(data: ShippingOptionData): Promise<boolean>

  abstract canCalculate(data: ShippingOptionData): Promise<boolean>

  abstract calculatePrice(
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<number>

  abstract createFulfillment(
    data: ShippingMethodData,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<FulfillmentProviderData>

  abstract cancelFulfillment(fulfillment: FulfillmentProviderData): Promise<any>

  abstract createReturn(
    returnOrder: CreateReturnType
  ): Promise<Record<string, unknown>>

  abstract getFulfillmentDocuments(data: FulfillmentProviderData): Promise<any>

  abstract getReturnDocuments(data: Record<string, unknown>): Promise<any>

  abstract getShipmentDocuments(data: Record<string, unknown>): Promise<any>

  abstract retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any>
}

export default AbstractFulfillmentService
