import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class StagedJob {
  @PrimaryColumn()
  id: string

  @Column()
  event_name: string

  @DbAwareColumn({ type: "jsonb" })
  data: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "job")
  }
}
