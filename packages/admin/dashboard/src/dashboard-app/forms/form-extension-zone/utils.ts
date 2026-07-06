import { z } from "zod"
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

export function getFieldType(type: z.ZodType): FormFieldType {
  if (type instanceof z.ZodString) {
    return "text"
  }

  if (type instanceof z.ZodNumber) {
    return "number"
  }

  if (type instanceof z.ZodBoolean) {
    return "boolean"
  }

  if (type instanceof z.ZodNullable) {
    const innerType = type.unwrap() as z.ZodType
    return getFieldType(innerType)
  }

  if (type instanceof z.ZodOptional) {
    const innerType = type.unwrap() as z.ZodType
    return getFieldType(innerType)
  }

  if (type instanceof z.ZodPipe) {
    const innerType = type.def.in as z.ZodType
    return getFieldType(innerType)
  }

  return "unsupported"
}

export function getIsFieldOptional(type: z.ZodType) {
  return (
    type instanceof z.ZodOptional ||
    type instanceof z.ZodNull ||
    type instanceof z.ZodUndefined ||
    type instanceof z.ZodNullable
  )
}
