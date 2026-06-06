import {
  Constructor,
  Context,
  FindConfig,
  IDmlEntity,
  InferEntityForModuleService,
  InferEntityType,
  Pluralize,
  Prettify,
  RestoreReturn,
  SoftDeleteReturn,
} from "@zjedene-medusa/types"
import { EventArgs } from "@mikro-orm/core"
import { DmlEntity } from "../../dml"

export type BaseMethods =
  | "retrieve"
  | "list"
  | "listAndCount"
  | "delete"
  | "softDelete"
  | "restore"
  | "create"
  | "update"

export type ModelDTOConfig = {
  dto: object
  model?: DmlEntity<any, any>
  create?: any
  update?: any
}

export type ModelsConfigTemplate = { [key: string]: ModelDTOConfig }

/**
 * We do not want the DML DTO to accept auto-managed timestamps
 * as part of the input for the "create" and the "update"
 * methods
 */
type DMLDTOExcludeProperties = "created_at" | "updated_at" | "deleted_at"

export type ModelConfigurationsToConfigTemplate<T extends ModelEntries> = {
  [Key in keyof T]: {
    dto: T[Key] extends DmlEntity<any, any>
      ? InferEntityType<T[Key]>
      : T[Key] extends Constructor<any>
      ? InstanceType<T[Key]>
      : any
    inputDto: T[Key] extends DmlEntity<any, any>
      ? Omit<InferEntityForModuleService<T[Key]>, DMLDTOExcludeProperties>
      : T[Key] extends Constructor<any>
      ? InstanceType<T[Key]>
      : any
    model: T[Key] extends { model: infer MODEL }
      ? MODEL
      : T[Key] extends IDmlEntity<any, any>
      ? T[Key]
      : never
  }
}

/**
 * @deprecated should all notion of singular and plural be removed once all modules are aligned with the convention
 */
export type ExtractSingularName<
  T extends Record<any, any>,
  K = keyof T
> = Capitalize<
  T[K] extends { singular?: string } ? T[K]["singular"] & string : K & string
>

/**
 * @deprecated should all notion of singular and plural be removed once all modules are aligned with the convention
 * The pluralize will move to where it should be used instead
 */
export type ExtractPluralName<
  T extends Record<any, any>,
  K = keyof T
> = Capitalize<
  T[K] extends {
    plural?: string
  }
    ? T[K]["plural"] & string
    : Pluralize<K & string>
>

// TODO: The future expected entry will be a MODEL object but in the meantime we have to maintain  backward compatibility for ouw own modules and therefore we need to support Constructor<any> as well as this temporary object
export type ModelEntries<Keys = string> = Record<
  Keys & string,
  | DmlEntity<any, any>
  /**
   * @deprecated
   */
  | Constructor<any>
  /**
   * @deprecated
   */
  | { name?: string; singular?: string; plural?: string }
>

/**
 * Returns the input DTO for the servide
 */
type GetServiceInput<ModelConfig extends { dto: any; inputDto?: any }> =
  Partial<
    [undefined] extends ModelConfig["inputDto"]
      ? ModelConfig["dto"]
      : ModelConfig["inputDto"]
  >

export type ExtractKeysFromConfig<ModelsConfig> = ModelsConfig extends {
  __empty: any
}
  ? string
  : keyof ModelsConfig

export type AbstractModuleService<
  TModelsDtoConfig extends Record<string, { dto: any; inputDto?: any }>
