import { IndexQueryConfig, QueryResultSet } from "./query-config"
import { Subscriber } from "../event-bus"
import { SchemaObjectEntityRepresentation } from "./common"

/**
 * Represents the storage provider interface,
 */
export interface StorageProvider {
  /*new (
    container: Record<string, any>,
    options: {
      schemaObjectRepresentation: SchemaObjectRepresentation
      entityMap: Record<string, any>
    },
    moduleOptions: IndexModuleOptions
  )*/

  onApplicationStart?(): Promise<void>

  query<const TEntry extends string>(
    config: IndexQueryConfig<TEntry>
  ): Promise<QueryResultSet<TEntry>>

  consumeEvent(
    schemaEntityObjectRepresentation: SchemaObjectEntityRepresentation
  ): Subscriber<any>
}
