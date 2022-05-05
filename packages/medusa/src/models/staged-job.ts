import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"
import { DbAwareColumn } from "../utils/db-aware-column"
import { generateAndApplyEntityId } from "../utils/generate-and-apply-entity-id"

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
    generateAndApplyEntityId(this, "id", "job")
  }
}
