import { Knex } from "@mikro-orm/knex"
import { RemoteLink } from "@medusajs/modules-sdk"
import { AwilixContainer, ResolveOptions } from "awilix"
import { Modules, ContainerRegistrationKeys } from "@medusajs/utils"
import {
  Logger,
  ConfigModule,
  ModuleImplementations,
  RemoteQueryFunction,
  IAuthModuleService,
  ICacheService,
  ICartModuleService,
  ICustomerModuleService,
  IEventBusModuleService,
  IInventoryService,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  ISalesChannelModuleService,
  ITaxModuleService,
  IFulfillmentModuleService,
  IStockLocationService,
  IUserModuleService,
  IWorkflowEngineService,
  IRegionModuleService,
  IOrderModuleService,
  IApiKeyModuleService,
  IStoreModuleService,
  ICurrencyModuleService,
  IFileModuleService,
  INotificationModuleService,
} from "@medusajs/types"

declare module "@medusajs/types" {
  export interface ModuleImplementations {
    [ContainerRegistrationKeys.REMOTE_LINK]: RemoteLink
    [ContainerRegistrationKeys.CONFIG_MODULE]: ConfigModule
    [ContainerRegistrationKeys.PG_CONNECTION]: Knex<any>
    [ContainerRegistrationKeys.REMOTE_QUERY]: RemoteQueryFunction
    [ContainerRegistrationKeys.QUERY]: Omit<RemoteQueryFunction, symbol>
    [ContainerRegistrationKeys.LOGGER]: Logger
    [Modules.AUTH]: IAuthModuleService
    [Modules.CACHE]: ICacheService
    [Modules.CART]: ICartModuleService
    [Modules.CUSTOMER]: ICustomerModuleService
    [Modules.EVENT_BUS]: IEventBusModuleService
    [Modules.INVENTORY]: IInventoryService
    [Modules.PAYMENT]: IPaymentModuleService
    [Modules.PRICING]: IPricingModuleService
    [Modules.PRODUCT]: IProductModuleService
    [Modules.PROMOTION]: IPromotionModuleService
    [Modules.SALES_CHANNEL]: ISalesChannelModuleService
    [Modules.TAX]: ITaxModuleService
    [Modules.FULFILLMENT]: IFulfillmentModuleService
    [Modules.STOCK_LOCATION]: IStockLocationService
    [Modules.USER]: IUserModuleService
    [Modules.WORKFLOW_ENGINE]: IWorkflowEngineService
    [Modules.REGION]: IRegionModuleService
    [Modules.ORDER]: IOrderModuleService
    [Modules.API_KEY]: IApiKeyModuleService
    [Modules.STORE]: IStoreModuleService
    [Modules.CURRENCY]: ICurrencyModuleService
    [Modules.FILE]: IFileModuleService
    [Modules.NOTIFICATION]: INotificationModuleService
  }
}

export type MedusaContainer<Cradle extends object = ModuleImplementations> =
  Omit<AwilixContainer, "resolve"> & {
    resolve<K extends keyof Cradle>(
      key: K,
      resolveOptions?: ResolveOptions
    ): Cradle[K]
    resolve<T>(key: string, resolveOptions?: ResolveOptions): T

    /**
     * @ignore
     */
    registerAdd: <T>(name: string, registration: T) => MedusaContainer
    /**
     * @ignore
     */
    createScope: () => MedusaContainer
  }

export type ContainerLike = {
  resolve<T = unknown>(key: string): T
}
