import { MedusaContainer } from "@medusajs/types"
import { Cart, Fulfillment, LineItem, Order } from "../models"
import { CreateReturnType } from "../types/fulfillment-provider"
import { TransactionBaseService } from "./transaction-base-service"

type FulfillmentProviderData = Record<string, unknown>
type ShippingOptionData = Record<string, unknown>
type ShippingMethodData = Record<string, unknown>

/**
 * ## Overview
 *
 * A fulfillment provider is the shipping provider used to fulfill orders and deliver them to customers. An example of a fulfillment provider is FedEx.
 *
 * By default, a Medusa Backend has a `manual` fulfillment provider which has minimal implementation. It allows you to accept orders and fulfill them manually. However, you can integrate any fulfillment provider into Medusa, and your fulfillment provider can interact with third-party shipping providers.
 *
 * A fulfillment provider is a service that extends the `AbstractFulfillmentService` and implements its methods. So, adding a fulfillment provider is as simple as creating a service file in `src/services`.
 * The file's name is the fulfillment provider's class name as a slug and without the word `Service`. For example, if you're creating a `MyFulfillmentService` class, the file name is `src/services/my-fulfillment.ts`.
 *
 * ```ts title="src/services/my-fulfillment.ts"
 * import { AbstractFulfillmentService } from "@medusajs/medusa"
 *
 * class MyFulfillmentService extends AbstractFulfillmentService {
 *   // methods here...
 * }
 *
 * export default MyFulfillmentService
 * ```
 *
 * ---
 *
 * ## Identifier Property
 *
 * The `FulfillmentProvider` entity has 2 properties: `identifier` and `is_installed`. The `identifier` property in the fulfillment provider service is used when the fulfillment provider is added to the database.
 *
 * The value of this property is also used to reference the fulfillment provider throughout Medusa. For example, it is used to [add a fulfillment provider](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) to a region.
 *
 * ```ts
 * class MyFulfillmentService extends AbstractFulfillmentService {
 *   static identifier = "my-fulfillment"
 *
 *   // ...
 * }
 * ```
 *
 * ---
 */
export interface FulfillmentService extends TransactionBaseService {
  /**
   * @ignore
   *
   * Return a unique identifier to retrieve the fulfillment plugin provider
   */
  getIdentifier(): string

  /**
   * This method is used when retrieving the list of fulfillment options available in a region, particularly by the [List Fulfillment Options API Route](https://docs.medusajs.com/api/admin#regions_getregionsregionfulfillmentoptions).
   * For example, if you’re integrating UPS as a fulfillment provider, you might support two fulfillment options: UPS Express Shipping and UPS Access Point. Each of these options can have different data associated with them.
   *
   * @returns {Promise<any[]>} The list of fulfillment options. These options don't have any required format. Later on, these options can be used when creating a shipping option,
   * such as when using the [Create Shipping Option API Route](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions). The chosen fulfillment option, which is one of the
   * items in the array returned by this method, will be set in the `data` object of the shipping option.
   *
   * @example
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async getFulfillmentOptions(): Promise<any[]> {
   *     return [
   *       {
   *         id: "my-fulfillment",
   *       },
   *       {
   *         id: "my-fulfillment-dynamic",
   *       },
   *     ]
   *   }
   * }
   */
  getFulfillmentOptions(): Promise<any[]>

