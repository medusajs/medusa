import { MedusaModule } from "@medusajs/modules-sdk"
import {
  BaseFilterable,
  DAL,
  FilterQuery,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { lowerCaseFirst, remoteQueryObjectFromString } from "@medusajs/utils"
import {
  CatalogModuleOptions,
  ObjectsPartialTree,
  StorageProvider,
} from "../types"
import { joinerConfig } from "./../joiner-config"

const configMock: CatalogModuleOptions = {
  objects: [
    {
      entity: "Product",
      // Should contain the fields that can be returned and filtered by
      fields: ["id", "title", "subtitle", "description"],
      listeners: ["product.created", "product.updated"],
    },
    {
      parents: ["Product"],
      entity: "ProductVariant",
      // Should contain the fields that can be returned and filtered by
      fields: ["id", "product_id", "sku"],
      listeners: ["variants.created", "variants.updated"],
    },
    {
      parents: ["ProductVariant"],
      entity: "MoneyAmount",
      // Should contain the fields that can be returned and filtered by
      fields: ["id", "amount"], //fields: ["id", "amount", "linkProductVariantMoney.variant_id", "car.id"],
      listeners: ["prices.created", "prices.updated"],
    },
  ],
}

/*const moneyAmount = {
  id,
  variants: [{}],
  car: {},
  metadata: {},
}

storage.create({ name, id, data, parents: [{ name, id }] })
storage.update({ name, id, data })
storage.delete({ name, id, data })
storage.attach
storage.detach*/

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  eventBusModuleService: IEventBusModuleService
  storageProvider: StorageProvider
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export default class CatalogModuleService {
  private static tree_: ObjectsPartialTree = {}

  private readonly container_: InjectedDependencies
  private readonly moduleOptions_: CatalogModuleOptions

  protected readonly baseRepository_: DAL.RepositoryService
  protected readonly eventBusModuleService_: IEventBusModuleService
  protected readonly storageProvider_: StorageProvider

  protected get remoteQuery_(): (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any> {
    return this.container_.remoteQuery
  }

  constructor(
    container: InjectedDependencies,
    protected readonly moduleDeclaration: InternalModuleDeclaration
  ) {
    this.container_ = container
    this.moduleOptions_ =
      moduleDeclaration.options as unknown as CatalogModuleOptions

    const { baseRepository, eventBusModuleService, storageProvider } = container

    this.baseRepository_ = baseRepository
    this.eventBusModuleService_ = eventBusModuleService
    this.storageProvider_ = storageProvider

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the CatalogModule to work"
      )
    }

    if (!this.remoteQuery_) {
      throw new Error("RemoteQuery is required for the CatalogModule to work")
    }

    this.registerListeners()
  }

  __joinerConfig(): ModuleJoinerConfig {
    return joinerConfig
  }

  public query(obj: {
    where: FilterQuery<any> & BaseFilterable<FilterQuery<any>>
    options?: {
      skip?: number
      take?: number
      orderBy?: { [column: string]: "ASC" | "DESC" }
    }
  }) {
    CatalogModuleService.buildObjectsTree(this.moduleOptions_.objects)
    /**
     * The data is stored in the catalog database,
     * they are all in the data column of type JSONB
     * we need to translate the input query to a query that filter from the JSONB column.
     * The end result should be the ordered list of ids that match the query for any type of objects
     */
  }

  protected registerListeners() {
    const objects = this.moduleOptions_.objects ?? []

    for (const { listeners } of objects) {
      listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(
          listener,
          this.storeDataOnEvent(listener)
        )
      })
    }
  }

  protected storeDataOnEvent(eventName: string) {
    return async (data: any) => {
      CatalogModuleService.buildObjectsTree(this.moduleOptions_.objects)

      const eventRelatedEntity = Object.values(CatalogModuleService.tree_).find(
        (object) => {
          return object.listeners.includes(eventName)
        }
      )!

      const ids: string[] = []

      if ("id" in data) {
        ids.push(data.id)
      } else if ("ids" in data && data.ids.length) {
        ids.push(...data.ids)
      }

      if (ids.length === 0) {
        return
      }

      const entryPoint = eventRelatedEntity.alias
      const variables = {
        id: ids,
      }
      const fields = eventRelatedEntity.fields
      const remoteQueryObject = remoteQueryObjectFromString({
        entryPoint,
        variables,
        fields,
      })

      const entries = await this.remoteQuery_(remoteQueryObject)
      // await this.storageProvider_.store([{ entityName, id, data }])
    }
  }

  static buildObjectsTree(objects: CatalogModuleOptions["objects"]) {
    if (Object.keys(this.tree_).length) {
      return this.tree_
    }

    const tree: ObjectsPartialTree = {}

    // initialize tree
    for (const object of objects) {
      tree[object.entity] ??= {
        ...object,
        alias: "",
        __joinerConfig: {},
      }

      if (object.parents) {
        tree[object.entity].parents = object.parents
      }
    }

    const modules = MedusaModule.getLoadedModules()

    const findEntityAlias = (entity: string): string | undefined => {
      let alias

      for (const moduleInstances of modules) {
        for (const moduleInstance of Object.values(moduleInstances)) {
          const moduleJoinerConfig = moduleInstance.__joinerConfig
          const aliases = Array.isArray(moduleJoinerConfig.alias)
            ? moduleJoinerConfig.alias
            : [moduleJoinerConfig.alias]
          const aliasObj = aliases.find(
            (alias_) => alias_!.args?.entity === entity
          )
          if (aliasObj) {
            alias = aliasObj?.name[0]
            break
          }
        }
      }

      return alias
    }

    // Aggregate fields
    for (const object of Object.values(tree)) {
      const entityAlias =
        findEntityAlias(object.entity) ?? lowerCaseFirst(object.entity)
      object.alias = entityAlias as string

      if (object.parents) {
        // Instead attach the parent alias.id field to th object
        // First look for parent module configuration and find out
        // if there is any link relationShip if it is the case
        // then attach the parent linkAlias.entityName_id otherwise parent module alias.id
        /*const composedParentFields = object.fields.map(
          (field) => `${entityAlias}.${field}`
        )
        object.parents.forEach((parent) => {
          tree[parent].fields = [...object.fields, ...composedParentFields]
        })*/
      }
    }

    this.tree_ = tree
    return tree
  }
}
