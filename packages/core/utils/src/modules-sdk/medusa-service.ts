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
import { EventArgs } from "@mikro-orm/core"
import {
  camelToSnakeCase,
  lowerCaseFirst,
  mapObjectTo,
  MapToConfig,
  pluralize,
  upperCaseFirst,
} from "../common"
import { DmlEntity } from "../dml"
import { CommonEvents } from "../event-bus"
import { createMedusaMikroOrmEventSubscriber } from "./create-medusa-mikro-orm-event-subscriber"
import { EmitEvents, InjectManager, MedusaContext } from "./decorators"
import { Modules } from "./definition"
import { moduleEventBuilderFactory } from "./event-builder-factory"
import { buildModelsNameToLinkableKeysMap } from "./joiner-config-builder"
import { isMedusaInternalService } from "./medusa-internal-service"
import {
  BaseMethods,
  ExtractKeysFromConfig,
  MedusaServiceReturnType,
  ModelConfigurationsToConfigTemplate,
  ModelEntries,
  ModelsConfigTemplate,
} from "./types/medusa-service"

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
  defaultMethodName: string,
  model: ModelEntries[keyof ModelEntries]
): Record<string, string> {
  return methods.reduce((acc, method) => {
    let normalizedModelName: string = ""

    if (method === "retrieve") {
      normalizedModelName =
        model && "singular" in model && model.singular
          ? model.singular
          : defaultMethodName
    } else {
      normalizedModelName =
        model && "plural" in model && model.plural
          ? model.plural
          : pluralize(defaultMethodName)
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

      // The order of the decorators is important, do not change it
      MedusaContext()(klassPrototype, methodName, contextIndex)
      EmitEvents()(klassPrototype, methodName, descriptorMockRef)
      InjectManager()(klassPrototype, methodName, descriptorMockRef)

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
          const service = this.__container__[serviceRegistrationName]
          const models_ = await service.create(data, sharedContext)

          return await this.baseRepository_.serialize<T | T[]>(models_)
        }

        applyMethod(methodImplementation, 1)

        break
      case "update":
        methodImplementation = async function <T extends object>(
          this: AbstractModuleService_,
          data = [],
          sharedContext: Context = {}
        ): Promise<T | T[]> {
          const service = this.__container__[serviceRegistrationName]
          const response = await service.update(data, sharedContext)

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

          const [, cascadedModelsMap] = await this.__container__[
            serviceRegistrationName
          ].softDelete(primaryKeyValues_, sharedContext)

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

          const [, cascadedModelsMap] = await this.__container__[
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

      const joinerConfig = this.__joinerConfig?.()
      /**
       * Create a global subscriber to listen to all the entities mutations
       * and forward them to the module service interceptEntityMutationEvents
       * method.
       *
       * Assign the global subscriber to all internal services or class that extends it
       * such that it can attach it accordingly and forward the events to the module service.
       */

      if (joinerConfig?.serviceName !== "index") {
        let globalSubscriber!: ReturnType<
          typeof createMedusaMikroOrmEventSubscriber
        >

        Object.keys(container)
          .filter((key) => {
            return key.endsWith("Service")
          })
          .forEach((key: string) => {
            globalSubscriber ??= createMedusaMikroOrmEventSubscriber(
              ["__medusa_entities_subscriber__"],
              this
            )
            try {
              const service = container[key]
              if (isMedusaInternalService(service)) {
                service.setEventSubscriber(globalSubscriber)
              }
            } catch (error) {
              // Prevent circular issue which in that case would represent ourselves so we can skip
            }
          })
      }

      const hasEventBusModuleService = Object.keys(this.__container__).find(
        (key) => key === Modules.EVENT_BUS
      )

      this.eventBusModuleService_ = hasEventBusModuleService
        ? this.__container__[Modules.EVENT_BUS]
        : undefined

      this[MedusaServiceModelNameToLinkableKeysMapSymbol] =
        buildModelsNameToLinkableKeysMap(joinerConfig?.linkableKeys ?? {})
    }

    /**
     * @internal this method is meant to react to any event the orm might emit
     * when an entity is being mutated (created, updated, deleted).
     * The default implementation will handle all event to be emitted as part
     * of the message aggregator from the context.
     *
     * If you want to handle the event differently, you can override this method.
     *
     * @example
     *
     * class MyService extends ModulesSdkUtils.MedusaService(models) {
     *   interceptEntityMutationEvents(event: "afterCreate" | "afterUpdate" | "afterUpsert" | "afterDelete", args: EventArgs<any>, context: Context) {
     *     console.log("interceptEntityMutationEvents", event, args.entity)
     *   }
     * }
     *
     * @param event - The event type
     * @param args - The event arguments
     * @param context - The context
     */
    interceptEntityMutationEvents(
      event: "afterCreate" | "afterUpdate" | "afterUpsert" | "afterDelete",
      args: EventArgs<any>,
      context: Context
    ) {
      let action = ""
      switch (event) {
        case "afterCreate":
          action = CommonEvents.CREATED
          break
        case "afterUpdate":
          const isSoftDeleted =
            !!args.changeSet?.entity.deleted_at &&
            !args.changeSet?.originalEntity?.deleted_at

          const isRestored =
            !!args.changeSet?.originalEntity?.deleted_at &&
            !args.changeSet?.entity.deleted_at

          action = CommonEvents.UPDATED

          if (isSoftDeleted) {
            action = CommonEvents.DELETED
          }

          if (isRestored) {
            action = CommonEvents.RESTORED
          }

          break
        case "afterDelete":
          action = CommonEvents.DELETED
          break
      }

      const object = camelToSnakeCase(args.meta.className).toLowerCase()

      // Resolve the identifier from the model's real primary key rather than
      // assuming an `id` column, so models with a custom (non-id) primary key
      // still emit the correct identifier. `args.meta.primaryKeys` is provided
      // by MikroORM for native events and forwarded manually for the events we
      // dispatch ourselves (e.g. delete, upsert with replace).
      const primaryKey = args.meta.primaryKeys?.[0] ?? "id"

      this.aggregatedEvents({
        action,
        object,
        data: { id: args.entity[primaryKey] ?? args.entity.id },
        context,
      })
    }

    /**
     * helper function to aggregate events. Will format the message properly and store in
     * the message aggregator from the context. The method must be decorated with `@EmitEvents`
     * @param action
     * @param object
     * @param eventName optional, can be inferred from the module joiner config + action + object
     * @param source optional, can be inferred from the module joiner config
     * @param data
     * @param context
     */
    protected aggregatedEvents({
      action,
      object,
      eventName,
      source,
      data,
      context,
    }: {
      action: string
      object: string
      eventName?: string
      source?: string
      data: { id: any } | { id: any }[]
      context: Context
    }) {
      if (!context.messageAggregator) {
        return
      }

      const __joinerConfig = (
        typeof this.__joinerConfig === "function"
          ? this.__joinerConfig()
          : this.__joinerConfig
      ) as ModuleJoinerConfig

      const eventBuilder = moduleEventBuilderFactory({
        action,
        object,
        source: source || __joinerConfig.serviceName!,
        eventName,
      })

      eventBuilder({
        data,
        sharedContext: context,
      })
    }

    /**
     * @internal this method is not meant to be used except by the internal team for now
     * @param groupedEvents
     * @protected
     */
    protected async emitEvents_(groupedEvents) {
      if (!this.eventBusModuleService_ || !groupedEvents) {
        return
      }

      const promises: Promise<void>[] = []
      for (const group of Object.keys(groupedEvents)) {
        promises.push(
          this.eventBusModuleService_.emit(groupedEvents[group], {
            internal: true,
          })
        )
      }

      await Promise.all(promises)
    }
  }

  /**
   * Build the retrieve/list/listAndCount/delete/softDelete/restore methods for all the other models
   */

  const modelsMethods: [
    string, // model name
    TModels[keyof TModels], // configuration (dml, conf, entity)
    Record<string, string> // method names
  ][] = Object.entries(models as {}).map(([name, config]) => [
    DmlEntity.isDmlEntity(config) ? config.name : name,
    config as TModels[keyof TModels],
    buildMethodNamesFromModel(name, config as TModels[keyof TModels]),
  ])

  for (let [modelName, , modelMethods] of modelsMethods) {
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
