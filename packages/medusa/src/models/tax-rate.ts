import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
} from "typeorm"
import { DbAwareColumn } from "../utils/db-aware-column"

import { Region } from "./region"
import { Product } from "./product"
import { ProductType } from "./product-type"
import { ShippingOption } from "./shipping-option"
import { BaseEntity } from "../interfaces/models/base-entity"
import { generateEntityId } from "../utils/generate-entity-id"

@Entity()
export class TaxRate extends BaseEntity {
  @Column({ type: "real", nullable: true })
  rate: number | null

  @Column({ type: "varchar", nullable: true })
  code: string | null

  @Column()
  name: string

  @Column()
  region_id: string

  @ManyToOne(() => Region)
  @JoinColumn({ name: "region_id" })
  region: Region

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @ManyToMany(() => Product)
  @JoinTable({
    name: "product_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
  })
  products: Product[]

  @ManyToMany(() => ProductType)
  @JoinTable({
    name: "product_type_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "product_type_id",
      referencedColumnName: "id",
    },
  })
  product_types: ProductType[]

  @ManyToMany(() => ShippingOption)
  @JoinTable({
    name: "shipping_tax_rate",
    joinColumn: {
      name: "rate_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "shipping_option_id",
      referencedColumnName: "id",
    },
  })
  shipping_options: ShippingOption[]

  // TODO: consider custom DTO instead
  product_count?: number
  product_type_count?: number
  shipping_option_count?: number

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "txr")
  }
}

/**
 * @schema tax_rate
 * title: "Tax Rate"
 * description: "A Tax Rate can be used to associate a certain rate to charge on products within a given Region"
 * x-resourceId: line_item
 * properties:
 *   id:
 *     description: "The id of the Tax Rate. This value will be prefixed by `txr_`."
 *     type: string
 *   rate:
 *     description: "The numeric rate to charge"
 *     type: number
 *   code:
 *     description: "A code to identify the tax type by"
 *     type: string
 *   name:
 *     description: "A human friendly name for the tax"
 *     type: string
 *   region_id:
 *     description: "The id of the Region that the rate belongs to"
 *     type: string
 *   created_at:
 *     description: "The date with timezone at which the resource was created."
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: "The date with timezone at which the resource was last updated."
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: "An optional key-value map with additional information."
 *     type: object
 *   refundable:
 *     description: "The amount that can be refunded from the given Line Item. Takes taxes and discounts into consideration."
 *     type: integer
 */
