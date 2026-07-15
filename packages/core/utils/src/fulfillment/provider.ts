import {
  CalculatedShippingOptionPrice,
  CalculateShippingOptionPriceDTO,
  CreateFulfillmentResult,
  CreateShippingOptionDTO,
  FulfillmentDTO,
  FulfillmentItemDTO,
  FulfillmentOption,
  FulfillmentOrderDTO,
  IFulfillmentProvider,
  ValidateFulfillmentDataContext,
} from "@medusajs/types"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the [module's container](https://docs.medusajs.com/learn/fundamentals/modules/container)
 * using the first parameter, and the module's options using the second parameter.
 *
 * :::note
 *
 * A module's options are passed when you register it in the Medusa application.
 *
 * :::
 *
 * If you're creating a client or establishing a connection with a third-party service, do it in the constructor.
 *
 * #### Example
 *
 * ```ts title="src/modules/my-fulfillment/service.ts"
 * import { AbstractFulfillmentProviderService } from "@medusajs/framework/utils"
 * import { Logger } from "@medusajs/framework/types"
 *
 * type InjectedDependencies = {
 *   logger: Logger
 * }
 *
 * type Options = {
 *   apiKey: string
 * }
 *
 * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
 * // other properties...
 *   protected logger_: Logger
 *   protected options_: Options
 *   // assuming you're initializing a client
 *   protected client
 *
 *   constructor(
 *     { logger }: InjectedDependencies,
 *     options: Options
 *   ) {
 *     super()
 *
 *     this.logger_ = logger
 *     this.options_ = options
 *
 *     // TODO initialize your client
 *   }
 * }
 *
 * export default MyFulfillmentProviderService
 * ```
 */
export class AbstractFulfillmentProviderService
  implements IFulfillmentProvider
{
  /**
   * Each fulfillment provider has a unique identifier defined in its class. The provider's ID
   * will be stored as `fp_{identifier}_{id}`, where `{id}` is the provider's `id`
   * property in the `medusa-config.ts`.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   static identifier = "my-fulfillment"
   *
   *   // ...
   * }
   */
  static identifier: string

  /**
   * @ignore
   */
  static _isFulfillmentService = true

  /**
   * @ignore
   */
  static isFulfillmentService(obj) {
    return obj?.constructor?._isFulfillmentService
  }

  /**
   * @ignore
   */
  getIdentifier() {
    return (this.constructor as any).identifier
  }

  /**
   * This method retrieves a list of fulfillment options that this provider supports. Admin users will then choose from these options when
   * they're creating a shipping option. The chosen fulfillment option's object is then stored within the created shipping option's `data` property.
   * The `data` property is useful to store data relevant for the third-party provider to later process the fulfillment.
   *
   * This method is useful if your third-party provider allows you to retrieve support options, carriers, or services from an API. You can then
   * retrieve those and return then in the method, allowing the admin user to choose from the services provided by the third-party provider.
   *
   * @returns The list of fulfillment options. Each object in the array should have an `id` property unique to an item, and a `name` property
   * that's used to display the option in the admin.
   *
   * @example
   * // other imports...
   * import { FulfillmentOption } from "@medusajs/framework/types"
   *
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
   *     // assuming you have a client
   *     const services = await this.client.getServices()
   *
   *     return services.map((service) => ({
   *       id: service.service_id,
   *       name: service.name,
   *       service_code: service.code,
   *       // can add other relevant data for the provider to later process the shipping option.
   *     }))
   *   }
   * }
   */
  async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
    throw Error("getFulfillmentOptions must be overridden by the child class")
  }

  /**
   * This method validates the `data` property of a shipping method and returns it. The returned data
   * is stored in the shipping method's `data` property.
   *
   * Your fulfillment provider can use the `data` property to store additional information useful for
   * handling the fulfillment later. For example, you may store an ID from the third-party fulfillment
   * system.
   *
   * @param optionData - The `data` property of the shipping option.
   * @param data - The `data` property of the shipping method.
   * @param context - Context details, such as context of the cart or customer.
   * @returns the data to store in the `data` property of the shipping method.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async validateFulfillmentData(
   *     optionData: any,
   *     data: any,
   *     context: any
   *   ): Promise<any> {
   *     // assuming your client retrieves an ID from the
   *     // third-party service
   *     const externalId = await this.client.getId()
   *
   *     return {
   *       ...data,
   *       externalId
   *     }
   *   }
   * }
   */
  async validateFulfillmentData(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: ValidateFulfillmentDataContext
  ): Promise<any> {
    throw Error("validateFulfillmentData must be overridden by the child class")
  }

  /**
   * This method validates the `data` property of a shipping option when it's created.
   *
   * The `data` property can hold useful information that's later added to the `data` attribute
   * of shipping methods created from this option.
   *
   * @param data - The data to validate.
   * @return Whether the data is valid.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async validateOption(data: any): Promise<boolean> {
   *     return data.external_id !== undefined
   *   }
   * }
   */
  async validateOption(data: Record<string, unknown>): Promise<boolean> {
    throw Error("validateOption must be overridden by the child class")
  }

  /**
   * This method validates whether a shippin option's price can be calculated during checkout. It's executed when the admin user creates a shipping
   * option of type `calculated`. If this method returns `false`, an error is thrown as the shipping option's price can't be calculated.
   *
   * You can perform the checking using the third-party provider if applicable. The `data` parameter will hold the shipping option's `data` property, which
   * includes the data of a fulfillment option returned by {@link getFulfillmentOptions}.
   *
   * @param data - The `data` property of the shipping option.
   * @returns Whether the price can be calculated for the shipping option.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
   *     // assuming you have a client
   *     return await this.client.hasRates(data.id)
   *   }
   * }
   */
  async canCalculate(data: CreateShippingOptionDTO): Promise<boolean> {
    throw Error("canCalculate must be overridden by the child class")
  }

  /**
   * This method calculates the price of a shipping method whose shipping option has the
   * `price_type` set to `calculated`.
   *
   * In this method, you can send a request to your third-party provider to retrieve the prices. The first
   * parameters holds the `data` property of the shipping method's shipping option, which has fulfillment
   * object data returned by {@link getFulfillmentOptions}.
   *
   * The second parameter holds the `data` property of the shipping method, which has data returned by {@link validateFulfillmentData}.
   * It can also hold custom data passed from the frontend during checkout.
   *
   * So, using both of these data, assuming you're storing in them data related to the third-party service,
   * you can retrieve the calculated price of the shipping method.
   *
   * ### When is this method invoked?
   *
   * This method is invoked in Medusa whenever the calculated shipping option's price needs to be resolved
   * against a cart:
   *
   * - When retrieving a cart's shipping options with their prices, such as when the customer views their shipping options during checkout.
   * - When the shipping method is added to the cart.
   * - Every time the cart is refreshed. A cart is refreshed after most cart changes, such as adding a line item or updating the cart's details, so this method may be invoked frequently for a cart that has a calculated shipping method.
   *
   * The price isn't re-calculated when the cart is completed and converted to an order; the order uses the last price that was stored on the shipping method.
   *
   * If this method throws an error, or returns a result without a `calculated_amount`, the shipping
   * option's price can't be resolved. This blocks the operation that triggered the calculation,
   * such as adding the shipping method to the cart or the cart refresh triggered by other cart
   * changes, which can prevent the customer from completing checkout. So, ensure to handle errors
   * gracefully, such as by falling back to a default price, if you don't want a failure in the
   * third-party service to block checkout.
   *
   * @param optionData - The `data` property of a shipping option.
   * @param data - The shipping method's `data` property with custom data passed from the frontend.
   * @param context - The context details, such as the cart details.
   * @returns The calculated price's details.
   *
   * @example
   * import { CalculateShippingOptionPriceDTO } from "@medusajs/framework/types"
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async calculatePrice(
   *     optionData: CalculateShippingOptionPriceDTO["optionData"],
   *     data: CalculateShippingOptionPriceDTO["data"],
   *     context: CalculateShippingOptionPriceDTO["context"]
   *   ): Promise<CalculatedShippingOptionPrice> {
   *     // assuming the client can calculate the price using
   *     // the third-party service
   *     const price = await this.client.calculate(data)
   *     return {
   *       calculated_amount: price,
   *       // Update this boolean value based on your logic
   *       is_calculated_price_tax_inclusive: true,
   *     }
   *   }
   * }
   */
  async calculatePrice(
    optionData: CalculateShippingOptionPriceDTO["optionData"],
    data: CalculateShippingOptionPriceDTO["data"],
    context: CalculateShippingOptionPriceDTO["context"]
  ): Promise<CalculatedShippingOptionPrice> {
    throw Error("calculatePrice must be overridden by the child class")
  }

  /**
   * This method is used when a fulfillment is created. If the method returns in the object a
   * `data` property, it's stored in the fulfillment's `data` property.
   *
   * The `data` property is useful when handling the fulfillment later,
   * as you can access information useful for your integration, such as the ID in the
   * third-party provider.
   *
   * You can also use this method to perform an action with the third-party fulfillment service
   * since a fulfillment is created, such as purchase a label.
   *
   * @param data - The `data` property of the shipping method this fulfillment is created for.
   * @param items - The items in the fulfillment.
   * @param order - The order this fulfillment is created for.
   * @param fulfillment - The fulfillment's details.
   * @returns An object whose `data` property is stored in the fulfillment's `data` property.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async createFulfillment(
   *     data: Record<string, unknown>,
   *     items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
   *     order: Partial<FulfillmentOrderDTO> | undefined,
   *     fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
   *   ): Promise<CreateFulfillmentResult> {
   *     // assuming the client creates a fulfillment
   *     // in the third-party service
   *     const externalData = await this.client.create(
   *       fulfillment,
   *       items
   *     )
   *
   *     return {
   *       data: {
   *         ...(fulfillment.data as object || {}),
   *         ...externalData
   *       }
   *     }
   *   }
   * }
   */
  async createFulfillment(
    data: Record<string, unknown>,
    items: Partial<Omit<FulfillmentItemDTO, "fulfillment">>[],
    order: Partial<FulfillmentOrderDTO> | undefined,
    fulfillment: Partial<Omit<FulfillmentDTO, "provider_id" | "data" | "items">>
  ): Promise<CreateFulfillmentResult> {
    throw Error("createFulfillment must be overridden by the child class")
  }

  /**
   * This method is used when a fulfillment is canceled. Use it to perform operations
   * with the third-party fulfillment service.
   *
   * @param data - The fulfillment's `data` property.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
   *     // assuming the client cancels a fulfillment
   *     // in the third-party service
   *     const { external_id } = data as {
   *       external_id: string
   *     }
   *     await this.client.cancel(external_id)
   *   }
   * }
   */
  async cancelFulfillment(data: Record<string, unknown>): Promise<any> {
    throw Error("cancelFulfillment must be overridden by the child class")
  }

  /**
   * This method retrieves the documents of a fulfillment.
   *
   * @param data - The `data` property of the fulfillment.
   * @returns The fulfillment's documents.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async getFulfillmentDocuments(data: any): Promise<never[]> {
   *     // assuming the client retrieves documents
   *     // from a third-party service
   *     return await this.client.documents(data)
   *   }
   * }
   */
  async getFulfillmentDocuments(data: Record<string, unknown>) {
    return []
  }

  /**
   * This method is used when a fulfillment is created for a return. If the method returns in the object a
   * `data` property, it's stored in the fulfillment's `data` property.
   *
   * The `data` property is useful when handling the fulfillment later,
   * as you can access information useful for your integration. For example, you
   * can store an ID for the fulfillment in the third-party service.
   *
   * Use this method to perform actions necessary in the third-party fulfillment service, such as
   * purchasing a label for the return fulfillment.
   *
   * @param fulfillment - The fulfillment's details.
   * @returns An object containing `data` which is stored in the fulfillment's `data` property and `labels` array which is used to create FulfillmentLabels.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async createReturnFulfillment(fulfillment: Record<string, unknown>): Promise<CreateFulfillmentResult> {
   *     // assuming the client creates a fulfillment for a return
   *     // in the third-party service
   *     const externalData = await this.client.createReturn(
   *       fulfillment
   *     )
   *
   *     return {
   *       data: {
   *         ...(fulfillment.data as object || {}),
   *         ...externalData
   *       }
   *     }
   *   }
   * }
   */
  async createReturnFulfillment(
    fulfillment: Record<string, unknown>
  ): Promise<CreateFulfillmentResult> {
    throw Error("createReturn must be overridden by the child class")
  }

  /**
   * This method retrieves documents for a return's fulfillment.
   *
   * @param data - The `data` property of the fulfillment.
   * @returns The fulfillment's documents.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async getReturnDocuments(data: any): Promise<never[]> {
   *     // assuming the client retrieves documents
   *     // from a third-party service
   *     return await this.client.documents(data)
   *   }
   * }
   */
  async getReturnDocuments(data: Record<string, unknown>) {
    return []
  }

  /**
   * This method retrieves the documents for a shipment.
   *
   * @param data - The `data` property of the shipmnet.
   * @returns The shipment's documents.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async getShipmentDocuments(data: any): Promise<never[]> {
   *     // assuming the client retrieves documents
   *     // from a third-party service
   *     return await this.client.documents(data)
   *   }
   * }
   *
   */
  async getShipmentDocuments(data: Record<string, unknown>) {
    return []
  }

  /**
   * This method retrieves the documents of a fulfillment of a certain type.
   *
   * @param fulfillmentData - The `data` property of the fulfillment.
   * @param documentType - The document's type. For example, `invoice`.
   * @returns The fulfillment's documents.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async retrieveDocuments(
   *     fulfillmentData: any,
   *     documentType: any
   *   ): Promise<void> {
   *     // assuming the client retrieves documents
   *     // from a third-party service
   *     return await this.client.documents(
   *       fulfillmentData,
   *       documentType
   *     )
   *   }
   * }
   */
  async retrieveDocuments(
    fulfillmentData: Record<string, unknown>,
    documentType: string
  ) {
    throw Error("retrieveDocuments must be overridden by the child class")
  }
}
