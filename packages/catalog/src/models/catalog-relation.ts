import { BeforeCreate, Entity, PrimaryKey, Property } from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "catalog_relation" })
export class CatalogRelation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text" })
  parent_id: string

  @Property({ columnType: "text" })
  parent_name: string

  @Property({ columnType: "text" })
  child_id: string

  @Property({ columnType: "text" })
  child_name: string

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "cr_")
  }
}

export default CatalogRelation
