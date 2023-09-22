import { ComponentType, LazyExoticComponent } from "react"

export type EnumType = {
  type: "enum"
  values: (string | number | boolean)[]
}

export type ObjectType = {
  type: "object"
  name: string
  shape: string
}

export type FunctionType = {
  type: "function"
  signature: string
}

export type PropType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | EnumType
  | ObjectType
  | FunctionType
  | string

export type PropData = {
  prop: string
  type: PropType
  defaultValue?: string | number | boolean | null
}

export type PropDataMap = PropData[]

export type PropRegistryItem = {
  table: LazyExoticComponent<ComponentType>
}

// resolve type errors related to
// key with radix components
export type Key = string | number | null | undefined
