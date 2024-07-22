import {
  Constructor,
  Context,
  FindConfig,
  IDmlEntity,
  InferEntityType,
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

export type ModelsConfigTemplate = { [key: string]: ModelDTOConfig }

export type ModelConfigurationsToConfigTemplate<T extends ModelEntries> = {
  [Key in keyof T]: {
    dto: T[Key] extends DmlEntity<any, any>
      ? InferEntityType<T[Key]>
      : T[Key] extends Constructor<any>
      ? InstanceType<T[Key]>
      : any
    model: T[Key] extends { model: infer MODEL }
      ? MODEL
      : T[Key] extends IDmlEntity<any, any>
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

export type ExtractKeysFromConfig<ModelsConfig> = ModelsConfig extends {
  __empty: any
}
  ? string
  : keyof ModelsConfig

export type AbstractModuleService<
  TModelsDtoConfig extends Record<string, any>
> = {
  [TModelName in keyof TModelsDtoConfig as `retrieve${ExtractSingularName<
    TModelsDtoConfig,
    TModelName
  >}`]: (
    id: string,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TModelsDtoConfig[TModelName]["dto"]>
} & {
  [TModelName in keyof TModelsDtoConfig as `list${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: (
    filters?: any,
    config?: FindConfig<any>,
    sharedContext?: Context
  ) => Promise<TModelsDtoConfig[TModelName]["dto"][]>
} & {
  [TModelName in keyof TModelsDtoConfig as `listAndCount${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (filters?: any, config?: FindConfig<any>, sharedContext?: Context): Promise<
      [TModelsDtoConfig[TModelName]["dto"][], number]
    >
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
    (...args: any[]): Promise<any>
  }
} & {
  [TModelName in keyof TModelsDtoConfig as `update${ExtractPluralName<
    TModelsDtoConfig,
    TModelName
  >}`]: {
    (...args: any[]): Promise<any>
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
  }
