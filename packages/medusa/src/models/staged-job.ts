import { BeforeInsert, Column, Entity, PrimaryColumn } from "typeorm"
import { ulid } from "ulid"
import { DbAwareColumn } from "../utils/db-aware-column"

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
    const id = ulid()
    this.id = `job_${id}`
  }
}
