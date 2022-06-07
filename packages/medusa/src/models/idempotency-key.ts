import {
  BeforeInsert,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryColumn,
} from "typeorm"
import { DbAwareColumn, resolveDbType } from "../utils/db-aware-column"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class IdempotencyKey {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  idempotency_key: string

  @CreateDateColumn({ type: resolveDbType("timestamptz") })
  created_at: Date

  @DbAwareColumn({ type: "timestamptz", nullable: true })
  locked_at: Date

  @Column({ nullable: true })
  request_method: string

  @DbAwareColumn({ type: "jsonb", nullable: true })
  request_params: Record<string, unknown>

  @Column({ nullable: true })
  request_path: string

  @Column({ type: "int", nullable: true })
  response_code: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  response_body: Record<string, unknown>

  @Column({ default: "started" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "ikey")
  }
}
