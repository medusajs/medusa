import {
  Cascade,
  Collection,
  Entity,
  ManyToMany,
  OptionalProps,
  PrimaryKey,
  PrimaryKeyType,
  Property,
} from "@mikro-orm/core"
import CatalogParent from "./catalog-parent"

type OptionalRelations = "parents"

@Entity({ tableName: "catalog" })
export class Catalog {
  [OptionalProps]: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  id!: string

  @PrimaryKey({ columnType: "text" })
  name: string;

  [PrimaryKeyType]?: [string, string]

  @Property({ columnType: "jsonb", default: "{}" })
  data: Record<string, unknown>

  @ManyToMany({
    owner: true,
    entity: () => Catalog,
    pivotEntity: () => CatalogParent,
    cascade: [Cascade.REMOVE],
    inverseJoinColumns: ["parent_id", "parent_name"],
    joinColumns: ["child_id", "child_name"],
  })
  parents = new Collection<Catalog>(this)
}

export default Catalog
