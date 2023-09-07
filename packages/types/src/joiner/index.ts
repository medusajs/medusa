export type JoinerRelationship = {
  alias: string
  foreignKey: string
  primaryKey: string
  serviceName: string
  inverse?: boolean // In an inverted relationship the foreign key is on the other service and the primary key is on the current service
  isList?: boolean // Force the relationship to return a list
  args?: Record<string, any> // Extra arguments to pass to the remoteFetchData callback
}

export interface JoinerServiceConfigAlias {
  name: string
  args?: Record<string, any> // Extra arguments to pass to the remoteFetchData callback
}

export interface JoinerServiceConfig {
  serviceName: string
  alias?: JoinerServiceConfigAlias | JoinerServiceConfigAlias[] // Property name to use as entrypoint to the service
  primaryKeys: string[]
  relationships?: JoinerRelationship[]
  extends?: {
    serviceName: string
    relationship: JoinerRelationship
  }[]
  args?: Record<string, any> // Extra arguments to pass to the remoteFetchData callback
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

export interface RemoteNestedExpands {
  [key: string]: {
    fields: string[]
    args?: JoinerArgument[]
    expands?: RemoteNestedExpands
  }
}

export interface RemoteExpandProperty {
  property: string
  parent: string
  parentConfig?: JoinerServiceConfig
  serviceConfig: JoinerServiceConfig
  fields: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
}
