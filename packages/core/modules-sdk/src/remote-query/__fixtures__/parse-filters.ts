import { defineJoinerConfig } from "@medusajs/utils"
import { MedusaModule } from "@medusajs/modules-sdk"

const productJoinerConfig = defineJoinerConfig("product", {
  schema: `
    type Product {
      id: ID
      title: String
      variants: [Variant]
    }

    type Variant {
      id: ID
      sku: String
    }
  `,
  alias: [
    {
      name: ["product"],
      entity: "Product",
      args: {
        methodSuffix: "Products",
      },
    },
    {
      name: ["variant", "variants"],
      entity: "Variant",
      args: {
        methodSuffix: "Variants",
      },
    },
  ],
})

const pricingJoinerConfig = defineJoinerConfig("pricing", {
  schema: `
    type PriceSet {
      prices: [Price]
    }

    type Price {
      amount: Int
    }
  `,
  alias: [
    {
      name: ["price", "prices"],
      entity: "Price",
      args: {
        methodSuffix: "price",
      },
    },
  ],
})

MedusaModule.setJoinerConfig("product", productJoinerConfig)
MedusaModule.setJoinerConfig("pricing", pricingJoinerConfig)
