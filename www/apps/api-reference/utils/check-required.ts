import type { SchemaObject } from "@/types/openapi"

export default function checkRequired(schema: SchemaObject, property?: string) {
  return property !== undefined && schema.required?.includes(property)
}
