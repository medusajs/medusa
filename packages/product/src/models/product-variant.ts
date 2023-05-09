import { BeforeCreate, Entity, PrimaryKey, Property } from "@mikro-orm/core"
import { generateEntityId } from "@medusajs/utils"

@Entity()
class ProductVariant {
  @PrimaryKey()
  id!: string

  @Property()
  title: string

  @Property({ nullable: true })
  sku?: string

  @Property({ nullable: true })
  barcode?: string

  @Property({ nullable: true })
  ean?: string

  @Property({ nullable: true })
  upc?: string

  @Property()
  inventory_quantity: number

  @Property({ default: false })
  allow_backorder: boolean

  @Property({ default: true })
  manage_inventory: boolean

  @Property({ nullable: true })
  hs_code?: string

  @Property({ nullable: true })
  origin_country?: string

  @Property({ nullable: true })
  mid_code?: string

  @Property({ nullable: true })
  material?: string

  @Property({ nullable: true })
  weight?: number

  @Property({ nullable: true })
  length?: number

  @Property({ nullable: true })
  height?: number

  @Property({ nullable: true })
  width?: number

  @Property({ nullable: true })
  metadata?: Record<string, unknown>

  @Property({ nullable: true })
  variant_rank?: number

  // TODO: Bring relations back slowly one by one
  // @ManyToOne(() => Product, { onDelete: "cascade" })
  // product!: Product

  // @OneToMany(() => MoneyAmount, (ma) => ma.variant, {
  //   cascade: [ "persist", "remove" ],
  // })
  // prices = new Collection<MoneyAmount>(this)

  // @OneToMany(() => ProductOptionValue, (optionValue) => optionValue.variant, {
  //   cascade: [ "persist", "remove" ],
  // })
  // options = new Collection<ProductOptionValue>(this)

  // @OneToMany(
  //   () => ProductVariantInventoryItem,
  //   (inventoryItem) => inventoryItem.variant,
  //   {
  //     cascade: ["soft-remove", "remove"],
  //   }
  // )
  // inventory_items = new Collection<ProductVariantInventoryItem>(this)

  @BeforeCreate()
  onCreate() {
    this.id = generateEntityId(this.id, "variant")
  }
}

export default ProductVariant
