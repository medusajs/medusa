import { Entity, PrimaryKey } from "@mikro-orm/core";

@Entity()
export default class ProductVariant {
  @PrimaryKey({ type: "string" })
  id: string
}
