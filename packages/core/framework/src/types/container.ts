import { RemoteLink } from "@medusajs/modules-sdk"
import {
  ConfigModule,
  IApiKeyModuleService,
  IAuthModuleService,
  ICacheService,
  ICartModuleService,
  ICurrencyModuleService,
  ICustomerModuleService,
  IEventBusModuleService,
  IFileModuleService,
  IFulfillmentModuleService,
  IInventoryService,
  ILockingModule,
  INotificationModuleService,
  IOrderModuleService,
  IPaymentModuleService,
  IPricingModuleService,
  IProductModuleService,
  IPromotionModuleService,
  IRegionModuleService,
  ISalesChannelModuleService,
  IStockLocationService,
  IStoreModuleService,
  ITaxModuleService,
  IUserModuleService,
  IWorkflowEngineService,
  Logger,
  ModuleImplementations,
  RemoteQueryFunction,
} from "@medusajs/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/utils"
import { Knex } from "@mikro-orm/knex"
import { AwilixContainer, ResolveOptions } from "awilix"

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
    [Modules.LOCKING]: ILockingModule
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
