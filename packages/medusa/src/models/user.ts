import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class User {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  email: string

  @Column({ nullable: true })
  first_name: string

  @Column({ nullable: true })
  last_name: string

  @Column()
  password_hash: string

  @Column({ nullable: true })
  api_token: string

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `usr_${id}`
  }
}
