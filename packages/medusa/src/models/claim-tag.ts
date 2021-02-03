import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  PrimaryColumn,
  Index,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

@Entity()
export class ClaimTag {
  @PrimaryColumn()
  id: string

  @Index()
  @Column()
  value: string

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
    this.id = `ctag_${id}`
  }
}
