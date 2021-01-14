import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class IdempotencyKey {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  idempotency_key: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @Column({ type: "timestamptz", nullable: true })
  locked_at: Date

  @Column({ nullable: true })
  request_method: string

  @Column({ type: "jsonb", nullable: true })
  request_params: any

  @Column({ nullable: true })
  request_path: string

  @Column({ type: "int", nullable: true })
  response_code: number

  @Column({ type: "jsonb", nullable: true })
  response_body: any

  @Column({ default: "started" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert() {
    const id = ulid()
    this.id = `ikey_${id}`
  }
}