  /**
   * This method is called when a shipping method is created. This typically happens when the customer chooses a shipping option during checkout, when a shipping method is created
   * for an order return, or in other similar cases. The shipping option and its data are validated before the shipping method is created.
   *
   * You can use the provided parameters to validate the chosen shipping option. For example, you can check if the `data` object passed as a second parameter includes all data needed to
   * fulfill the shipment later on.
   *
   * If any of the data is invalid, you can throw an error. This error will stop Medusa from creating a shipping method and the error message will be returned as a result of the API Route.
   *
   * @param {ShippingOptionData} optionData - The data object of the shipping option selected when creating the shipping method.
   * @param {FulfillmentProviderData} data - The `data` object passed in the body of the request.
   * @param {Cart} cart - The customer's cart details. It may be empty if the shipping method isn't associated with a cart, such as when it's associated with a claim.
   * @returns {Promise<Record<string, unknown>>} The data that will be stored in the `data` property of the shipping method to be created.
   * Make sure the value you return contains everything you need to fulfill the shipment later on. The returned value may also be used to calculate the price of the shipping method
   * if it doesn't have a set price. It will be passed along to the {@link calculatePrice} method.
   *
   * @example
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async validateFulfillmentData(
   *     optionData: Record<string, unknown>,
   *     data: Record<string, unknown>,
   *     cart: Cart
   *   ): Promise<Record<string, unknown>> {
   *     if (data.id !== "my-fulfillment") {
   *       throw new Error("invalid data")
   *     }
   *
   *     return {
   *       ...data,
   *     }
   *   }
   * }
   */
  validateFulfillmentData(
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<Record<string, unknown>>

  /**
   * Once the admin creates the shipping option, the data of the shipping option will be validated first using this method. This method is called when the [Create Shipping Option API Route](https://docs.medusajs.com/api/admin#shipping-options_postshippingoptions) is used.
   *
   * @param {ShippingOptionData} data - the data object that is sent in the body of the request, basically, the data object of the shipping option. You can use this data to validate the shipping option before it is saved.
   * @returns {Promise<boolean>} Whether the fulfillment option is valid. If the returned value is false, an error is thrown and the shipping option will not be saved.
   *
   * @example
   * For example, you can use this method to ensure that the `id` in the `data` object is correct:
   *
   * ```ts
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async validateOption(
   *     data: Record<string, unknown>
   *   ): Promise<boolean> {
   *     return data.id == "my-fulfillment"
   *   }
   * }
   * ```
   */
  validateOption(data: ShippingOptionData): Promise<boolean>

  /**
   * This method is used to determine whether a shipping option is calculated dynamically or flat rate. It is called if the `price_type` of the shipping option being created is set to calculated.
   *
   * @param {ShippingOptionData} data - The `data` object of the shipping option being created. You can use this data to determine whether the shipping option should be calculated or not.
   * This is useful if the fulfillment provider you are integrating has both flat rate and dynamically priced fulfillment options.
   * @returns {Promise<boolean>} If this method returns `true`, that means that the price can be calculated dynamically and the shipping option can have the `price_type` set to calculated.
   * The amount property of the shipping option will then be set to null. The amount will be created later when the shipping method is created on checkout using the {@link calculatePrice} method.
   * If the method returns `false`, an error is thrown as it means the selected shipping option is invalid and it can only have the `flat_rate` price type.
   *
   * @example
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async canCalculate(
   *     data: Record<string, unknown>
   *   ): Promise<boolean> {
   *     return data.id === "my-fulfillment-dynamic"
   *   }
   * }
   */
  canCalculate(data: ShippingOptionData): Promise<boolean>

  /**
   * This method is used in different places, including:
   *
   * 1. When the shipping options for a cart are retrieved during checkout. If a shipping option has their `price_type` set to calculated, this method is used to set the amount of the returned shipping option.
   * 2. When a shipping method is created. If the shipping option associated with the method has their `price_type` set to `calculated`, this method is used to set the `price` attribute of the shipping method in the database.
   * 3. When the cart's totals are calculated.
   *
   * @param {ShippingOptionData} optionData - The `data` object of the selected shipping option.
   * @param {FulfillmentProviderData} data -
   * A `data` object that is different based on the context it's used in:
   *
   * 1. If the price is being calculated for the list of shipping options available for a cart, it's the `data` object of the shipping option.
   * 2. If the price is being calculated when the shipping method is being created, it's the data returned by the {@link validateFulfillmentData} method used during the shipping method creation.
   * 3. If the price is being calculated while calculating the cart's totals, it will be the data object of the cart's shipping method.
   * @param {Cart} cart - Either the Cart or the Order object.
   * @returns {Promise<number>} Used to set the price of the shipping method or option, based on the context the method is used in.
   *
   * @example
   * An example of calculating the price based on some custom logic:
   *
   * ```ts
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async calculatePrice(
   *     optionData: Record<string, unknown>,
   *     data: Record<string, unknown>,
   *     cart: Cart
   *   ): Promise<number> {
   *     return cart.items.length * 1000
   *   }
   * }
   * ```
   *
   * If your fulfillment provider does not provide any dynamically calculated rates you can return any static value or throw an error. For example:
   *
   * ```ts
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async calculatePrice(
   *     optionData: Record<string, unknown>,
   *     data: Record<string, unknown>,
   *     cart: Cart
   *   ): Promise<number> {
   *     throw new Error("Method not implemented.")
   *   }
   * }
   * ```
   */
  calculatePrice(
    optionData: ShippingOptionData,
    data: FulfillmentProviderData,
    cart: Cart
  ): Promise<number>

  /**
   * This method is used when a fulfillment is created for an order, a claim, or a swap.
   *
   * @param {ShippingMethodData} data -
   * The `data` object of the shipping method associated with the resource, such as the order.
   * You can use it to access the data specific to the shipping option. This is based on your implementation of previous methods.
   * @param {LineItem[]} items - The line items in the order to be fulfilled. The admin can choose all or some of the items to fulfill.
   * @param {Order} order -
   * The details of the created resource, which is either an order, a claim, or a swap:
   * - If the resource the fulfillment is being created for is a claim, the `is_claim` property in the object will be `true`.
   * - If the resource the fulfillment is being created for is a swap, the `is_swap` property in the object will be `true`.
   * - Otherwise, the resource is an order.
   * @param {Fulfillment} fulfillment - The fulfillment being created.
   * @returns {Promise<FulfillmentProviderData>} The data that will be stored in the `data` attribute of the created fulfillment.
   *
   * @example
   * Here is a basic implementation of `createFulfillment` for a fulfillment provider that does not interact with any third-party provider to create the fulfillment:
   *
   * ```ts
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async createFulfillment(
   *     data: Record<string, unknown>,
   *     items: LineItem[],
   *     order: Order,
   *     fulfillment: Fulfillment
   *   ) {
   *     // No data is being sent anywhere
   *     // No data to be stored in the fulfillment's data object
   *     return {}
   *   }
   * }
   * ```
   */
  createFulfillment(
    data: ShippingMethodData,
    items: LineItem[],
    order: Order,
    fulfillment: Fulfillment
  ): Promise<FulfillmentProviderData>

  /**
   * This method is called when a fulfillment is cancelled by the admin. This fulfillment can be for an order, a claim, or a swap.
   *
   * @param {FulfillmentProviderData} fulfillmentData - The `data` attribute of the fulfillment being canceled
   * @returns {Promise<any>} The method isn't expected to return any specific data.
   *
   * @example
   * This is the basic implementation of the method for a fulfillment provider that doesn't interact with a third-party provider to cancel the fulfillment:
   *
   * ```ts
   * class MyFulfillmentService extends FulfillmentService {
   *   // ...
   *   async cancelFulfillment(
   *     fulfillment: Record<string, unknown>
   *   ): Promise<any> {
   *     return {}
   *   }
   * }
   * ```
   */
  cancelFulfillment(fulfillmentData: FulfillmentProviderData): Promise<any>

  /**
   * Fulfillment providers can also be used to return products. A shipping option can be used for returns if the `is_return` property is true or if an admin creates a Return Shipping Option from the settings.
   * This method is used when the admin [creates a return request](https://docs.medusajs.com/api/admin#orders_postordersorderreturns) for an order,
   * [creates a swap](https://docs.medusajs.com/api/admin#orders_postordersorderswaps) for an order, or when the
   * [customer creates a return of their order](https://docs.medusajs.com/api/store#returns_postreturns). The fulfillment is created automatically for the order return.
   *
   * @param {CreateReturnType} returnOrder - the return that the fulfillment is being created for.
   * @returns {Promise<Record<string, unknown>>} Used to set the value of the `shipping_data` attribute of the return being created.
   *
   * @example
   * This is the basic implementation of the method for a fulfillment provider that does not contact with a third-party provider to fulfill the return:
   *
   * ```ts
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   async createReturn(
   *     returnOrder: CreateReturnType
   *   ): Promise<Record<string, unknown>> {
   *     return {}
   *   }
   * }
   * ```
   */
  createReturn(returnOrder: CreateReturnType): Promise<Record<string, unknown>>

  /**
   * This method is used to retrieve any documents associated with a fulfillment. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.
   *
   * @param {FulfillmentProviderData} data - The `data` attribute of the fulfillment that you're retrieving the documents for.
   * @returns {Promise<any>} There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.
   *
   * @example
   * class MyFulfillmentService extends FulfillmentService {
   *   // ...
   *   async getFulfillmentDocuments(
   *     data: Record<string, unknown>
   *   ): Promise<any> {
   *     // assuming you contact a client to
   *     // retrieve the document
   *     return this.client.getFulfillmentDocuments()
   *   }
   * }
   */
  getFulfillmentDocuments(data: FulfillmentProviderData): Promise<any>

  /**
   * This method is used to retrieve any documents associated with a return. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.
   *
   * @param {Record<string, unknown>} data - The data attribute of the return that you're retrieving the documents for.
   * @returns {Promise<any>} There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.
   *
   * @example
   * class MyFulfillmentService extends FulfillmentService {
   *   // ...
   *   async getReturnDocuments(
   *     data: Record<string, unknown>
   *   ): Promise<any> {
   *     // assuming you contact a client to
   *     // retrieve the document
   *     return this.client.getReturnDocuments()
   *   }
   * }
   */
  getReturnDocuments(data: Record<string, unknown>): Promise<any>

  /**
   * This method is used to retrieve any documents associated with a shipment. This method isn't used by default in the backend, but you can use it for custom use cases such as allowing admins to download these documents.
   *
   * @param {Record<string, unknown>} data - The `data` attribute of the shipment that you're retrieving the documents for.
   * @returns {Promise<any>} There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.
   *
   * @example
   * class MyFulfillmentService extends FulfillmentService {
   *   // ...
   *   async getShipmentDocuments(
   *     data: Record<string, unknown>
   *   ): Promise<any> {
   *     // assuming you contact a client to
   *     // retrieve the document
   *     return this.client.getShipmentDocuments()
   *   }
   * }
   */
  getShipmentDocuments(data: Record<string, unknown>): Promise<any>

  /**
   * This method is used to retrieve any documents associated with an order and its fulfillments. This method isn't used by default in the backend, but you can use it for
   * custom use cases such as allowing admins to download these documents.
   *
   * @param {FulfillmentProviderData} fulfillmentData - The `data` attribute of the order's fulfillment.
   * @param documentType - The type of document to retrieve.
   * @returns {Promise<any>} There are no restrictions on the returned response. If your fulfillment provider doesn't provide this functionality, you can leave the method empty or through an error.
   *
   * @example
   * class MyFulfillmentService extends FulfillmentService {
   *   // ...
   *   async retrieveDocuments(
   *     fulfillmentData: Record<string, unknown>,
   *     documentType: "invoice" | "label"
   *   ): Promise<any> {
   *     // assuming you contact a client to
   *     // retrieve the document
   *     return this.client.getDocuments()
   *   }
   * }
   */
  retrieveDocuments(
    fulfillmentData: FulfillmentProviderData,
    documentType: "invoice" | "label"
  ): Promise<any>
}

/**
 * @parentIgnore activeManager_,atomicPhase_,shouldRetryTransaction_,withTransaction
 */
export abstract class AbstractFulfillmentService
  extends TransactionBaseService
  implements FulfillmentService
{
  /**
   * @ignore
   */
  static _isFulfillmentService = true

  /**
   * @ignore
   */
  static isFulfillmentService(object): boolean {
    return object?.constructor?._isFulfillmentService
  }

  /**
   * You can use the `constructor` of your fulfillment provider to access the different services in Medusa through dependency injection.
   *
   * You can also use the constructor to initialize your integration with the third-party provider. For example, if you use a client to connect to the third-party provider’s APIs, you can initialize it in the constructor and use it in other methods in the service.
   * Additionally, if you’re creating your fulfillment provider as an external plugin to be installed on any Medusa backend and you want to access the options added for the plugin, you can access it in the constructor.
   *
   * @param {Record<string, unknown>} container - An instance of `MedusaContainer` that allows you to access other resources, such as services, in your Medusa backend.
   * @param {Record<string, unknown>} config - If this fulfillment provider is created in a plugin, the plugin's options are passed in this parameter.
   *
   * @example
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   // ...
   *   constructor(container, options) {
   *     super(container)
   *     // you can access options here
   *
   *     // you can also initialize a client that
   *     // communicates with a third-party service.
   *     this.client = new Client(options)
   *   }
   *   // ...
   * }
   */
  protected constructor(
    protected readonly container: Record<string, unknown>,
    protected readonly config?: Record<string, unknown> // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {
    super(container, config)
  }

  /**
   * The `FulfillmentProvider` entity has 2 properties: `identifier` and `is_installed`. The `identifier` property in the class is used when the fulfillment provider is created in the database.
   * The value of this property is also used to reference the fulfillment provider throughout Medusa. For example, it is used to [add a fulfillment provider](https://docs.medusajs.com/api/admin#regions_postregionsregionfulfillmentproviders) to a region.
   *
   * @example
   * class MyFulfillmentService extends AbstractFulfillmentService {
   *   static identifier = "my-fulfillment"
   *
   *   // ...
   * }
   */
  public static identifier: string

  /**
   * @ignore
   */
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
