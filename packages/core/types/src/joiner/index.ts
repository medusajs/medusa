export type JoinerRelationship = {
  alias: string
  foreignKey: string
  primaryKey: string
  serviceName: string
  /**
   * In an inverted relationship the foreign key is on the other service and the primary key is on the current service
   */
  inverse?: boolean
  /**
   * Force the relationship to return a list
   */
  isList?: boolean
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export interface JoinerServiceConfigAlias {
  name: string | string[]
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export interface JoinerServiceConfig {
  serviceName: string
  /**
   * Property name to use as entrypoint to the service
   */
  alias?: JoinerServiceConfigAlias | JoinerServiceConfigAlias[]
  /**
   * alias for deeper nested relationships (e.g. { 'price': 'prices.calculated_price_set.amount' })
   */
  fieldAlias?: Record<
    string,
    | string
    | {
        path: string
        forwardArgumentsOnPath: string[]
      }
  >
  primaryKeys: string[]
  relationships?: JoinerRelationship[]
  extends?: {
    serviceName: string
    relationship: JoinerRelationship
  }[]
  /**
   * Extra arguments to pass to the remoteFetchData callback
   */
  args?: Record<string, any>
}

export interface JoinerArgument {
  name: string
  value?: any
}

export interface JoinerDirective {
  name: string
  value?: any
}

export interface RemoteJoinerQuery {
  service?: string
  alias?: string
  expands?: Array<{
    property: string
    fields: string[]
    args?: JoinerArgument[]
    directives?: { [field: string]: JoinerDirective[] }
  }>
  fields: string[]
  args?: JoinerArgument[]
  directives?: { [field: string]: JoinerDirective[] }
}

export interface RemoteJoinerOptions {
  throwIfKeyNotFound?: boolean
  throwIfRelationNotFound?: boolean | string[]
}

export interface RemoteNestedExpands {
  [key: string]: {
    fields?: string[]
    args?: JoinerArgument[]
    expands?: RemoteNestedExpands
  }
}

export type InternalJoinerServiceConfig = Omit<
  JoinerServiceConfig,
  "relationships"
> & {
  relationships?: Map<string, JoinerRelationship>
}

export interface RemoteExpandProperty {
  property: string
  parent: string
  parentConfig?: InternalJoinerServiceConfig
  serviceConfig: InternalJoinerServiceConfig
  fields?: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
}
