import { FulfillmentOption, IFulfillmentProvider } from "@medusajs/types"

/**
 * ### constructor
 *
 * The constructor allows you to access resources from the module's container using the first parameter,
 * and the module's options using the second parameter.
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
 * ```ts
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
   * The `identifier` property holds a unique identifier of the fulfillment module provider.
   *
   * You can use the kebab-case name of the provider as its value.
   *
   * For example:
   *
   * ```ts
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
   * This method retrieves the shipping options this fulfillment provider supports.
   *
   * @returns The list of fulfillment options.
   *
   * @example
   * // other imports...
   * import { FulfillmentOption } from "@medusajs/framework/types"
   *
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async getFulfillmentOptions(): Promise<FulfillmentOption[]> {
   *     return [
   *       {
   *         id: "express"
   *       },
   *       {
   *         id: "return-express",
   *         is_return: true
   *       }
   *     ]
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
    context: Record<string, unknown>
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
   * This method indicates whether a shippin option's price is calculated during
   * checkout or is fixed.
   *
   * @param data - The `data` property of the shipping option.
   * @returns Whether the price is calculated for the shipping option.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async canCalculate(data: any): Promise<boolean> {
   *     return data.custom_type !== "fixed"
   *   }
   * }
   */
  async canCalculate(data: Record<string, unknown>): Promise<boolean> {
    throw Error("canCalculate must be overridden by the child class")
  }

  /**
   * This method calculates the price of a shipping option, or a shipping method when it's created.
   *
   * The Medusa application uses the {@link canCalculate} method first to check whether the shipping option's price is calculated.
   * If it returns `true`, Medusa uses this method to retrieve the calculated price.
   *
   * @param optionData - The `data` property of a shipping option.
   * @param data - If the price is calculated for a shipping option, it's the `data` of the shipping option. Otherwise, it's the `data of the shipping method.
   * @param cart - The cart details.
   * @returns The calculated price
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async calculatePrice(optionData: any, data: any, cart: any): Promise<number> {
   *     // assuming the client can calculate the price using
   *     // the third-party service
   *     const price = await this.client.calculate(data)
   *
   *     return price
   *   }
   * }
   */
  async calculatePrice(
    optionData: Record<string, unknown>,
    data: Record<string, unknown>,
    context: Record<string, unknown>
  ): Promise<number> {
    throw Error("calculatePrice must be overridden by the child class")
  }

  /**
   * This method is used when a fulfillment is created. If the method returns in the object a
   * `data` property, it's stored in the fulfillment's `data` property.
   *
   * The `data` property is useful when handling the fulfillment later,
   * as you can access information useful for your integration.
   *
   * You can also use this method to perform an action with the third-party fulfillment service.
   *
   * @param data - The `data` property of the shipping method this fulfillment is created for.
   * @param items - The items in the fulfillment.
   * @param order - The order this fulfillment is created for.
   * @param fulfillment - The fulfillment's details.
   * @returns The data to store in the fulfillment's `data` property.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async createFulfillment(
   *     data: any,
   *     items: any,
   *     order: any,
   *     fulfillment: any
   *   ): Promise<any> {
   *     // assuming the client creates a fulfillment
   *     // in the third-party service
   *     const externalData = await this.client.create(
   *       fulfillment,
   *       items
   *     )
   *
   *     return {
   *       data: {
   *         ...data,
   *         ...externalData
   *       }
   *     }
   *   }
   * }
   */
  async createFulfillment(
    data: object,
    items: object[],
    order: object | undefined,
    fulfillment: Record<string, unknown>
  ): Promise<any> {
    throw Error("createFulfillment must be overridden by the child class")
  }

  /**
   * This method is used when a fulfillment is canceled. Use it to perform operations
   * with the third-party fulfillment service.
   *
   * @param fulfillment - The fulfillment's details.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async cancelFulfillment(fulfillment: any): Promise<any> {
   *     // assuming the client cancels a fulfillment
   *     // in the third-party service
   *     await this.client.cancel(fulfillment.id)
   *   }
   * }
   */
  async cancelFulfillment(fulfillment: Record<string, unknown>): Promise<any> {
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
   * as you can access information useful for your integration.
   *
   * Use this method to perform actions necessary in the third-party fulfillment service.
   *
   * @param fulfillment - The fulfillment's details.
   * @returns The data to store in the fulfillment's `data` property.
   *
   * @example
   * class MyFulfillmentProviderService extends AbstractFulfillmentProviderService {
   *   // ...
   *   async createReturnFulfillment(fulfillment: any): Promise<any> {
   *     // assuming the client creates a fulfillment for a return
   *     // in the third-party service
   *     const externalData = await this.client.createReturn(
   *       fulfillment
   *     )
   *
   *     return {
   *       data: {
   *         ...fulfillment.data,
   *         ...externalData
   *       }
   *     }
   *   }
   * }
   */
  async createReturnFulfillment(fulfillment: Record<string, unknown>): Promise<any> {
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
