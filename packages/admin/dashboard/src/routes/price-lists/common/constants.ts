/**
 * Re-implementation of enum from `@zjedene-medusa/medusa` as it cannot be imported
 */
export enum PriceListStatus {
  ACTIVE = "active",
  DRAFT = "draft",
}

export enum PriceListDateStatus {
  SCHEDULED = "scheduled",
  EXPIRED = "expired",
}

/**
 * Re-implementation of enum from `@zjedene-medusa/medusa` as it cannot be imported
 */
export enum PriceListType {
  SALE = "sale",
  OVERRIDE = "override",
}
