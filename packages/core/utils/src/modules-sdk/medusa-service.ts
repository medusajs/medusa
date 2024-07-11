/**
 * Utility factory and interfaces for module service public facing API
 */
import {
  Context,
  FindConfig,
  IEventBusModuleService,
  ModuleJoinerConfig,
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
import {
  BaseMethods,
  ExtractKeysFromConfig,
  MedusaServiceReturnType,
  ModelConfigurationsToConfigTemplate,
  ModelEntries,
  ModelsConfigTemplate,
} from "./types/medusa-service"
import { buildModelsNameToLinkableKeysMap } from "./joiner-config-builder"

const readMethods = ["retrieve", "list", "listAndCount"] as BaseMethods[]
const writeMethods = [
  "delete",
  "softDelete",
  "restore",
  "create",
  "update",
] as BaseMethods[]

const methods: BaseMethods[] = [...readMethods, ...writeMethods]

/**
 * @internal
 */
function buildMethodNamesFromModel(
  modelName: string,
  model: ModelEntries[keyof ModelEntries]
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
 * Accessible from the MedusaService, holds the model objects when provided
 */
export const MedusaServiceModelObjectsSymbol = Symbol.for(
  "MedusaServiceModelObjectsSymbol"
)

/**
 * Symbol to mark a class as a Medusa service
 */
export const MedusaServiceSymbol = Symbol.for("MedusaServiceSymbol")

/**
 * Accessible from the MedusaService, holds the model name to linkable keys map
 * to be used for softDelete and restore methods
 */
export const MedusaServiceModelNameToLinkableKeysMapSymbol = Symbol.for(
  "MedusaServiceModelNameToLinkableKeysMapSymbol"
)

/**
 * Check if a value is a Medusa service
 * @param value
 */
export function isMedusaService(
  value: any
): value is MedusaServiceReturnType<any> {
  return value && value?.prototype[MedusaServiceSymbol]
}

/**
 * Factory function for creating an abstract module service
 *
 * @example
 *
 * // Here the DTO's and names will be inferred from the arguments
 *
 * const models = {
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
 * class MyService extends ModulesSdkUtils.MedusaService(models) {}
 *
 * @param models
 */
export function MedusaService<
  const ModelsConfig extends ModelsConfigTemplate = { __empty: any },
  const TModels extends ModelEntries<
    ExtractKeysFromConfig<ModelsConfig>
  > = ModelEntries<ExtractKeysFromConfig<ModelsConfig>>
>(
  models: TModels
): MedusaServiceReturnType<
  ModelsConfig extends { __empty: any }
    ? ModelConfigurationsToConfigTemplate<TModels>
    : ModelsConfig
> {
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
          const models = await this.__container__[
            serviceRegistrationName
          ].retrieve(id, config, sharedContext)

          return await this.baseRepository_.serialize<T>(models)
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
          const models = await service.create(serviceData, sharedContext)
          const response = Array.isArray(data) ? models : models[0]

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
          const models = await service.update(serviceData, sharedContext)
          const response = Array.isArray(data) ? models : models[0]

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
          const models = await service.list(filters, config, sharedContext)

          return await this.baseRepository_.serialize<T[]>(models)
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
          const [models, count] = await this.__container__[
            serviceRegistrationName
          ].listAndCount(filters, config, sharedContext)

          return [await this.baseRepository_.serialize<T[]>(models), count]
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
              metadata: { source: "", action: "", object: "" },
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

          const [models, cascadedModelsMap] = await this.__container__[
            serviceRegistrationName
          ].softDelete(primaryKeyValues_, sharedContext)

          const softDeletedModels = await this.baseRepository_.serialize<T[]>(
            models
          )

          await this.eventBusModuleService_?.emit(
            softDeletedModels.map(({ id }) => ({
              eventName: `${kebabCase(modelName)}.deleted`,
              metadata: { source: "", action: "", object: "" },
              data: { id },
            }))
          )

          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          const mappedCascadedModelsMap = mapObjectTo(
            cascadedModelsMap,
            this[MedusaServiceModelNameToLinkableKeysMapSymbol],
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedModelsMap ? mappedCascadedModelsMap : void 0
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

          const [_, cascadedModelsMap] = await this.__container__[
            serviceRegistrationName
          ].restore(primaryKeyValues_, sharedContext)

          let mappedCascadedModelsMap
          // Map internal table/column names to their respective external linkable keys
          // eg: product.id = product_id, variant.id = variant_id
          mappedCascadedModelsMap = mapObjectTo(
            cascadedModelsMap,
            this[MedusaServiceModelNameToLinkableKeysMapSymbol],
            {
              pick: config.returnLinkableKeys,
            }
          )

          return mappedCascadedModelsMap ? mappedCascadedModelsMap : void 0
        }

        applyMethod(methodImplementation, 2)

        break
    }
  }

  class AbstractModuleService_ {
    [MedusaServiceSymbol] = true

    static [MedusaServiceModelObjectsSymbol] =
      models as unknown as MedusaServiceReturnType<
        ModelsConfig extends { __empty: any }
          ? ModelConfigurationsToConfigTemplate<TModels>
          : ModelsConfig
      >["$modelObjects"];

    [MedusaServiceModelNameToLinkableKeysMapSymbol]: MapToConfig

    readonly __container__: Record<any, any>
    readonly baseRepository_: RepositoryService
    readonly eventBusModuleService_: IEventBusModuleService

    __joinerConfig?(): ModuleJoinerConfig

    constructor(container: Record<any, any>) {
      this.__container__ = container
      this.baseRepository_ = container.baseRepository

      const hasEventBusModuleService = Object.keys(this.__container__).find(
        (key) => key === ModuleRegistrationName.EVENT_BUS
      )

      this.eventBusModuleService_ = hasEventBusModuleService
        ? this.__container__.eventBusModuleService
        : undefined

      this[MedusaServiceModelNameToLinkableKeysMapSymbol] =
        buildModelsNameToLinkableKeysMap(
          this.__joinerConfig?.()?.linkableKeys ?? {}
        )
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

  const modelsMethods: [
    string,
    TModels[keyof TModels],
    Record<string, string>
  ][] = Object.entries(models as {}).map(([name, config]) => [
    name,
    config as TModels[keyof TModels],
    buildMethodNamesFromModel(name, config as TModels[keyof TModels]),
  ])

  for (let [modelName, model, modelMethods] of modelsMethods) {
    Object.entries(modelMethods).forEach(([method, methodName]) => {
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
