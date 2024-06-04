import { HttpTypes } from "@medusajs/types"

export const getProductFixture = (
  overrides: Partial<HttpTypes.AdminProduct>
) => ({
  title: "Test fixture",
  description: "test-product-description",
  status: "draft",
  // BREAKING: Images input changed from string[] to {url: string}[]
  images: [{ url: "test-image.png" }, { url: "test-image-2.png" }],
  tags: [{ value: "123" }, { value: "456" }],
  // BREAKING: Options input changed from {title: string}[] to {title: string, values: string[]}[]
  options: [
    { title: "size", values: ["large", "small"] },
    { title: "color", values: ["green"] },
  ],
  variants: [
    {
      title: "Test variant",
      prices: [
        {
          currency_code: "usd",
          amount: 100,
        },
        {
          currency_code: "eur",
          amount: 45,
        },
        {
          currency_code: "dkk",
          amount: 30,
        },
      ],
      // BREAKING: Options input changed from {value: string}[] to {[optionTitle]: optionValue} map
      options: {
        size: "large",
        color: "green",
      },
    },
  ],
  ...(overrides ?? {}),
})
