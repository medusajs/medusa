import { BeforeCreate, Entity, ManyToMany, PrimaryKey } from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"
import Catalog from "../models/catalog"

@Entity({ tableName: "catalog_relation" })
export class CatalogRelation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @ManyToMany(() => Catalog, (catalog) => catalog.parents)
  catalogs: Catalog[]

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "cr_")
  }
}

export default CatalogRelation
