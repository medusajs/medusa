import {
  Entity,
  Index,
  JoinColumn,
  BeforeInsert,
  DeleteDateColumn,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Column,
  PrimaryColumn,
} from "typeorm"
import { ulid } from "ulid"

import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"

@Entity()
export class ProductOptionValue {
  @PrimaryColumn()
  id: string

  @Column()
  value: string

  @Index()
  @Column()
  option_id: string

  @ManyToOne(
    () => ProductOption,
    option => option.values
  )
  @JoinColumn({ name: "option_id" })
  option: ProductOption

  @Index()
  @Column()
  variant_id: string

  @ManyToOne(
    () => ProductVariant,
    variant => variant.options
  )
  @JoinColumn({ name: "variant_id" })
  variant: ProductVariant

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
    this.id = `optval_${id}`
  }
}
