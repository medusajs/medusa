import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Unique,
} from "typeorm"

import { ShippingMethod } from "./shipping-method"
import { TaxLine } from "./tax-line"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
@Unique(["shipping_method_id", "code"])
export class ShippingMethodTaxLine extends TaxLine {
  @Index()
  @Column()
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, (sm) => sm.tax_lines)
  @JoinColumn({ name: "shipping_method_id" })
  shipping_method?: ShippingMethod | null

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "smtl")
  }
}

/**
 * @schema ShippingMethodTaxLine
 * title: "Shipping Method Tax Line"
 * description: "Shipping Method Tax Line"
 * type: object
 * required:
 *   - shipping_method_id
 *   - rate
 *   - name
 * properties:
 *   id:
 *     type: string
 *     description: The line item tax line's ID
 *     example: smtl_01G1G5V2DRX1SK6NQQ8VVX4HQ8
 *   shipping_method_id:
 *     type: string
 *     description: The ID of the line item
 *     example: sm_01F0YET7DR2E7CYVSDHM593QG2
 *   shipping_method:
 *     description: Available if the relation `shipping_method` is expanded.
 *     $ref: "#/components/schemas/ShippingMethod"
 *   code:
 *     description: "A code to identify the tax type by"
 *     type: string
 *     example: tax01
 *   name:
 *     description: "A human friendly name for the tax"
 *     type: string
 *     example: Tax Example
 *   rate:
 *     description: "The numeric rate to charge tax by"
 *     type: number
 *     example: 10
 *   created_at:
 *     type: string
 *     description: "The date with timezone at which the resource was created."
 *     format: date-time
 *   updated_at:
 *     type: string
 *     description: "The date with timezone at which the resource was updated."
 *     format: date-time
 *   metadata:
 *     type: object
 *     description: An optional key-value map with additional details
 *     example: {car: "white"}
 */
