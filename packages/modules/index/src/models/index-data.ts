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
import { IndexRelation } from "./index-relation"

type OptionalRelations = "parents"

@Entity({
  tableName: "index_data",
})
export class IndexData {
  [OptionalProps]: OptionalRelations

  @PrimaryKey({ columnType: "text" })
  @Index({ name: "IDX_index_data_id" })
  id!: string

  @PrimaryKey({ columnType: "text" })
  @Index({ name: "IDX_index_data_name" })
  name: string;

  [PrimaryKeyType]?: [string, string]

  @Index({ name: "IDX_index_data_gin", type: "GIN" })
  @Property({ columnType: "jsonb", default: "{}" })
  data: Record<string, unknown>

  @ManyToMany({
    owner: true,
    entity: () => IndexData,
    pivotEntity: () => IndexRelation,
    cascade: [Cascade.REMOVE],
    inverseJoinColumns: ["parent_id", "parent_name"],
    joinColumns: ["child_id", "child_name"],
  })
  parents = new Collection<IndexData>(this)
}
