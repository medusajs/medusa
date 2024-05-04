import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
  Unique,
} from "typeorm"

import { generateEntityId } from "../utils/generate-entity-id"
import { ShippingMethod } from "./shipping-method"
import { TaxLine } from "./tax-line"

@Entity()
@Unique(["shipping_method_id", "code"])
export class ShippingMethodTaxLine extends TaxLine {
  @Index()
  @Column()
  shipping_method_id: string

  @ManyToOne(() => ShippingMethod, (sm) => sm.tax_lines)
  @JoinColumn({ name: "shipping_method_id" })
  shipping_method: Relation<ShippingMethod>

  /**
   * @apiIgnore
   */
  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "smtl")
  }
}

/**
 * @schema ShippingMethodTaxLine
 * title: "Shipping Method Tax Line"
 * description: "A Shipping Method Tax Line represents the taxes applied on a shipping method in a cart."
 * type: object
 * required:
 *   - code
 *   - created_at
 *   - id
 *   - shipping_method_id
 *   - metadata
 *   - name
 *   - rate
 *   - updated_at
 * properties:
 *   id:
 *     description: The line item tax line's ID
 *     type: string
 *     example: smtl_01G1G5V2DRX1SK6NQQ8VVX4HQ8
 *   code:
 *     description: A code to identify the tax type by
 *     nullable: true
 *     type: string
 *     example: tax01
 *   name:
 *     description: A human friendly name for the tax
 *     type: string
 *     example: Tax Example
 *   rate:
 *     description: "The numeric rate to charge tax by"
 *     type: number
 *     example: 10
 *   shipping_method_id:
 *     description: The ID of the line item
 *     type: string
 *     example: sm_01F0YET7DR2E7CYVSDHM593QG2
 *   shipping_method:
 *     description: The details of the associated shipping method.
 *     x-expandable: "shipping_method"
 *     nullable: true
 *     $ref: "#/components/schemas/ShippingMethod"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 *     externalDocs:
 *       description: "Learn about the metadata attribute, and how to delete and update it."
 *       url: "https://docs.medusajs.com/development/entities/overview#metadata-attribute"
 */
