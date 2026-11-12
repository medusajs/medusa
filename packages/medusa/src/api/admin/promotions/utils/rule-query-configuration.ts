export type RuleQueryConfiguration = {
  entryPoint: string
  labelAttr: string
  valueAttr: string
  /**
   * Fields to retrieve in addition to the label and value attributes, for
   * use in `formatLabel`.
   */
  extraFields?: string[]
  /**
   * Builds the label from a retrieved row when the label attribute alone
   * can't tell two values apart.
   */
  formatLabel?: (row: Record<string, any>) => string
}

export const ruleQueryConfigurations: Record<string, RuleQueryConfiguration> = {
  region: {
    entryPoint: "region",
    labelAttr: "name",
    valueAttr: "id",
  },
  currency_code: {
    entryPoint: "currency",
    labelAttr: "name",
    valueAttr: "code",
  },
  customer_group: {
    entryPoint: "customer_group",
    labelAttr: "name",
    valueAttr: "id",
  },
  customer: {
    entryPoint: "customer",
    labelAttr: "email",
    valueAttr: "id",
    // A customer's email is only unique per `has_account`, so a customer with
    // an account and one without can share the same email.
    extraFields: ["has_account"],
    formatLabel: (row) =>
      row.has_account ? row.email : `${row.email} (no account)`,
  },
  sales_channel: {
    entryPoint: "sales_channel",
    labelAttr: "name",
    valueAttr: "id",
  },
  country: {
    entryPoint: "country",
    labelAttr: "display_name",
    valueAttr: "iso_2",
  },
  product: {
    entryPoint: "product",
    labelAttr: "title",
    valueAttr: "id",
  },
  product_category: {
    entryPoint: "product_category",
    labelAttr: "name",
    valueAttr: "id",
  },
  product_collection: {
    entryPoint: "product_collection",
    labelAttr: "title",
    valueAttr: "id",
  },
  product_type: {
    entryPoint: "product_type",
    labelAttr: "value",
    valueAttr: "id",
  },
  product_tag: {
    entryPoint: "product_tag",
    labelAttr: "value",
    valueAttr: "id",
  },
  shipping_option_type: {
    entryPoint: "shipping_option_type",
    labelAttr: "label",
    valueAttr: "id",
  },
}

export const getRuleValueFields = (queryConfig: RuleQueryConfiguration) => [
  queryConfig.labelAttr,
  queryConfig.valueAttr,
  ...(queryConfig.extraFields ?? []),
]

export const getRuleValueLabel = (
  queryConfig: RuleQueryConfiguration,
  row: Record<string, any>
): string => queryConfig.formatLabel?.(row) ?? row[queryConfig.labelAttr]
