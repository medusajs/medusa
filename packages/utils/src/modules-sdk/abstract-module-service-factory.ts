/**
 * Utility factory and interfaces for module service public facing API
 */
import {
  Constructor,
  Context,
  FindConfig,
  Pluralize,
  PricingTypes,
  RepositoryService,
} from "@medusajs/types"
import { lowerCaseFirst, pluralize } from "../common"
import { InjectManager } from "./decorators"
import { MedusaContext } from "../decorators"

type BaseMethods =
  | "retrieve"
  | "list"
  | "listAndCount"
  | "delete"
  | "softDelete"
  | "restore"

const methods: BaseMethods[] = [
  "retrieve",
  "list",
  "listAndCount",
  "delete",
  "softDelete",
  "restore",
]

export interface AbstractModuleServiceBase<TContainer, TMainModelDTO> {
  get __container__(): TContainer

  retrieve(
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TMainModelDTO>

  list(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<TMainModelDTO[]>

  listAndCount(
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ): Promise<[TMainModelDTO[], number]>
}

export type AbstractModuleService<
  TContainer,
  TMainModelDTO,
  TOtherModelNamesAndAssociatedDTO extends { [ModelName: string]: object }
> = AbstractModuleServiceBase<TContainer, TMainModelDTO> & {
  [K in keyof TOtherModelNamesAndAssociatedDTO as `retrieve${K & string}`]: (
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TOtherModelNamesAndAssociatedDTO[K & string]>
} & {
  [K in keyof TOtherModelNamesAndAssociatedDTO as `list${Pluralize<
    K & string
  >}`]: (
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TOtherModelNamesAndAssociatedDTO[K & string][]>
} & {
  [K in keyof TOtherModelNamesAndAssociatedDTO as `listAndCount${Pluralize<
    K & string
  >}`]: {
    (filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<
      [TOtherModelNamesAndAssociatedDTO[K & string][], number]
    >
  }
}

export function abstractModuleServiceFactory<
  TContainer,
  TMainModelDTO,
  TOtherModelNamesAndAssociatedDTO extends { [ModelName: string]: object }
>(
  mainModel: Constructor<any>,
  otherModels: Constructor<any>[]
): {
  new (container: TContainer): AbstractModuleService<
    TContainer,
    TMainModelDTO,
    TOtherModelNamesAndAssociatedDTO
  >
} {
  const buildMethodNamesFromModel = (
    model: Constructor<any>,
    suffixed: boolean = true
  ): Record<string, string> => {
    return methods.reduce((acc, method) => {
      const methodName = suffixed ? `${method}${model.name}` : method
      return { ...acc, [method]: methodName }
    }, {})
  }

  const buildAndAssignMethodImpl = function <T extends object>(
    klassPrototype: any,
    method: string,
    methodName: string,
    model: Constructor<any>
  ) {
    switch (method) {
      case "retrieve":
        klassPrototype[methodName] = async function (
          this: AbstractModuleService_,
          id: string,
          config?: FindConfig<any>,
          sharedContext: Context = {}
        ): Promise<T> {
          const serviceRegistrationName = `${lowerCaseFirst(model.name)}Service`
          const entities = await this.__container__[
            serviceRegistrationName
          ].retrieve(id, config, sharedContext)

          return this.baseRepository_.serialize<T>(entities, {
            populate: true,
          })
        }.bind(klassPrototype)

        // Apply MedusaContext decorator
        MedusaContext()(klassPrototype, methodName, 2)

        return InjectManager("baseRepository_")(
          klassPrototype,
          method,
          Object.getOwnPropertyDescriptor(klassPrototype, methodName)!
        )
        break
      case "list":
        klassPrototype[methodName] = async function (
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const serviceRegistrationName = `${lowerCaseFirst(model.name)}Service`
          const entities = await this.__container__[
            serviceRegistrationName
          ].list(filters, config, sharedContext)

          return await this.baseRepository_.serialize<T[]>(entities, {
            populate: true,
          })
        }.bind(klassPrototype)

        // Apply MedusaContext decorator
        MedusaContext()(klassPrototype, methodName, 2)

        return InjectManager("baseRepository_")(
          klassPrototype,
          method,
          Object.getOwnPropertyDescriptor(klassPrototype, methodName)!
        )
        break
      case "listAndCount":
        klassPrototype[methodName] = async function (
          this: AbstractModuleService_,
          filters = {},
          config: FindConfig<any> = {},
          sharedContext: Context = {}
        ): Promise<T[]> {
          const serviceRegistrationName = `${lowerCaseFirst(model.name)}Service`
          const [entities, count] = await this.__container__[
            serviceRegistrationName
          ].listAndCount(filters, config, sharedContext)

          return [
            await this.baseRepository_.serialize<PricingTypes.PriceSetDTO[]>(
              entities,
              {
                populate: true,
              }
            ),
            count,
          ]
        }.bind(klassPrototype)

        // Apply MedusaContext decorator
        MedusaContext()(klassPrototype, methodName, 2)

        return InjectManager("baseRepository_")(
          klassPrototype,
          method,
          Object.getOwnPropertyDescriptor(klassPrototype, methodName)!
        )
        break
      default:
        return function () {
          return void 0
        }
    }
  }

  class AbstractModuleService_ {
    readonly __container__: Record<string, any>
    readonly baseRepository_: RepositoryService;

    [key: string]: any

    constructor(container: Record<string, any>) {
      this.__container__ = container
      this.baseRepository_ = container.baseRepository

      const mainModelMethods = buildMethodNamesFromModel(mainModel, false)

      for (let [method, methodName] of Object.entries(mainModelMethods)) {
        buildAndAssignMethodImpl(this, method, methodName, mainModel)
      }

      const otherModelsMethods: [Constructor<any>, Record<string, string>][] =
        otherModels.map((model) => [model, buildMethodNamesFromModel(model)])

      for (const [model, modelsMethods] of otherModelsMethods) {
        Object.entries(modelsMethods).forEach(([method, methodName]) => {
          methodName =
            method === "retrieve" ? methodName : pluralize(methodName)
          buildAndAssignMethodImpl(this, method, methodName, model)
        })
      }
    }
  }

  return AbstractModuleService_ as unknown as new (
    container: TContainer
  ) => AbstractModuleService<
    TContainer,
    TMainModelDTO,
    TOtherModelNamesAndAssociatedDTO
  >
}
