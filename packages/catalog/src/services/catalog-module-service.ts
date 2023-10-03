import {
  BaseFilterable,
  DAL,
  FilterQuery,
  IEventBusModuleService,
  InternalModuleDeclaration,
  ModuleJoinerConfig,
  RemoteJoinerQuery,
} from "@medusajs/types"
import { joinerConfig } from "./../joiner-config"
import { MedusaModule } from "@medusajs/modules-sdk"

type Config = {
  adapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  objects: {
    parents?: string[]
    entity: string
    fields: string[]
    listeners: string[]
  }[]
}

type Tree = {
  [key: string]: {
    parents?: string[]
    alias: string
    entity: string
    fields: string[]
    listeners: string[]
  }
}

const configMock: Config = {
  objects: [
    {
      entity: "Product",
      // Should contain the fields that can be returned and filtered by
      fields: [
        "id",
        "title",
        "subtitle",
        "description",
        // temp, in reality we will infer this by building a tree
        // from the objects which will auto concatenate the relations to the parent
        "variants.id",
        "variants.prices.id",
        "variants.options.id",
      ],
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
      fields: ["id", "amount"],
      listeners: ["prices.created", "prices.updated"],
    },
  ],
}

type InjectedDependencies = {
  baseRepository: DAL.RepositoryService
  eventBusModuleService: IEventBusModuleService
  remoteQuery: (
    query: string | RemoteJoinerQuery | object,
    variables?: Record<string, unknown>
  ) => Promise<any>
}

export default class CatalogModuleService {
  private static tree_: Tree

  private readonly container_: InjectedDependencies
  private readonly moduleConfig_: Config

  protected readonly baseRepository_: DAL.RepositoryService
  protected readonly eventBusModuleService_: IEventBusModuleService

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
    this.moduleConfig_ = moduleDeclaration.options as Config

    const { baseRepository, eventBusModuleService } = container
    this.baseRepository_ = baseRepository
    this.eventBusModuleService_ = eventBusModuleService

    if (!this.eventBusModuleService_) {
      throw new Error(
        "EventBusModuleService is required for the CatalogModule to work"
      )
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
    CatalogModuleService.buildObjectsTree(this.moduleConfig_.objects)
    /**
     * The data is stored in the catalog database,
     * they are all in the data column of type JSONB
     * we need to translate the input query to a query that filter from the JSONB column.
     * The end result should be the ordered list of ids that match the query for any type of objects
     */
  }

  protected registerListeners() {
    const objects = this.moduleConfig_.objects ?? []

    for (const { listeners, ...objectConfig } of objects) {
      listeners.forEach((listener) => {
        this.eventBusModuleService_.subscribe(
          listener,
          this.storeDataOnEvent(objectConfig)
        )
      })
    }
  }

  protected storeDataOnEvent(
    objectConfig: Omit<Config["objects"][0], "listeners">
  ) {
    return async (data: any) => {
      CatalogModuleService.buildObjectsTree(this.moduleConfig_.objects)

      const ids: string[] = []

      if ("id" in data) {
        ids.push(data.id)
      } else if ("ids" in data && data.ids.length) {
        ids.push(...data.ids)
      }

      if (ids.length === 0) {
        return
      }

      // Retrieve fields from tree and build remote query object
      /*const entryPoint = ""
      const query = stringToRemoteQueryObject({
        entryPoint,
        variables: {
          id: ids,
        },
        fields: targetObject.fields,
      })*/

      // const result = await this.remoteQuery_(query)

      // Insert data in the catalog database
      // INSERT INTO catalog (type, data) VALUES ('products', '{"id": 1, "title": "Product 1"}')
    }
  }

  protected static buildObjectsTree(objects: Config["objects"]) {
    if (Object.keys(this.tree_).length) {
      return
    }

    const tree: Tree = {}

    // initialize tree
    for (const object of objects) {
      tree[object.entity] ??= {
        ...object,
        alias: "",
      }

      if (object.parents) {
        object.parents.forEach((parent) => {
          tree[object.entity].parents = object.parents
        })
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
          const aliasObj = aliases.find((alias_) => alias_!.entity === entity)
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
      const entityAlias = findEntityAlias(object.entity)
      object.alias = entityAlias as string

      if (object.parents) {
        const composedParentFields = object.fields.map(
          (field) => `${entityAlias}.${field}`
        )
        object.parents.forEach((parent) => {
          tree[parent].fields = [...object.fields, ...composedParentFields]
        })
      }
    }

    this.tree_ = tree
  }
}
