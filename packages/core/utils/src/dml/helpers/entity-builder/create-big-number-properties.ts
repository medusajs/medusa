import { DMLSchema } from "@medusajs/types"
import { BigNumberProperty } from "../../properties/big-number"
import { JSONProperty } from "../../properties/json"
import { NullableModifier } from "../../properties/nullable"

/**
 * The goal of this type is to look at the schema and see if there are any versions
 * of a bigNumber property (nullable or otherwise) and if any are found, we append new
 * fields of the same property to the type. These fields will be prepended by raw_
 * These fields will be typed to a json property (nullable or otherwise)
 *
 * eg: const test = model.define('test', { amount: model.bigNumber() })
 * test.amount // valid | type = number
 * test.raw_amount // valid | type = Record<string, any>
 */
type DMLSchemaWithBigNumber<T extends DMLSchema> = {
  [K in keyof T]: T[K]
} & {
  [K in keyof T as T[K] extends
    | BigNumberProperty
    | NullableModifier<number, BigNumberProperty>
    ? `raw_${string & K}`
    : never]: T[K] extends NullableModifier<number, BigNumberProperty>
    ? NullableModifier<Record<string, unknown>, JSONProperty>
    : JSONProperty
}

export function createBigNumberProperties<Schema extends DMLSchema>(
  schema: Schema
): DMLSchemaWithBigNumber<Schema> {
  const schemaWithBigNumber: DMLSchema = {}

  for (const [key, property] of Object.entries(schema)) {
    if (
      BigNumberProperty.isBigNumberProperty(property) ||
      NullableModifier.isNullableModifier(property)
    ) {
      const parsed = property.parse(key)

      if (parsed.dataType?.name !== "bigNumber") {
        continue
      }

      const jsonProperty = parsed.nullable
        ? new JSONProperty().nullable()
        : new JSONProperty()

      schemaWithBigNumber[`raw_${key}`] = jsonProperty
    }
  }

  return schemaWithBigNumber as DMLSchemaWithBigNumber<Schema>
}
