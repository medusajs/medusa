/**
 * Utility factory and interfaces for module service public facing API
 */
import {
  Constructor,
  Context,
  FindConfig,
  IEventBusModuleService,
  Pluralize,
  RepositoryService,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
import {
  isString,
  kebabCase,
  lowerCaseFirst,
  mapObjectTo,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"
import {
  InjectManager,
  InjectTransactionManager,
  MedusaContext,
} from "./decorators"
import { ModuleRegistrationName } from "./definition"

type BaseMethods =
  | "retrieve"
  | "list"
  | "listAndCount"
  | "delete"
  | "softDelete"
  | "restore"
  | "create"
  | "update"

const readMethods = ["retrieve", "list", "listAndCount"] as BaseMethods[]
const writeMethods = [
  "delete",
  "softDelete",
  "restore",
  "create",
  "update",
] as BaseMethods[]

const methods: BaseMethods[] = [...readMethods, ...writeMethods]

type ModelDTOConfig = {
  dto: object
  create?: any
  update?: any
  /**
   * @internal
   */
  singular?: string
  /**
   * @internal
   */
  plural?: string
}

type EntitiesConfigTemplate = { [key: string]: ModelDTOConfig }

type ModelConfigurationToDto<T extends ModelConfiguration> =
  T extends abstract new (...args: any) => infer R
    ? R
    : T extends { dto: infer DTO }
    ? DTO
    : any

type ModelConfigurationsToConfigTemplate<
  T extends Record<string, ModelConfiguration>
> = {
  [Key in keyof T as `${Capitalize<Key & string>}`]: {
    dto: ModelConfigurationToDto<T[Key]>
    create: any
    update: any
  }
}

type ExtractSingularName<T extends Record<any, any>, K = keyof T> = Capitalize<
  T[K] extends { singular?: string } ? T[K]["singular"] & string : K & string
>

type ExtractPluralName<T extends Record<any, any>, K = keyof T> = T[K] extends {
  plural?: string
}
  ? T[K]["plural"] & string
  : Pluralize<K & string>

// TODO: this will be removed in the follow up pr once the main entity concept will be removed
type ModelConfiguration = Constructor<any> | ModelDTOConfig | any

type ExtractMutationDtoOrAny<T> = T extends unknown ? any : T

export interface AbstractModuleServiceBase<TEntryEntityConfig> {
  new (container: Record<any, any>, ...args: any[]): this

  get __container__(): Record<any, any>

  retrieve(
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntryEntityConfig>

  list(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntryEntityConfig[]>

  listAndCount(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<[TEntryEntityConfig[], number]>

  delete(
    primaryKeyValues: string | object | string[] | object[],
    sharedContext?: Context
  ): Promise<void>

  softDelete<TReturnableLinkableKeys extends string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: SoftDeleteReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>

  restore<TReturnableLinkableKeys extends string>(
    primaryKeyValues: string | object | string[] | object[],
    config?: RestoreReturn<TReturnableLinkableKeys>,
    sharedContext?: Context
  ): Promise<Record<string, string[]> | void>
}

export type AbstractModuleService<
  TEntryEntityConfig extends ModelConfiguration,
  TEntitiesDtoConfig extends EntitiesConfigTemplate
> = AbstractModuleServiceBase<TEntryEntityConfig> & {
  [TEntityName in keyof TEntitiesDtoConfig as `retrieve${ExtractSingularName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: (
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TEntitiesDtoConfig[TEntityName]["dto"]>
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `list${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: (
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `listAndCount${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<
      [TEntitiesDtoConfig[TEntityName]["dto"][], number]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `delete${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      primaryKeyValues: string | object | string[] | object[],
      sharedContext?: Context
    ): Promise<void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `softDelete${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: SoftDeleteReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `restore${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: RestoreReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (...args: any[]): Promise<any>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (...args: any[]): Promise<any>
  }
}

// TODO: Because of a bug, those methods were not made visible which now cause issues with the fix as our interface are not consistent with the expectations

// are not consistent accross modules
/* & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (data: any[], sharedContext?: Context): Promise<
      TEntitiesDtoConfig[TEntityName]["dto"][]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (data: any, sharedContext?: Context): Promise<
      TEntitiesDtoConfig[TEntityName]["dto"][]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      data: TEntitiesDtoConfig[TEntityName]["update"][],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      data: TEntitiesDtoConfig[TEntityName]["update"],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"]>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      idOrdSelector: any,
      data: TEntitiesDtoConfig[TEntityName]["update"],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
  }
}*/

/**
 * @internal
 */
function buildMethodNamesFromModel(
  model: ModelConfiguration,
  suffixed: boolean = true
): Record<string, string> {
  return methods.reduce((acc, method) => {
    let modelName: string = ""

    if (method === "retrieve") {
      modelName =
        "singular" in model && model.singular
          ? model.singular
          : (model as { name: string }).name
    } else {
      modelName =
        "plural" in model && model.plural
          ? model.plural
          : pluralize((model as { name: string }).name)
    }

    const methodName = suffixed
      ? `${method}${upperCaseFirst(modelName)}`
      : method

    return { ...acc, [method]: methodName }
  }, {})
}

/**
 * Factory function for creating an abstract module service
 *
 * @example
 *
 * const entities = {
 *   Currency,
 *   Price,
 *   PriceList,
 *   PriceListRule,
 *   PriceListRuleValue,
 *   PriceRule,
 *   PriceSetRuleType,
 *   RuleType,
 * }
 *
 * class MyService extends ModulesSdkUtils.MedusaService<
 *   PricingTypes.PriceSetDTO,
 *   {
 *     Currency: { dto: PricingTypes.CurrencyDTO }
 *     Price: { dto: PricingTypes.PriceDTO }
 *     PriceRule: { dto: PricingTypes.PriceRuleDTO }
 *     RuleType: { dto: PricingTypes.RuleTypeDTO }
 *     PriceList: { dto: PricingTypes.PriceListDTO }
 *     PriceListRule: { dto: PricingTypes.PriceListRuleDTO }
 *   }
 * >(PriceSet, entities, entityNameToLinkableKeysMap) {}
 *
 * @example
 *
 * // Here the DTO's and names will be inferred from the arguments
 *
 * const entities = {
 *   Currency,
 *   Price,
 *   PriceList,
 *   PriceListRule,
 *   PriceListRuleValue,
 *   PriceRule,
 *   PriceSetRuleType,
 *   RuleType,
 * }
 *
 * class MyService extends ModulesSdkUtils.MedusaService(PriceSet, entities, entityNameToLinkableKeysMap) {}
 *
 * @param entryEntity
 * @param entities
 * @param entityNameToLinkableKeysMap
 */
export function MedusaService<
  TEntryEntityConfig extends ModelConfiguration = ModelConfiguration,
  EntitiesConfig extends EntitiesConfigTemplate = { __empty: any },
  TEntities extends Record<string, ModelConfiguration> = Record<
    string,
    ModelConfiguration
  >
>(
  entryEntity: (TEntryEntityConfig & { name: string }) | Constructor<any>,
  entities: TEntities,
  entityNameToLinkableKeysMap: MapToConfig = {}
): {
  new (...args: any[]): AbstractModuleService<
    ModelConfigurationToDto<TEntryEntityConfig>,
    EntitiesConfig extends { __empty: any }
      ? ModelConfigurationsToConfigTemplate<TEntities>
      : EntitiesConfig
  >
} {
  const buildAndAssignMethodImpl = function (
    klassPrototype: any,
    method: string,
    methodName: string,
    modelName: string
  ): void {
    const serviceRegistrationName = `${lowerCaseFirst(modelName)}Service`

    const applyMethod = function (impl: Function, contextIndex) {
      klassPrototype[methodName] = impl

      const descriptorMockRef = {
        value: klassPrototype[methodName],
      }

      MedusaContext()(klassPrototype, methodName, contextIndex)

      const ManagerDecorator = readMethods.includes(method as BaseMethods)
        ? InjectManager
        : InjectTransactionManager

      ManagerDecorator("baseRepository_")(
        klassPrototype,
        methodName,
        descriptorMockRef
      )

      klassPrototype[methodName] = descriptorMockRef.value
    }

    let methodImplementation: any = function () {
      void 0
    }

    switch (method) {
      case "retrieve":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          id: string,
          config?: FindConfig<any>,
          sharedContext: Context = {}
        ): Promise<T> {
          const entities = await this.__container__[
            serviceRegistrationName
          ].retrieve(id, config, sharedContext)

          return await this.baseRepository_.serialize<T>(entities, {
            populate: true,
          })
        }

        applyMethod(methodImplementation, 2)

        break
      case "create":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          data = [],
          sharedContext: Context = {}
        ): Promise<T | T[]> {
          const serviceData = Array.isArray(data) ? data : [data]
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.create(serviceData, sharedContext)
          const response = Array.isArray(data) ? entities : entities[0]

          return await this.baseRepository_.serialize<T | T[]>(response, {
            populate: true,
          })
        }

        applyMethod(methodImplementation, 1)

        break
      case "update":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          data = [],
          sharedContext: Context = {}
        ): Promise<T | T[]> {
          const serviceData = Array.isArray(data) ? data : [data]
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.update(serviceData, sharedContext)
          const response = Array.isArray(data) ? entities : entities[0]

          return await this.baseRepository_.serialize<T | T[]>(response, {
            populate: true,
          })
        }

        applyMethod(methodImplementation, 1)

        break
      case "list":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const service = this.__container__[serviceRegistrationName]
          const entities = await service.list(filters, config, sharedContext)

          return await this.baseRepository_.serialize<T[]>(entities, {
            populate: true,
          })
        }

        applyMethod(methodImplementation, 2)

        break
      case "listAndCount":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const [entities, count] = await this.__container__[
            serviceRegistrationName
          ].listAndCount(filters, config, sharedContext)

          return [
            await this.baseRepository_.serialize<T[]>(entities, {
              populate: true,
            }),
            count,
          ]
        }

        applyMethod(methodImplementation, 2)

        break
      case "delete":
        methodImplementation = async function (
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          sharedContext: Context = {}
        ): Promise<void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]
          await this.__container__[serviceRegistrationName].delete(
            primaryKeyValues_,
            sharedContext
          )

          await this.eventBusModuleService_?.emit(
            primaryKeyValues_.map((primaryKeyValue) => ({
              eventName: `${kebabCase(modelName)}.deleted`,
              data: isString(primaryKeyValue)
                ? { id: primaryKeyValue }
                : primaryKeyValue,
            }))
          )
        }

        applyMethod(methodImplementation, 1)

        break
      case "softDelete":
        methodImplementation = async function <T extends { id: string }>(
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          config: SoftDeleteReturn<string> = {},
          sharedContext: Context = {}
        ): Promise<Record<string, string[]> | void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]

          const [entities, cascadedEntitiesMap] = await this.__container__[
            serviceRegistrationName
          ].softDelete(primaryKeyValues_, sharedContext)

          const softDeletedEntities = await this.baseRepository_.serialize<T[]>(
            entities,
            {
              populate: true,
            }
          )

          await this.eventBusModuleService_?.emit(
            softDeletedEntities.map(({ id }) => ({
              eventName: `${kebabCase(modelName)}.deleted`,
              metadata: { source: "", action: "", object: "" },
              data: { id },
            }))
          )

          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          const mappedCascadedEntitiesMap = mapObjectTo(
            cascadedEntitiesMap,
            entityNameToLinkableKeysMap,
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
        }

        applyMethod(methodImplementation, 2)

        break
      case "restore":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          primaryKeyValues: string | object | string[] | object[],
          config: RestoreReturn<string> = {},
          sharedContext: Context = {}
        ): Promise<Record<string, string[]> | void> {
          const primaryKeyValues_ = Array.isArray(primaryKeyValues)
            ? primaryKeyValues
            : [primaryKeyValues]

          const [_, cascadedEntitiesMap] = await this.__container__[
            serviceRegistrationName
          ].restore(primaryKeyValues_, sharedContext)

          let mappedCascadedEntitiesMap
          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          mappedCascadedEntitiesMap = mapObjectTo(
            cascadedEntitiesMap,
            entityNameToLinkableKeysMap,
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedEntitiesMap ? mappedCascadedEntitiesMap : void 0
        }

        applyMethod(methodImplementation, 2)

        break
    }
  }

  class AbstractModuleService_ {
    readonly __container__: Record<any, any>
    readonly baseRepository_: RepositoryService
    readonly eventBusModuleService_: IEventBusModuleService;

    [key: string]: any

    constructor(container: Record<any, any>) {
      this.__container__ = container
      this.baseRepository_ = container.baseRepository

      const hasEventBusModuleService = Object.keys(this.__container__).find(
        // TODO: Should use ModuleRegistrationName.EVENT_BUS but it would require to move it to the utils package to prevent circular dependencies
        (key) => key === ModuleRegistrationName.EVENT_BUS
      )

      this.eventBusModuleService_ = hasEventBusModuleService
        ? this.__container__.eventBusModuleService
        : undefined
    }

    protected async emitEvents_(groupedEvents) {
      if (!this.eventBusModuleService_ || !groupedEvents) {
        return
      }

      const promises: Promise<void>[] = []
      for (const group of Object.keys(groupedEvents)) {
        promises.push(this.eventBusModuleService_.emit(groupedEvents[group]))
      }

      await Promise.all(promises)
    }
  }

  const entryEntityMethods = buildMethodNamesFromModel(entryEntity, false)

  /**
   * Build the main retrieve/list/listAndCount/delete/softDelete/restore methods for the main model
   */

  for (let [method, methodName] of Object.entries(entryEntityMethods)) {
    buildAndAssignMethodImpl(
      AbstractModuleService_.prototype,
      method,
      methodName,
      entryEntity.name
    )
  }

  /**
   * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
   */

  const entitiesMethods: [
    string,
    ModelConfiguration,
    Record<string, string>
  ][] = Object.entries(entities).map(([name, config]) => [
    name,
    config,
    buildMethodNamesFromModel(config),
  ])

  for (let [modelName, model, modelsMethods] of entitiesMethods) {
    Object.entries(modelsMethods).forEach(([method, methodName]) => {
      buildAndAssignMethodImpl(
        AbstractModuleService_.prototype,
        method,
        methodName,
        modelName
      )
    })
  }

  return AbstractModuleService_ as any
}
type InjectedDependencies = {
  baseRepository: RepositoryService
  eventBusModuleService: IEventBusModuleService
}

export class TestModel {
  id: string
}

export class OtherModel {
  title: string
  id: string
}

class Service extends MedusaService(TestModel, { OtherModel }) {
  constructor(container: InjectedDependencies) {
    super(container)
  }

  async test() {
    const entities = await super.listOtherModels()
    const id = entities[0].title
  }
}

class Service2 extends MedusaService<
  {
    dto: { id: string }
    name: "test"
  },
  {
    OtherModel: { dto: { title: string } }
  }
>(TestModel, { OtherModel }) {
  constructor(container: InjectedDependencies) {
    super(container)
  }

  async test() {
    const entities = await super.listOtherModels()
    const id = entities[0].title
  }
}
