import {
  ZodBoolean,
  ZodEffects,
  ZodNull,
  ZodNullable,
  ZodNumber,
  ZodOptional,
  ZodString,
  ZodType,
  ZodUndefined,
} from "zod"
import { FormFieldType } from "./types"

export function getFieldLabel(name: string, label?: string) {
  if (label) {
    return label
  }

  return name
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")
}

export function getFieldType(type: ZodType): FormFieldType {
  if (type instanceof ZodString) {
    return "text"
  }

  if (type instanceof ZodNumber) {
    return "number"
  }

  if (type instanceof ZodBoolean) {
    return "boolean"
  }

  if (type instanceof ZodNullable) {
    const innerType = type.unwrap()

    return getFieldType(innerType)
  }

  if (type instanceof ZodOptional) {
    const innerType = type.unwrap()

    return getFieldType(innerType)
  }

  if (type instanceof ZodEffects) {
    const innerType = type.innerType()

    return getFieldType(innerType)
  }

  return "unsupported"
}

export function getIsFieldOptional(type: ZodType) {
  return (
    type instanceof ZodOptional ||
    type instanceof ZodNull ||
    type instanceof ZodUndefined ||
    type instanceof ZodNullable
  )
}
