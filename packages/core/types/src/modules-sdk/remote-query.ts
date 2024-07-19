/**
 * The following interface acts as a bucket that other modules or the
 * utils package can fill using declaration merging
 */
export interface RemoteQueryFieldsSchema {}

type Keys<T extends object, ParentPath extends string = ""> = {
  [K in keyof T]: T[K] extends object
    ?
        | Keys<
            T[K],
            `${ParentPath extends "" ? "" : `${ParentPath}.`}${K & string}`
          >
        | `${K & string}.*`
    : `${ParentPath extends "" ? "" : `${ParentPath}.`}${K & string}`
}[keyof T]

type Fields<
  Schema extends object,
  EntryPoint extends string,
  Level extends object = Schema
> = Level extends object
  ? {
      [K in keyof Level]: K extends EntryPoint
        ? Level[K]
        : Level[K] extends object
        ? Fields<Schema, EntryPoint, Level[K]>
        : never
    }[keyof Level]
  : never

export type RemoteQueryEntryPointFields<
  EntryPoint extends string,
  Schema extends object = RemoteQueryFieldsSchema
> = Fields<Schema, EntryPoint> extends object
  ? Keys<Fields<Schema, EntryPoint>>
  : Fields<Schema, EntryPoint> extends never
  ? never
  : string[]
