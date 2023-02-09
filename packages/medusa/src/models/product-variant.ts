import {
  BeforeInsert,
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from "typeorm"

import { DbAwareColumn } from "../utils/db-aware-column"
import { MoneyAmount } from "./money-amount"
import { Product } from "./product"
import { ProductOptionValue } from "./product-option-value"
import { SoftDeletableEntity } from "../interfaces/models/soft-deletable-entity"
import { generateEntityId } from "../utils/generate-entity-id"
import { ProductVariantInventoryItem } from "./product-variant-inventory-item"

@Entity()
export class ProductVariant extends SoftDeletableEntity {
  @Column()
  title: string

  @Index()
  @Column()
  product_id: string

  @ManyToOne(() => Product, (product) => product.variants, { eager: true })
  @JoinColumn({ name: "product_id" })
  product: Product

  @OneToMany(() => MoneyAmount, (ma) => ma.variant, {
    cascade: true,
    onDelete: "CASCADE",
  })
  prices: MoneyAmount[]

  @Column({ nullable: true })
  @Index({ unique: true, where: "deleted_at IS NULL" })
  sku: string

  @Column({ nullable: true })
  @Index({ unique: true, where: "deleted_at IS NULL" })
  barcode: string

  @Column({ nullable: true })
  @Index({ unique: true, where: "deleted_at IS NULL" })
  ean: string

  @Column({ nullable: true })
  @Index({ unique: true, where: "deleted_at IS NULL" })
  upc: string

  @Column({ nullable: true, default: 0, select: false })
  variant_rank: number

  @Column({ type: "int" })
  inventory_quantity: number

  @Column({ default: false })
  allow_backorder: boolean

  @Column({ default: true })
  manage_inventory: boolean

  @Column({ nullable: true })
  hs_code: string

  @Column({ nullable: true })
  origin_country: string

  @Column({ nullable: true })
  mid_code: string

  @Column({ nullable: true })
  material: string

  @Column({ type: "int", nullable: true })
  weight: number

  @Column({ type: "int", nullable: true })
  length: number

  @Column({ type: "int", nullable: true })
  height: number

  @Column({ type: "int", nullable: true })
  width: number

  @OneToMany(() => ProductOptionValue, (optionValue) => optionValue.variant, {
    cascade: true,
  })
  options: ProductOptionValue[]

  @OneToMany(
    () => ProductVariantInventoryItem,
    (inventoryItem) => inventoryItem.variant,
    {
      cascade: ["soft-remove", "remove"],
    }
  )
  inventory_items: ProductVariantInventoryItem[]

  @DbAwareColumn({ type: "jsonb", nullable: true })
  metadata: Record<string, unknown>

  @BeforeInsert()
  private beforeInsert(): void {
    this.id = generateEntityId(this.id, "variant")
  }
}

/**
 * @schema ProductVariant
 * title: "Product Variant"
 * description: "Product Variants represent a Product with a specific set of Product Option configurations. The maximum number of Product Variants that a Product can have is given by the number of available Product Option combinations."
 * type: object
 * required:
 *   - allow_backorder
 *   - barcode
 *   - created_at
 *   - deleted_at
 *   - ean
 *   - height
 *   - hs_code
 *   - id
 *   - inventory_quantity
 *   - length
 *   - manage_inventory
 *   - material
 *   - metadata
 *   - mid_code
 *   - origin_country
 *   - product_id
 *   - sku
 *   - title
 *   - upc
 *   - updated_at
 *   - weight
 *   - width
 * properties:
 *   id:
 *     description: The product variant's ID
 *     type: string
 *     example: variant_01G1G5V2MRX2V3PVSR2WXYPFB6
 *   title:
 *     description: A title that can be displayed for easy identification of the Product Variant.
 *     type: string
 *     example: Small
 *   product_id:
 *     description: The ID of the Product that the Product Variant belongs to.
 *     type: string
 *     example: prod_01G1G5V2MBA328390B5AXJ610F
 *   product:
 *     description: A product object. Available if the relation `product` is expanded.
 *     nullable: true
 *     $ref: "#/components/schemas/Product"
 *   prices:
 *     description: The Money Amounts defined for the Product Variant. Each Money Amount represents a price in a given currency or a price in a specific Region. Available if the relation `prices` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/MoneyAmount"
 *   sku:
 *     description: The unique stock keeping unit used to identify the Product Variant. This will usually be a unqiue identifer for the item that is to be shipped, and can be referenced across multiple systems.
 *     nullable: true
 *     type: string
 *     example: shirt-123
 *   barcode:
 *     description: A generic field for a GTIN number that can be used to identify the Product Variant.
 *     nullable: true
 *     type: string
 *     example: null
 *   ean:
 *     description: An EAN barcode number that can be used to identify the Product Variant.
 *     nullable: true
 *     type: string
 *     example: null
 *   upc:
 *     description: A UPC barcode number that can be used to identify the Product Variant.
 *     nullable: true
 *     type: string
 *     example: null
 *   variant_rank:
 *     description: The ranking of this variant
 *     nullable: true
 *     type: number
 *     default: 0
 *   inventory_quantity:
 *     description: The current quantity of the item that is stocked.
 *     type: integer
 *     example: 100
 *   allow_backorder:
 *     description: Whether the Product Variant should be purchasable when `inventory_quantity` is 0.
 *     type: boolean
 *     default: false
 *   manage_inventory:
 *     description: Whether Medusa should manage inventory for the Product Variant.
 *     type: boolean
 *     default: true
 *   hs_code:
 *     description: The Harmonized System code of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   origin_country:
 *     description: The country in which the Product Variant was produced. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   mid_code:
 *     description: The Manufacturers Identification code that identifies the manufacturer of the Product Variant. May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   material:
 *     description: The material and composition that the Product Variant is made of, May be used by Fulfillment Providers to pass customs information to shipping carriers.
 *     nullable: true
 *     type: string
 *     example: null
 *   weight:
 *     description: The weight of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   length:
 *     description: "The length of the Product Variant. May be used in shipping rate calculations."
 *     nullable: true
 *     type: number
 *     example: null
 *   height:
 *     description: The height of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   width:
 *     description: The width of the Product Variant. May be used in shipping rate calculations.
 *     nullable: true
 *     type: number
 *     example: null
 *   options:
 *     description: The Product Option Values specified for the Product Variant. Available if the relation `options` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductOptionValue"
 *   inventory_items:
 *     description: The Inventory Items related to the product variant. Available if the relation `inventory_items` is expanded.
 *     type: array
 *     items:
 *       $ref: "#/components/schemas/ProductVariantInventoryItem"
 *   created_at:
 *     description: The date with timezone at which the resource was created.
 *     type: string
 *     format: date-time
 *   updated_at:
 *     description: The date with timezone at which the resource was updated.
 *     type: string
 *     format: date-time
 *   deleted_at:
 *     description: The date with timezone at which the resource was deleted.
 *     nullable: true
 *     type: string
 *     format: date-time
 *   metadata:
 *     description: An optional key-value map with additional details
 *     nullable: true
 *     type: object
 *     example: {car: "white"}
 */
