import {
  Entity,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  Column,
  PrimaryColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import randomize from "randomatic"

import { Region } from "./region"

@Entity()
export class GiftCard {
  @PrimaryColumn()
  id: string

  @Index({ unique: true })
  @Column()
  code: string

  @Column("int")
  value: number

  @Column("int")
  balance: number

  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @Column({ default: false })
  is_disabled: boolean

  @Column({
    type: "timestamptz",
    nullable: true,
  })
  ends_at: Date

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
    const id = randomize("Aa0", 16)
    this.id = `gift_${id}`
  }
}
