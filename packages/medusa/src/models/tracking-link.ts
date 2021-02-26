import {
  Entity,
  Index,
  BeforeInsert,
  Column,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  ManyToMany,
  JoinColumn,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Fulfillment } from "./fulfillment"

@Entity()
export class TrackingLink {
  @PrimaryColumn()
  id: string

  @Column({ nullable: true })
  url: string

  @Column()
  tracking_number: string

  @Column()
  fulfillment_id: string

  @ManyToOne(
    () => Fulfillment,
    ful => ful.tracking_links
  )
  @JoinColumn({ name: "fulfillment_id" })
  fulfillment: Fulfillment

  @CreateDateColumn({ type: "timestamptz" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamptz" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamptz" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @Column({ nullable: true })
  idempotency_key: string

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `tlink_${id}`
  }
}