> = {
  [TModelName in keyof TModelsDtoConfig as `retrieve${ExtractSingularName<
    TModelsDtoConfig,
    TModelName
  >}`]: (
    id: string,
    config?: FindConfig<TModelsDtoConfig[TModelName]["dto"]>,
    sharedContext?: Context
  ) => Promise<TModelsDtoConfig[TModelName]["dto"]>
} & {
  [TModelName in keyof TModelsDtoConfig as `list${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: (
    filters?: any,
    config?: FindConfig<TModelsDtoConfig[TModelName]["dto"]>,
    sharedContext?: Context
  ) => Promise<TModelsDtoConfig[TModelName]["dto"][]>
} & {
  [TModelName in keyof TModelsDtoConfig as `listAndCount${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      filters?: any,
      config?: FindConfig<TModelsDtoConfig[TModelName]["dto"]>,
      sharedContext?: Context
    ): Promise<[TModelsDtoConfig[TModelName]["dto"][], number]>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `delete${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      primaryKeyValues: string | object | string[] | object[],
      sharedContext?: Context
    ): Promise<void>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `softDelete${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: SoftDeleteReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `restore${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: RestoreReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `create${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      data: Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>,
      ...rest: any[]
    ): Promise<TModelsDtoConfig[TModelName]["dto"]>
    (
      data: Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>[],
      ...rest: any[]
    ): Promise<TModelsDtoConfig[TModelName]["dto"][]>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `update${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      data: Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>,
      ...rest: any[]
    ): Promise<TModelsDtoConfig[TModelName]["dto"]>
    (
      dataOrOptions:
        | Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>[]
        | {
            selector: Record<string, any>
            data:
              | Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>
              | Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>[]
          }
        | {
            selector: Record<string, any>
            data:
              | Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>
              | Prettify<GetServiceInput<TModelsDtoConfig[TModelName]>>[]
          }[],
      ...rest: any[]
    ): Promise<TModelsDtoConfig[TModelName]["dto"][]>
  }
}

// TODO: Because of a bug, those methods were not made visible which now cause issues with the fix as our interface are not consistent with the expectations

// are not consistent accross modules
/* & {
  [TModelName in keyof TModelsDtoConfig as `create${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (data: any[], sharedContext?: Context): Promise<
      TModelsDtoConfig[TModelName]["dto"][]
    >
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `create${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (data: any, sharedContext?: Context): Promise<
      TModelsDtoConfig[TModelName]["dto"][]
    >
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `update${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      data: TModelsDtoConfig[TModelName]["update"][],
      sharedContext?: Context
    ): Promise<TModelsDtoConfig[TModelName]["dto"][]>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `update${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      data: TModelsDtoConfig[TModelName]["update"],
      sharedContext?: Context
    ): Promise<TModelsDtoConfig[TModelName]["dto"]>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `update${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (
      idOrdSelector: any,
      data: TModelsDtoConfig[TModelName]["update"],
      sharedContext?: Context
    ): Promise<TModelsDtoConfig[TModelName]["dto"][]>
  }
}*/

type InferModelFromConfig<T> = {
  [K in keyof T as T[K] extends { model: any }
    ? K
    : K extends IDmlEntity<any, any>
    ? K
    : never]: T[K] extends {
    model: infer MODEL
  }
    ? MODEL extends IDmlEntity<any, any>
      ? MODEL
      : never
    : T[K] extends IDmlEntity<any, any>
    ? T[K]
    : never
}

export type MedusaServiceReturnType<ModelsConfig extends Record<string, any>> =
  {
    new (...args: any[]): AbstractModuleService<ModelsConfig>
    $modelObjects: InferModelFromConfig<ModelsConfig>
    /**
     * helper function to aggregate events. Will format the message properly and store in
     * the message aggregator in the context
     * @param action
     * @param object
     * @param eventName optional, can be inferred from the module joiner config + action + object
     * @param source optional, can be inferred from the module joiner config
     * @param data
     * @param context
     */
    aggregatedEvents({
      action,
      object,
      eventName,
      source,
      data,
      context,
    }: {
      action: string
      object: string
      eventName: string
      source?: string
      data: { id: any } | { id: any }[]
      context: Context
    }): void

    /**
     * this method is meant to react to any event the orm might emit
     * when an entity is being mutated (created, updated, deleted).
     * The default implementation will handle all event to be emitted as part
     * of the message aggregator from the context.
     *
     * If you want to handle the event differently, you can override this method.
     *
     * @param event - The event type
     * @param args - The event arguments
     * @param context - The context
     */
    interceptEntityMutationEvents(
      event: "afterCreate" | "afterUpdate" | "afterUpsert" | "afterDelete",
      args: EventArgs<any>,
      context: Context
    ): void
  }
