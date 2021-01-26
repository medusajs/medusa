import {
  Entity,
  BeforeInsert,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  Index,
  Column,
  PrimaryColumn,
  OneToOne,
  ManyToMany,
  JoinTable,
} from "typeorm"
import { ulid } from "ulid"

import { Product } from "./product"

export enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

export enum AllocationType {
  TOTAL = "total",
  ITEM = "item",
}

@Entity()
export class DiscountRule {
  @PrimaryColumn()
  id: string

  @Column()
  description: string

  @Column({
    type: "enum",
    enum: DiscountRuleType,
  })
  type: DiscountRuleType

  @Column()
  value: number

  @Column({
    type: "enum",
    enum: AllocationType,
    nullable: true,
  })
  allocation: AllocationType

  @ManyToMany(() => Product, { cascade: true })
  @JoinTable({
    name: "discount_rule_products",
    joinColumn: {
      name: "discount_rule_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  valid_for: Product[]

  @Column({ nullable: true })
  usage_limit: number

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
    const id = ulid()
    this.id = `dru_${id}`
  }
}
