import {
  Entity,
  BeforeInsert,
  Index,
  Column,
  ManyToOne,
  JoinColumn,
} from "typeorm"
import { ulid } from "ulid"

import { TaxLine } from "./tax-line"
import { ShippingMethod } from "./shipping-method"

@Entity()
export class ShippingMethodTaxLine extends TaxLine {
  @Index()
  @Column()
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, (sm) => sm.tax_lines)
  @JoinColumn({ name: "shipping_method_id" })
  shipping_method: ShippingMethod

  @BeforeInsert()
  private beforeInsert() {
    if (this.id) return
    const id = ulid()
    this.id = `smtl_${id}`
  }
}
