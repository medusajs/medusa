import { DmlEntity, toMikroORMEntity } from "@medusajs/utils"
import * as entities from "./src/models"

const mikroORMEntities = Object.values(entities).map((entity) =>
  DmlEntity.isDmlEntity(entity) ? toMikroORMEntity(entity) : entity
)

module.exports = {
  entities: mikroORMEntities,
  schema: "public",
  clientUrl: "postgres://postgres@localhost/medusa-currency",
  type: "postgresql",
}
