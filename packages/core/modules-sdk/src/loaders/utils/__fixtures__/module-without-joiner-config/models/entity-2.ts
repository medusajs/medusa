import { Entity, Property } from "@zjedene-medusa/deps/mikro-orm/core"

@Entity()
export class Entity2 {
  @Property({ columnType: "int" })
  id!: number
}
