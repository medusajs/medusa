const featureFlags = [
  "analytics",
  "order_editing",
  "product_categories",
  "publishable_api_keys",
  "sales_channels",
  "tax_inclusive_pricing",
] as const

type FeatureFlag = (typeof featureFlags)[number]

const modules = ["inventory"] as const

type Module = (typeof modules)[number]

export type Feature = FeatureFlag | Module
