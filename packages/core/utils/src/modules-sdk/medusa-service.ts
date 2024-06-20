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
import { InjectManager, MedusaContext } from "./decorators"
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
   * @deprecated
   */
  singular?: string
  /**
   * @internal
   * @deprecated
   */
  plural?: string
}

type EntitiesConfigTemplate = { [key: string]: ModelDTOConfig }

type ModelConfigurationsToConfigTemplate<T extends TEntityEntries> = {
  [Key in keyof T as `${Capitalize<Key & string>}`]: {
    dto: T[Key] extends Constructor<any> ? InstanceType<T[Key]> : any
    create: any
    update: any
    singular: T[Key] extends { singular: string } ? T[Key]["singular"] : string
    plural: T[Key] extends { plural: string } ? T[Key]["plural"] : string
  }
}

/**
 * @deprecated should all notion of singular and plural be removed once all modules are aligned with the convention
 */
type ExtractSingularName<T extends Record<any, any>, K = keyof T> = Capitalize<
  T[K] extends { singular?: string } ? T[K]["singular"] & string : K & string
>

/**
 * @deprecated should all notion of singular and plural be removed once all modules are aligned with the convention
 * The pluralize will move to where it should be used instead
 */
type ExtractPluralName<T extends Record<any, any>, K = keyof T> = T[K] extends {
  plural?: string
}
  ? T[K]["plural"] & string
  : Pluralize<K & string>

// TODO: The future expected entry will be a DML object but in the meantime we have to maintain  backward compatibility for ouw own modules and therefore we need to support Constructor<any> as well as this temporary object
type TEntityEntries<Keys = string> = Record<
  Keys & string,
  Constructor<any> | { name?: string; singular?: string; plural?: string }
>

type ExtractKeysFromConfig<EntitiesConfig> = EntitiesConfig extends {
  __empty: any
}
  ? string
  : keyof EntitiesConfig

export type AbstractModuleService<
  TEntitiesDtoConfig extends EntitiesConfigTemplate
> = {
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
  modelName: string,
  model: TEntityEntries[keyof TEntityEntries]
): Record<string, string> {
  return methods.reduce((acc, method) => {
    let normalizedModelName: string = ""

    if (method === "retrieve") {
      normalizedModelName =
        "singular" in model && model.singular ? model.singular : modelName
    } else {
      normalizedModelName =
        "plural" in model && model.plural ? model.plural : pluralize(modelName)
    }

    const methodName = `${method}${upperCaseFirst(normalizedModelName)}`

    return { ...acc, [method]: methodName }
  }, {})
}

/**
 * Factory function for creating an abstract module service
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
 * class MyService extends ModulesSdkUtils.MedusaService(entities, entityNameToLinkableKeysMap) {}
 *
 * @param entities
 * @param entityNameToLinkableKeysMap
 */
export function MedusaService<
  EntitiesConfig extends EntitiesConfigTemplate = { __empty: any },
  TEntities extends TEntityEntries<
    ExtractKeysFromConfig<EntitiesConfig>
  > = TEntityEntries<ExtractKeysFromConfig<EntitiesConfig>>
>(
  entities: TEntities,
  entityNameToLinkableKeysMap: MapToConfig = {}
): {
  new (...args: any[]): AbstractModuleService<
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

      InjectManager("baseRepository_")(
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

          return await this.baseRepository_.serialize<T>(entities)
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

          return await this.baseRepository_.serialize<T | T[]>(response)
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

          return await this.baseRepository_.serialize<T | T[]>(response)
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

          return await this.baseRepository_.serialize<T[]>(entities)
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

          return [await this.baseRepository_.serialize<T[]>(entities), count]
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
            entities
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

  /**
   * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
   */

  const entitiesMethods: [
    string,
    TEntities[keyof TEntities],
    Record<string, string>
  ][] = Object.entries(entities).map(([name, config]) => [
    name,
    config as TEntities[keyof TEntities],
    buildMethodNamesFromModel(name, config as TEntities[keyof TEntities]),
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
