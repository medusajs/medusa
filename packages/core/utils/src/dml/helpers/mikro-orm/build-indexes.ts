import { DMLSchema, EntityConstructor, EntityIndex } from "@medusajs/types"
import { MetadataStorage } from "@mikro-orm/core"
import { arrayDifference } from "../../../common"

/*
  The DML should strictly define indexes where the fields provided for the index are 
  already present in the schema definition. If not, we throw an error.
*/
export function validateIndexFields<TSchema extends DMLSchema>(
  MikroORMEntity: EntityConstructor<any>,
  index: EntityIndex<TSchema>
) {
  const fields: string[] = index.on

  if (!fields?.length) {
    throw new Error(
      `"on" is a required property when applying indexes on a DML entity`
    )
  }

  const metaData = MetadataStorage.getMetadataFromDecorator(MikroORMEntity)
  const entityFields: string[] = Object.keys(metaData.properties)
  const invalidFields = arrayDifference(fields, entityFields)

  if (invalidFields.length) {
    throw new Error(
      `Fields (${invalidFields.join(
        ", "
      )}) are not found when applying indexes from DML entity`
    )
  }
}
