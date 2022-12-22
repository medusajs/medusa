import { Product } from "@medusajs/medusa"
import { ComponentMeta, ComponentStory } from "@storybook/react"
import React from "react"
import ProductVariantTree from "."

export default {
  title: "Organisms/ProductVariantTree",
  component: ProductVariantTree,
} as ComponentMeta<typeof ProductVariantTree>

const Template: ComponentStory<typeof ProductVariantTree> = (args) => (
  <div className="max-w-md">
    <ProductVariantTree {...args} />
  </div>
)
const testProduct: Pick<Product, "title" | "id" | "thumbnail"> & {
  variants: {
    id: string
    title: string
    sku: string
    prices: {
      id: string
      currency_code: string
      amount: number
    }[]
  }[]
} = {
  id: "prod_01FY6FS3VB39G5GPB75S7RYQW6",
  title: "Medusa Sweatshirt",
  thumbnail:
    "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
  variants: [
    {
      id: "variant_01FY6FS3VWFWNQF8WSP130F3TX",
      title: "BLACK / S",
      sku: "MEDUSA-S",
      prices: [
        {
          id: "ma_01FY6FS3VZ7C0NHWMYA243KQXV",
          currency_code: "eur",
          amount: 2950,
        },
        {
          id: "ma_01FY6FS3W11805101BYBDQPJMP",
          currency_code: "usd",
          amount: 3350,
        },
      ],
    },
    {
      id: "variant_01FY6FS3WAJJRHAW5J901Y8YM9",
      title: "BLACK / M",
      sku: "MEDUSA-M",
      prices: [
        {
          id: "ma_01FY6FS3WD3928VCK53ZQ3NSD7",
          currency_code: "eur",
          amount: 2950,
        },
      ],
    },
    {
      id: "variant_01FY6FS3WT9EN0GVGWDPCBTWZR",
      title: "BLACK / L",
      sku: "MEDUSA-L",
      prices: [
        {
          id: "ma_01FY6FS3WYWP598C6SNX5AM6WY",
          currency_code: "eur",
          amount: 2950,
        },
        {
          id: "ma_01FY6FS3X049QNK54Q7MAJH0FH",
          currency_code: "usd",
          amount: 3350,
        },
        {
          id: "ma_01FY6FS3X049QNK54Q7MAJH0FH",
          currency_code: "usd",
          amount: 3350,
        },
      ],
    },
    {
      id: "variant_01FY6FS3XBQ64A4TBX0N8NGZZK",
      title: "BLACK / XL",
      sku: "MEDUSA-XL",
      prices: [],
    },
  ],
}

export const Default = Template.bind({})
Default.args = {
  product: testProduct,
}
