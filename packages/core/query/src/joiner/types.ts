import { JoinerRelationship, RemoteExpandProperty } from "@medusajs/types"

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
