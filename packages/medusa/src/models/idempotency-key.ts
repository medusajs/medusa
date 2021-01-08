import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import randomize from "randomatic"

@Entity()
export class IdempotencyKey {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  idempotency_key: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @Column({ nullable: true })
  locked_at: Date

  @Column({ type: "string" })
  request_method: string

  @Column({ type: "jsonb" })
  request_params: any

  @Column({ type: "string" })
  request_path: string

  @Column({ type: "number" })
  response_code: number

  @Column({ type: "jsonb" })
  response_body: any

  @Column({ type: "string", default: "started" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `ikey_${id}`
  }
}
