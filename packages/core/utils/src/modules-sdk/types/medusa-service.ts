import { DmlEntity } from "../../dml"
import {
  Constructor,
  Context,
  FindConfig,
  Pluralize,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"

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
  dml?: DmlEntity<any>
  create?: any
  update?: any
  /**
   * @internal
   * @deprecated
   */
  singular?: string
  /**
   * @internal
   * @deprecated
   */
  plural?: string
}

export type EntitiesConfigTemplate = { [key: string]: ModelDTOConfig }

export type ModelConfigurationsToConfigTemplate<T extends TEntityEntries> = {
  [Key in keyof T]: {
    dto: T[Key] extends Constructor<any> ? InstanceType<T[Key]> : any
    dml: T[Key] extends { dml: infer DML } ? DML : never
    create: any
    update: any
    singular: T[Key] extends { singular: string } ? T[Key]["singular"] : Key
    plural: T[Key] extends { plural: string }
      ? T[Key]["plural"]
      : Pluralize<Key & string>
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

// TODO: The future expected entry will be a DML object but in the meantime we have to maintain  backward compatibility for ouw own modules and therefore we need to support Constructor<any> as well as this temporary object
export type TEntityEntries<Keys = string> = Record<
  Keys & string,
  | Constructor<any>
  | DmlEntity<any>
  | { name?: string; singular?: string; plural?: string }
>

export type ExtractKeysFromConfig<EntitiesConfig> = EntitiesConfig extends {
  __empty: any
}
  ? string
  : keyof EntitiesConfig

export type AbstractModuleService<
  TEntitiesDtoConfig extends Record<string, any>
> = {
  [TEntityName in keyof TEntitiesDtoConfig as `retrieve${ExtractSingularName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: (
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TEntitiesDtoConfig[TEntityName]["dto"]>
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `list${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: (
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `listAndCount${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<
      [TEntitiesDtoConfig[TEntityName]["dto"][], number]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `delete${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      primaryKeyValues: string | object | string[] | object[],
      sharedContext?: Context
    ): Promise<void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `softDelete${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: SoftDeleteReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `restore${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    <TReturnableLinkableKeys extends string>(
      primaryKeyValues: string | object | string[] | object[],
      config?: RestoreReturn<TReturnableLinkableKeys>,
      sharedContext?: Context
    ): Promise<Record<string, string[]> | void>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (...args: any[]): Promise<any>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (...args: any[]): Promise<any>
  }
}

// TODO: Because of a bug, those methods were not made visible which now cause issues with the fix as our interface are not consistent with the expectations

// are not consistent accross modules
/* & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (data: any[], sharedContext?: Context): Promise<
      TEntitiesDtoConfig[TEntityName]["dto"][]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `create${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (data: any, sharedContext?: Context): Promise<
      TEntitiesDtoConfig[TEntityName]["dto"][]
    >
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      data: TEntitiesDtoConfig[TEntityName]["update"][],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      data: TEntitiesDtoConfig[TEntityName]["update"],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"]>
  }
} & {
  [TEntityName in keyof TEntitiesDtoConfig as `update${ExtractPluralName<
    TEntitiesDtoConfig,
    TEntityName
  >}`]: {
    (
      idOrdSelector: any,
      data: TEntitiesDtoConfig[TEntityName]["update"],
      sharedContext?: Context
    ): Promise<TEntitiesDtoConfig[TEntityName]["dto"][]>
  }
}*/

// TODO: rework that so the links are properly typed and used in the module exports.
// For now lets focus on the runtime part, please do not touch too much this part :)
type InferDmlFromConfig<T> = {
  [K in keyof T as T[K] extends { dml: any }
    ? K
    : K extends DmlEntity<any>
    ? K
    : never]: T[K] extends {
    dml: infer DML
  }
    ? DML extends DmlEntity<infer Schema>
      ? DmlEntity<Schema>
      : never
    : T[K] extends DmlEntity<any>
    ? T[K]
    : never
}

export type MedusaServiceReturnType<
  EntitiesConfig extends Record<string, any>
> = {
  new (...args: any[]): AbstractModuleService<EntitiesConfig>
  $dmlObjects: InferDmlFromConfig<EntitiesConfig>[keyof InferDmlFromConfig<EntitiesConfig>]
}
