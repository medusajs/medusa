import { Entity, ManyToOne, PrimaryKey } from "@mikro-orm/core"
import Catalog from "./catalog"

@Entity({ tableName: "catalog_parent" })
export class CatalogParent {
  @PrimaryKey()
  parent_id: string

  @PrimaryKey()
  parent_name: string

  @PrimaryKey()
  child_id: string

  @PrimaryKey()
  child_name: string

  @ManyToOne(() => Catalog, {
    onDelete: "cascade",
  })
  parent: Catalog

  @ManyToOne(() => Catalog, {
    onDelete: "cascade",
  })
  child: Catalog
}

export default CatalogParent
