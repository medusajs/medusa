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
import randomize from "randomatic"

import { Image } from "./image"
import { ProductOption } from "./product-option"
import { ProductVariant } from "./product-variant"
import { ShippingProfile } from "./shipping-profile"

@Entity()
export class Product {
  @PrimaryColumn()
  id: string

  @Column()
  title: string

  @Column({ nullable: true })
  subtitle: string

  @Column()
  description: string

  @Column()
  tags: string

  @Index({ unique: true })
  @Column()
  handle: string

  @Column({ default: false })
  is_giftcard: boolean

  @ManyToMany(() => Image)
  @JoinTable({
    name: "product_images",
    joinColumn: {
      name: "product_id",
      referencedColumnName: "id",
    },
    inverseJoinColumn: {
      name: "image_id",
      referencedColumnName: "id",
    },
  })
  images: Image[]

  @Column()
  thumbnail: string

  @OneToMany(
    () => ProductOption,
    productOption => productOption.product
  )
  options: ProductOption[]

  @OneToMany(
    () => ProductVariant,
    variant => variant.product
  )
  variants: ProductVariant[]

  @ManyToOne(() => ShippingProfile)
  @JoinColumn({ name: "profile_id" })
  profile: ShippingProfile

  @Column({ nullable: true })
  hs_code: string

  @Column({ nullable: true })
  origin_country: string

  @Column({ nullable: true })
  mid_code: string

  @Column({ nullable: true })
  material: string

  @CreateDateColumn({ type: "timestamp" })
  created_at: Date

  @UpdateDateColumn({ type: "timestamp" })
  updated_at: Date

  @DeleteDateColumn({ type: "timestamp" })
  deleted_at: Date

  @Column({ type: "jsonb", nullable: true })
  metadata: any

  @BeforeInsert()
  private beforeInsert() {
    const id = randomize("Aa0", 16)
    this.id = `prod_${id}`
  }
}
