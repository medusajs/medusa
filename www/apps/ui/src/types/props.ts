import {
  PropDescriptor,
  TSFunctionSignatureType,
  TypeDescriptor,
} from "react-docgen/dist/Documentation"

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

// Keeping this as it's still used by hooks
export type PropType =
  | "string"
  | "number"
  | "boolean"
  | "array"
  | EnumType
  | ObjectType
  | FunctionType
  | string

export type PropData = PropDescriptor

export type PropSpecType = TypeDescriptor<TSFunctionSignatureType>

export type PropDataMap = Record<string, PropData>

// resolve type errors related to
// key with radix components
export type Key = string | number | null | undefined
