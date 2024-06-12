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
  create?: object
  update?: object
  singular?: string
  plural?: string
}

type EntityConfigTemplate = Record<string, ModelDTOConfig>

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
  }
}

type ExtractSingularName<
  T extends Record<any, any>,
  K = keyof T
> = T[K] extends { singular?: string } ? T[K]["singular"] : K & string

type ExtractPluralName<T extends Record<any, any>, K = keyof T> = T[K] extends {
  plural?: string
}
  ? T[K]["plural"]
  : Pluralize<K & string>

type ModelConfiguration = Constructor<any> | (ModelDTOConfig & { name: string })

export interface AbstractModuleServiceBase<TEntryEntityDTO> {
  new (container: Record<any, any>, ...args: any[]): this

  get __container__(): Record<any, any>

  retrieve(
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntryEntityDTO>

  list(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TEntryEntityDTO[]>

  listAndCount(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<[TEntryEntityDTO[], number]>

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
  TEntryEntityDTO extends ModelConfiguration,
  TEntitiesDtoConfig extends EntityConfigTemplate
> = AbstractModuleServiceBase<TEntryEntityDTO> & {
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
    (
      data: TEntitiesDtoConfig[TEntityName]["create"][],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      data: TEntitiesDtoConfig[TEntityName]["create"],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"]>
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
}

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
 * class MyService extends ModulesSdkUtils.abstractModuleServiceFactory<
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
 * class MyService extends ModulesSdkUtils.abstractModuleServiceFactory(PriceSet, entities, entityNameToLinkableKeysMap) {}
 *
 * @param entryEntity
 * @param entities
 * @param entityNameToLinkableKeysMap
 */
export function abstractModuleServiceFactory<
  TEntryEntityDTO extends ModelConfiguration = ModelConfiguration,
  EntityConfig extends EntityConfigTemplate = {},
  TEntities extends Record<string, ModelConfiguration> = Record<
    string,
    ModelConfiguration
  >
>(
  entryEntity: TEntryEntityDTO,
  entities: TEntities,
  entityNameToLinkableKeysMap: MapToConfig = {}
): AbstractModuleService<
  ModelConfigurationToDto<TEntryEntityDTO>,
  EntityConfig extends {}
    ? ModelConfigurationsToConfigTemplate<TEntities>
    : EntityConfig
> {
  const buildAndAssignMethodImpl = function (
    klassPrototype: any,
    method: string,
    methodName: string,
    model: ModelConfiguration
  ): void {
    const serviceRegistrationName = `${lowerCaseFirst(model.name)}Service`

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
              eventName: `${kebabCase(model.name)}.deleted`,
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
              eventName: `${kebabCase(model.name)}.deleted`,
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
      entryEntity
    )
  }

  /**
   * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
   */

  const entitiesMethods: [ModelConfiguration, Record<string, string>][] =
    Object.values(entities).map((model) => [
      model,
      buildMethodNamesFromModel(model),
    ])

  for (let [model, modelsMethods] of entitiesMethods) {
    Object.entries(modelsMethods).forEach(([method, methodName]) => {
      buildAndAssignMethodImpl(
        AbstractModuleService_.prototype,
        method,
        methodName,
        model
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

class Service extends abstractModuleServiceFactory(TestModel, { OtherModel }) {
  constructor(container: InjectedDependencies) {
    super(container)
  }

  async test() {
    const entities = await super.listOtherModels()
    const id = entities[0].title
  }
}
