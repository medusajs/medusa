import { Entity, Property } from "@zjedene-medusa/deps/mikro-orm/core"

@Entity()
export class EntityModel {
  @Property({ columnType: "int" })
  id!: number
}
