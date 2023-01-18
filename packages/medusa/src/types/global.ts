import { AwilixContainer, ResolveOptions } from "awilix"
import { Request } from "express"
import { EntityManager, LoggerOptions } from "typeorm"
import { Logger as _Logger } from "winston"
import { IFileService, ISearchService } from "../interfaces"
import { Customer, User } from "../models"
import { CountryRepository } from "../repositories/country"
import { CurrencyRepository } from "../repositories/currency"
import {
  AuthService,
  CacheService,
  CartService,
  CustomerService,
  DiscountService,
  EventBusService,
  FulfillmentProviderService,
  GiftCardService,
  LineItemService,
  MiddlewareService,
  NoteService,
  NotificationService,
  OauthService,
  OrderService,
  PaymentProviderService,
  PricingService,
  ProductService,
  ProductVariantService,
  RegionService,
  SalesChannelService,
  ShippingOptionService,
  ShippingProfileService,
  StoreService,
  SwapService,
  TaxProviderService,
  TaxRateService,
  UserService,
} from "../services"
import InviteService from "../services/invite"
import { FindConfig, RequestQueryFields } from "./common"
import { IFlagRouter } from "./feature-flags"

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: (User | Customer) & { customer_id?: string; userId?: string }
      scope: MedusaContainer
      validatedQuery: RequestQueryFields & Record<string, unknown>
      validatedBody: unknown
      listConfig: FindConfig<unknown>
      retrieveConfig: FindConfig<unknown>
      filterableFields: Record<string, unknown>
      allowedProperties: string[]
      errors: string[]
    }
  }
}

export type ExtendedRequest<TEntity> = Request & { resource: TEntity }

export type ClassConstructor<T> = {
  new (...args: unknown[]): T
}

/**
 * Mapping of core Medusa DI container registrations, to their types
 */
export type CoreMedusaContainerMap = {
  logger: Logger
  configModule: ConfigModule
  featureFlagRouter: IFlagRouter
  manager: EntityManager
  cacheService: CacheService
  middlewareService: MiddlewareService
  authService: AuthService
  oauthService: OauthService
  userService: UserService
  storeService: StoreService
  eventBusService: EventBusService
  searchService: ISearchService
  currencyRepository: CurrencyRepository
  countryRepisotory: CountryRepository
  salesChannelService: SalesChannelService
  paymentProviderService: PaymentProviderService
  notificationService: NotificationService
  fullfillmentProviderService: FulfillmentProviderService
  taxProviderService: TaxProviderService
  taxRateService: TaxRateService
  cartService: CartService
  orderService: OrderService
  customerService: CustomerService
  discountServie: DiscountService
  giftCardService: GiftCardService
  inviteSerivce: InviteService
  noteService: NoteService
  swapService: SwapService
  productService: ProductService
  regionService: RegionService
  fileService: IFileService
  lineItemService: LineItemService
  pricingServiece: PricingService
  productVariantService: ProductVariantService
  shippingOptionService: ShippingOptionService
  shippingProfileService: ShippingProfileService
}

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
  /**
   * Resolve a core registration with known type
   * @param name Name of the registration
   * @param resolveOptions options to pass to awilix resolver
   * @returns The entity registered under the given name
   */
  resolveCore<T extends keyof CoreMedusaContainerMap>(
    name: T,
    resolveOptions?: ResolveOptions
  ): CoreMedusaContainerMap[T]
}

export type Logger = _Logger & {
  progress: (activityId: string, msg: string) => void
  info: (msg: string) => void
  warn: (msg: string) => void
}

export enum MODULE_SCOPE {
  INTERNAL = "internal",
  EXTERNAL = "external",
}

export enum MODULE_RESOURCE_TYPE {
  SHARED = "shared",
  ISOLATED = "isolated",
}

export type ConfigurableModuleDeclaration = {
  scope: MODULE_SCOPE.INTERNAL
  resources: MODULE_RESOURCE_TYPE
  resolve?: string
  options?: Record<string, unknown>
}
/*
| {
    scope: MODULE_SCOPE.external
    server: {
      type: "built-in" | "rest" | "tsrpc" | "grpc" | "gql"
      url: string
      options?: Record<string, unknown>
    }
  }
*/

export type ModuleResolution = {
  resolutionPath: string | false
  definition: ModuleDefinition
  options?: Record<string, unknown>
  moduleDeclaration?: ConfigurableModuleDeclaration
}

export type ModuleDefinition = {
  key: string
  registrationName: string
  defaultPackage: string | false
  label: string
  canOverride?: boolean
  isRequired?: boolean
  defaultModuleDeclaration: ConfigurableModuleDeclaration
}

export type LoaderOptions = {
  container: MedusaContainer
  configModule: ConfigModule
  options?: Record<string, unknown>
  logger?: Logger
}

export type Constructor<T> = new (...args: any[]) => T

export type ModuleExports = {
  loaders: ((
    options: LoaderOptions,
    moduleDeclaration?: ConfigurableModuleDeclaration
  ) => Promise<void>)[]
  service: Constructor<any>
  migrations?: any[] // TODO: revisit migrations type
  models?: Constructor<any>[]
}

type SessionOptions = {
  name?: string
  resave?: boolean
  rolling?: boolean
  saveUninitialized?: boolean
  secret?: string
  ttl?: number
}

export type ConfigModule = {
  projectConfig: {
    redis_url?: string

    session_options?: SessionOptions

    jwt_secret?: string
    cookie_secret?: string

    database_url?: string
    database_type: string
    database_database?: string
    database_schema?: string
    database_logging: LoggerOptions

    database_extra?: Record<string, unknown> & {
      ssl: { rejectUnauthorized: false }
    }
    store_cors?: string
    admin_cors?: string
  }
  featureFlags: Record<string, boolean | string>
  modules?: Record<
    string,
    false | string | Partial<ConfigurableModuleDeclaration>
  >
  moduleResolutions?: Record<string, ModuleResolution>
  plugins: (
    | {
        resolve: string
        options: Record<string, unknown>
      }
    | string
  )[]
}
