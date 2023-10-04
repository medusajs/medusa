import {
  BeforeCreate,
  Entity,
  Index,
  PrimaryKey,
  Property,
} from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "catalog" })
export class CatalogRelation {
  // composite primary key id - entity
  // the id and therefore the children ids, should be composed of {entityName}_{id}
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "json", nullable: true })
  @Index({ name: "IDX_catalog_children_ids" })
  children_ids: string[] | null

  @Property({ columnType: "text", nullable: false })
  entity: string

  @Property({ columnType: "jsonb", default: "{}" })
  data: Record<string, unknown>

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "catalog")
  }
}

export default Catalog
