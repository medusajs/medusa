import { HttpTypes } from "@medusajs/types"

export const getProductFixture = (
  overrides: Partial<HttpTypes.AdminCreateProduct>
) => ({
  title: "Test fixture",
  description: "test-product-description",
  status: "draft",
  // BREAKING: Images input changed from string[] to {url: string}[]
  images: [{ url: "test-image.png" }, { url: "test-image-2.png" }],
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

export const getPricelistFixture = (overrides: Partial<any>) => {
  return {
    // BREAKING: `name` field was renamed to `title`
    title: "Winter sales",
    description: "Winter sale. 25% off selected items.",
    type: "sale",
    status: "active",
    starts_at: "2022-07-01T00:00:00.000Z",
    ends_at: "2022-07-31T00:00:00.000Z",
    // BREAKING: There is no explicit customer_groups field in v2, we use rules instead
    // BREAKING: Variant ID is required in prices
    // BREAKING: Currency code is required in prices
    prices: [],
    ...overrides,
  }
}
