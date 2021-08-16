import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"
import { resolveDbType, DbAwareColumn } from "../utils/db-aware-column"

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
  request_params: any

  @Column({ nullable: true })
  request_path: string

  @Column({ type: "int", nullable: true })
  response_code: number

  @DbAwareColumn({ type: "jsonb", nullable: true })
  response_body: any

  @Column({ default: "started" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `ikey_${id}`
  }
}
