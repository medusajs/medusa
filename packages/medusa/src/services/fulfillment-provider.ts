import { MedusaError } from "medusa-core-utils"
import BaseFulfillmentService from "medusa-interfaces/dist/fulfillment-service"
import { EntityManager } from "typeorm"
import { TransactionBaseService } from "../interfaces"
import {
  Cart,
  Fulfillment,
  FulfillmentProvider,
  LineItem,
  Order,
  Return,
  ShippingMethod,
  ShippingOption,
} from "../models"
import { FulfillmentProviderRepository } from "../repositories/fulfillment-provider"
import { CreateFulfillmentOrder } from "../types/fulfillment"
import { FulfillmentOptions } from "../types/fulfillment-provider"
import { MedusaContainer } from "../types/global"

type NotificationProviderKey = `fp_${string}`

type FulfillmentProviderContainer = MedusaContainer & {
  fulfillmentProviderRepository: typeof FulfillmentProviderRepository
  manager: EntityManager
} & {
  [key in `${NotificationProviderKey}`]: BaseFulfillmentService
}

/**
 * Helps retrive fulfillment providers
 */
class FulfillmentProviderService extends TransactionBaseService<FulfillmentProviderService> {
  protected manager_: EntityManager
  protected transactionManager_: EntityManager | undefined

  protected readonly container_: FulfillmentProviderContainer

  protected readonly fulfillmentProviderRepository_: typeof FulfillmentProviderRepository

  constructor(container: FulfillmentProviderContainer) {
    super(container)

    const { manager, fulfillmentProviderRepository } = container

    this.container_ = container
    this.manager_ = manager
    this.fulfillmentProviderRepository_ = fulfillmentProviderRepository
  }

  async registerInstalledProviders(providers: string[]): Promise<void> {
    return await this.atomicPhase_(async (manager) => {
      const fulfillmentProviderRepo = manager.getCustomRepository(
        this.fulfillmentProviderRepository_
      )
      await fulfillmentProviderRepo.update({}, { is_installed: false })

      for (const p of providers) {
        const n = fulfillmentProviderRepo.create({ id: p, is_installed: true })
        await fulfillmentProviderRepo.save(n)
      }
    })
  }

  async list(): Promise<FulfillmentProvider[]> {
    const fpRepo = this.manager_.getCustomRepository(
      this.fulfillmentProviderRepository_
    )

    return await fpRepo.find({})
  }

  async listFulfillmentOptions(
    provider_ids: string[]
  ): Promise<FulfillmentOptions[]> {
    return await Promise.all(
      provider_ids.map(async (p) => {
        const provider = await this.retrieveProvider(p)
        return {
          provider_id: p,
          options:
            (await provider.getFulfillmentOptions()) as unknown as Record<
              string,
              unknown
            >[],
        }
      })
    )
  }

  /**
   * @param provider_id - the provider id
   * @return the payment fulfillment provider
   */
  retrieveProvider(provider_id: string): BaseFulfillmentService {
    try {
      return this.container_[`fp_${provider_id}`]
    } catch (err) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        `Could not find a fulfillment provider with id: ${provider_id}`
      )
    }
  }

  async createFulfillment(
    method: ShippingMethod,
    items: LineItem[],
    order: CreateFulfillmentOrder,
    fulfillment: Omit<Fulfillment, "beforeInsert">
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(method.shipping_option.provider_id)
    return provider.createFulfillment(
      method.data,
      items,
      order,
      fulfillment
    ) as unknown as Record<string, unknown>
  }

  async canCalculate(option: ShippingOption): Promise<boolean> {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.canCalculate(option.data) as unknown as boolean
  }

  async validateFulfillmentData(
    option: ShippingOption,
    data: Record<string, unknown>,
    cart: Cart | Record<string, unknown>
  ): Promise<Record<string, unknown>> {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.validateFulfillmentData(
      option.data,
      data,
      cart
    ) as unknown as Record<string, unknown>
  }

  async cancelFulfillment(fulfillment: Fulfillment): Promise<Fulfillment> {
    const provider = this.retrieveProvider(fulfillment.provider_id)
    return provider.cancelFulfillment(
      fulfillment.data
    ) as unknown as Fulfillment
  }

  async calculatePrice(
    option: ShippingOption,
    data: Record<string, unknown>,
    cart?: Order | Cart
  ): Promise<number> {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.calculatePrice(option.data, data, cart) as unknown as number
  }

  async validateOption(option: ShippingOption): Promise<boolean> {
    const provider = this.retrieveProvider(option.provider_id)
    return provider.validateOption(option.data) as unknown as boolean
  }

  async createReturn(returnOrder: Return): Promise<Record<string, unknown>> {
    const option = returnOrder.shipping_method.shipping_option
    const provider = this.retrieveProvider(option.provider_id)
    return provider.createReturn(returnOrder) as unknown as Record<
      string,
      unknown
    >
  }

  /**
   * Fetches documents from the fulfillment provider
   * @param providerId - the id of the provider
   * @param fulfillmentData - the data relating to the fulfillment
   * @param documentType - the typ of
   * @returns document to fetch
   */
  // TODO: consider removal in favor of "getReturnDocuments" and "getShipmentDocuments"
  async retrieveDocuments(
    providerId: string,
    fulfillmentData: Record<string, unknown>,
    documentType: "invoice" | "label"
  ): Promise<any> {
    const provider = this.retrieveProvider(providerId)
    return provider.retrieveDocuments(fulfillmentData, documentType)
  }
}

export default FulfillmentProviderService
