import { ProductStatus } from "@zjedene-medusa/utils"

export const medusaTshirtProduct = {
  title: "Medusa T-Shirt",
  handle: "t-shirt",
  status: ProductStatus.PUBLISHED,
  options: [
    {
      title: "Size",
      values: ["S"],
    },
    {
      title: "Color",
      values: ["Black", "White"],
    },
  ],
  variants: [
    {
      title: "S / Black",
      sku: "SHIRT-S-BLACK",
      options: {
        Size: "S",
        Color: "Black",
      },
      manage_inventory: false,
      prices: [
        {
          amount: 1500,
          currency_code: "usd",
        },
        {
          amount: 1500,
          currency_code: "eur",
        },
        {
          amount: 1300,
          currency_code: "dkk",
        },
      ],
    },
    {
      title: "S / White",
      sku: "SHIRT-S-WHITE",
      options: {
        Size: "S",
        Color: "White",
      },
      manage_inventory: false,
      prices: [
        {
          amount: 1500,
          currency_code: "usd",
        },
        {
          amount: 1500,
          currency_code: "eur",
        },
        {
          amount: 1300,
          currency_code: "dkk",
        },
      ],
    },
  ],
}
