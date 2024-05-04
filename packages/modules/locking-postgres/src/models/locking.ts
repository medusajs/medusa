import { Entity, PrimaryKey, Property } from "@mikro-orm/core"

@Entity({ tableName: "locking" })
class Locking {
  @PrimaryKey({ columnType: "text" })
  id!: string

  @Property({ columnType: "text", nullable: true })
  owner_id: string | null = null

  @Property({ columnType: "timestamptz", nullable: true })
  expiration: Date | null = null

  @Property({
    onCreate: () => new Date(),
    columnType: "timestamptz",
    defaultRaw: "now()",
  })
  created_at: Date
}

export default Locking
