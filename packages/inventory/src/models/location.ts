import { BeforeInsert, Entity } from "typeorm"
import {
  SoftDeletableEntity,
  DbAwareColumn,
  generateEntityId,
} from "@medusajs/medusa"

@Entity()
export class Location extends SoftDeletableEntity {
  @DbAwareColumn({ type: "text" })
  name: string

  @DbAwareColumn({ type: "text" })
  address_id: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown> | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "loc")
  }
}
