import {
  IndexTypes,
  ModuleJoinerConfig,
  ModulesSdkTypes,
  Subscriber,
} from "@medusajs/types"

/**
 * Represents the module options that can be provided
 */
export interface IndexModuleOptions {
  customAdapter?: {
    constructor: new (...args: any[]) => any
    options: any
  }
  defaultAdapterOptions?: ModulesSdkTypes.ModuleServiceInitializeOptions
  schema: string
}

export type SchemaObjectEntityRepresentation = {
  /**
   * The name of the type/entity in the schema
   */
  entity: string

  /**
   * All parents a type/entity refers to in the schema
   * or through links
   */
  parents: {
    /**
     * The reference to the schema object representation
     * of the parent
     */
    ref: SchemaObjectEntityRepresentation

    /**
     * When a link is inferred between two types/entities
     * we are configuring the link tree, and therefore we are
     * storing the reference to the parent type/entity within the
     * schema which defer from the true parent from a pure entity
     * point of view
     */
    inSchemaRef?: SchemaObjectEntityRepresentation

    /**
     * The property the data should be assigned to in the parent
     */
    targetProp: string

    /**
     * Are the data expected to be a list or not
     */
    isList?: boolean
  }[]

  /**
   * The default fields to query for the type/entity
   */
  fields: string[]

  /**
   * @Listerners directive is required and all listeners found
   * for the type will be stored here
   */
  listeners: string[]

  /**
   * The alias for the type/entity retrieved in the corresponding
   * module
   */
  alias: string

  /**
   * The module joiner config corresponding to the module the type/entity
   * refers to
   */
  moduleConfig: ModuleJoinerConfig
}

export type SchemaPropertiesMap = {
  [key: string]: {
    shortCutOf?: string
    ref: SchemaObjectEntityRepresentation
  }
}

export type EntityNameModuleConfigMap = {
  [key: string]: ModuleJoinerConfig
}

/**
 * Represents the schema objects representation once the schema has been processed
 */
export type SchemaObjectRepresentation =
  | {
      [key: string]: SchemaObjectEntityRepresentation
    }
  | {
      _schemaPropertiesMap: SchemaPropertiesMap
      _serviceNameModuleConfigMap: EntityNameModuleConfigMap
    }

export const schemaObjectRepresentationPropertiesToOmit = [
  "_schemaPropertiesMap",
  "_serviceNameModuleConfigMap",
]

/**
 * Represents the storage provider interface,
 */
export interface StorageProvider {
  new (
    container: { [key: string]: any },
    storageProviderOptions: unknown & {
      schemaObjectRepresentation: SchemaObjectRepresentation
    },
    moduleOptions: IndexModuleOptions
  ): StorageProvider

  onApplicationStart?(): Promise<void>

  query<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>
  ): Promise<any[]>

  queryAndCount<const TEntry extends string>(
    config: IndexTypes.IndexQueryConfig<TEntry>
  ): Promise<[any[], number, PerformanceMeasure]>

  consumeEvent(
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  ): Subscriber
}

export type Select = {
  [key: string]: boolean | Select | Select[]
}

export type Where = {
  [key: string]: any
}

export type OrderBy = {
  [path: string]: OrderBy | "ASC" | "DESC" | 1 | -1 | true | false
}

export type QueryFormat = {
  select: Select
  where?: Where
  joinWhere?: Where
}

export type QueryOptions = {
  skip?: number
  take?: number
  orderBy?: OrderBy | OrderBy[]
  keepFilteredEntities?: boolean
}

// Preventing infinite depth
type ResultSetLimit = [never | 0 | 1 | 2]

export type Resultset<Select, Prev extends number = 3> = Prev extends never
  ? never
  : {
      [key in keyof Select]: Select[key] extends boolean
        ? string
        : Select[key] extends Select[]
        ? Resultset<Select[key][0], ResultSetLimit[Prev]>[]
        : Select[key] extends {}
        ? Resultset<Select[key], ResultSetLimit[Prev]>
        : unknown
    }
