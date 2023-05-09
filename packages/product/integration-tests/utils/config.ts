import { ProductServiceInitializeOptions } from "../../src/types"

export const moduleOptions: ProductServiceInitializeOptions = {
  database: {
    schema: "public",
    clientUrl: "medusa-products-test",
  },
}
