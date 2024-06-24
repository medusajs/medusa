import { DateTimeProperty } from "../../properties/date-time"
import { NullableModifier } from "../../properties/nullable"

export type DMLSchemaDefaults = {
  created_at: DateTimeProperty
  updated_at: DateTimeProperty
  deleted_at: NullableModifier<Date, DateTimeProperty>
}

export function createDefaultProperties(): DMLSchemaDefaults {
  return {
    created_at: new DateTimeProperty(),
    updated_at: new DateTimeProperty(),
    deleted_at: new DateTimeProperty().nullable(),
  }
}
