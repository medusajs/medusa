import {
  Entity,
  Index,
  ManyToOne,
  OptionalProps,
  PrimaryKey,
  Property,
  Ref,
} from "@mikro-orm/core"
import { IndexData } from "./index-data"

type OptionalRelations =
  | "parent"
  | "child"
  | "parent_id"
  | "child_id"
  | "parent_name"
  | "child_name"

@Entity({
  tableName: "index_relation",
})
@Index({
  name: "IDX_index_relation_child_id",
  properties: ["child_id"],
})
export class IndexRelation {
  [OptionalProps]: OptionalRelations

  @PrimaryKey({ columnType: "integer", autoincrement: true })
  id!: string

  // if added as PK, BeforeCreate value isn't set
  @Property({
    columnType: "text",
  })
  pivot: string

  @Property({ columnType: "text" })
  parent_id?: string

  @Property({ columnType: "text" })
  parent_name?: string

  @Property({ columnType: "text" })
  child_id?: string

  @Property({ columnType: "text" })
  child_name?: string

  @ManyToOne({
    entity: () => IndexData,
    onDelete: "cascade",
    persist: false,
  })
  parent?: Ref<IndexData>

  @ManyToOne({
    entity: () => IndexData,
    onDelete: "cascade",
    persist: false,
  })
  child?: Ref<IndexData>
}
