import { BeforeCreate, Entity, PrimaryKey } from "@mikro-orm/core"

import { generateEntityId } from "@medusajs/utils"

@Entity({ tableName: "catalog_relation" })
export class CatalogRelation {
  @PrimaryKey({ columnType: "text" })
  id!: string

  //@ManyToMany(() => Catalog, (catalog) => catalog.parents)
  //catalogs: Catalog[]

  @BeforeCreate()
  beforeCreate() {
    this.id = generateEntityId(this.id, "cr_")
  }
}

export default CatalogRelation
