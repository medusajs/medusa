import {
  JoinerArgument,
  JoinerRelationship,
  JoinerServiceConfig,
} from "@medusajs/types"

export type ComputedJoinerRelationship = JoinerRelationship & {
  primaryKeyArr: string[]
  foreignKeyArr: string[]
}

export type InternalJoinerServiceConfig = Omit<
  JoinerServiceConfig,
  "relationships"
> & {
  relationships?: Map<string, JoinerRelationship | JoinerRelationship[]>
  entity?: string
  /**
   * Graph alias used to resolve this service config.
   *
   * @internal
   */
  entryPoint?: string
}

export type ExecutionStage = {
  service: string
  entity?: string
  paths: string[]
  depth: number
}

export interface RemoteNestedExpands {
  [key: string]: {
    fields?: string[]
    args?: JoinerArgument[]
    expands?: RemoteNestedExpands
  }
}

export interface RemoteExpandProperty {
  executionStages?: ExecutionStage[][]
  property: string
  parent: string
  parentConfig?: InternalJoinerServiceConfig
  serviceConfig: InternalJoinerServiceConfig
  entity?: string
  fields?: string[]
  args?: JoinerArgument[]
  expands?: RemoteNestedExpands
}

/** Contract for loading module data during join execution. */
export interface IRemoteDataFetcher {
  fetch(
    expand: RemoteExpandProperty,
    keyField: string,
    ids?: (unknown | unknown[])[],
    relationship?: JoinerRelationship
  ): Promise<{
    data: unknown[] | { [path: string]: unknown }
    path?: string
  }>
}
