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

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @Column({ nullable: true })
  locked_at: Date

  @Column()
  request_method: string

  @Column({ type: "jsonb" })
  request_params: any

  @Column()
  request_path: string

  @Column()
  response_code: number

  @Column({ type: "jsonb" })
  response_body: any

  @Column({ default: "string" })
  recovery_point: string

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `ikey_${id}`
  }
}
