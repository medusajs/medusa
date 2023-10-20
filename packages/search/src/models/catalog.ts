import {
  Cascade,
  Collection,
  Entity,
  Index,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core"
import CatalogRelation from "./catalog-relation"

type OptionalRelations = "parents"

@Entity({
  tableName: "catalog",
})
export class Catalog {
  [OptionalProps]: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  @Index({ name: "IDX_catalog_id" })
  id!: string

  @PrimaryKey({ columnType: "text" })
  @Index({ name: "IDX_catalog_name" })
  name: string;

  [PrimaryKeyType]?: [string, string]

  @Index({ name: "IDX_catalog_data_gin", type: "GIN" })
  @Property({ columnType: "jsonb", default: "{}" })
  data: Record<string, unknown>

  @ManyToMany({
    owner: true,
    entity: () => Catalog,
    pivotEntity: () => CatalogRelation,
    cascade: [Cascade.REMOVE],
    inverseJoinColumns: ["parent_id", "parent_name"],
    joinColumns: ["child_id", "child_name"],
  })
  parents = new Collection<Catalog>(this)
}

export default Catalog
