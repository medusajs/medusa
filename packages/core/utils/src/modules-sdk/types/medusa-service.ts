import {
  Constructor,
  Context,
  FindConfig,
  Pluralize,
  RestoreReturn,
  SoftDeleteReturn,
} from "@medusajs/types"
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
    model: T[Key] extends { model: infer MODEL }
      ? MODEL
      : T[Key] extends DmlEntity<any, any>
      ? T[Key]
      : never
    /**
     * @deprecated
     */
    create: any
    update: any
    /**
     * @deprecated
     */
    singular: T[Key] extends { singular: string } ? T[Key]["singular"] : Key
    /**
     * @deprecated
     */
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

// TODO: The future expected entry will be a MODEL object but in the meantime we have to maintain  backward compatibility for ouw own modules and therefore we need to support Constructor<any> as well as this temporary object
export type TEntityEntries<Keys = string> = Record<
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

type InferModelFromConfig<T> = {
  [K in keyof T as T[K] extends { model: any }
    ? K
    : K extends DmlEntity<any, any>
    ? K
    : never]: T[K] extends {
    model: infer MODEL
  }
    ? MODEL extends DmlEntity<any, any>
      ? MODEL
      : never
    : T[K] extends DmlEntity<any, any>
    ? T[K]
    : never
}

export type MedusaServiceReturnType<ModelsConfig extends Record<any, any>> = {
  new (...args: any[]): AbstractModuleService<ModelsConfig>
  $modelObjects: InferModelFromConfig<ModelsConfig>[keyof InferModelFromConfig<ModelsConfig>][]
}
