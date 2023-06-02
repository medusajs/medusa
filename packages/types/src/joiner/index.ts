export type JoinerRelationship = {
  alias: string
  foreignKey: string
  primaryKey: string
  serviceName: string
  inverse?: boolean // In an inverted relationship the foreign key is on the other service and the primary key is on the current service
}

export interface JoinerServiceConfig {
  serviceName: string
  primaryKeys: string[]
  relationships?: JoinerRelationship[]
  extends?: {
    serviceName: string
    resolve: JoinerRelationship
  }[]
}

export interface JoinerArgument {
  name: string
  value?: any
  field?: string
}

export interface RemoteJoinerQuery {
  service: string
  expands?: Array<{
    property: string
    fields: string[]
    args?: JoinerArgument[]
    relationships?: JoinerRelationship[]
  }>
  fields: string[]
  args?: JoinerArgument[]
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
  serviceConfig: JoinerServiceConfig
  fields: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
}
