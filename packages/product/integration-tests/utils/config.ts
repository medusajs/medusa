import { ProductServiceInitializeOptions } from "../../src/types"

export const databaseOptions: ProductServiceInitializeOptions["database"] = {
  schema: "public",
  clientUrl: "medusa-products-test",
}
