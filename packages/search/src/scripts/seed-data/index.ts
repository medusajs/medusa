// ESM
import { faker } from "@faker-js/faker"
import { Catalog, CatalogRelation } from "@models"

export function createRandomEntries(): {
  catalogEntries: Catalog[]
  catalogRelationEntries: CatalogRelation[]
} {
  const productId = faker.string.uuid()
  const variantId = faker.string.uuid()
  const linkProductPriceSetId = faker.string.uuid()
  const PriceSet = faker.string.uuid()
  const MoneyAmount = faker.string.uuid()

  const productEntry = new Catalog()
  productEntry.id = productId
  productEntry.name = "Product"
  productEntry.data = {
    id: productId,
    title: faker.commerce.productName(),
  }

  const variantEntry = new Catalog()
  variantEntry.id = variantId
  variantEntry.name = "ProductVariant"
  variantEntry.data = {
    id: variantId,
    title: faker.commerce.productName(),
    product_id: productId,
    sku: faker.commerce.productName(),
  }

  const linkProductPriceSetEntry = new Catalog()
  linkProductPriceSetEntry.id = linkProductPriceSetId
  linkProductPriceSetEntry.name = "LinkProductVariantPriceSet"
  linkProductPriceSetEntry.data = {
    id: linkProductPriceSetId,
    variant_id: variantId,
    price_set_id: PriceSet,
  }

  const priceSetEntry = new Catalog()
  priceSetEntry.id = PriceSet
  priceSetEntry.name = "PriceSet"
  priceSetEntry.data = {
    id: PriceSet,
  }

  const moneyAmountEntry = new Catalog()
  moneyAmountEntry.id = MoneyAmount
  moneyAmountEntry.name = "MoneyAmount"
  moneyAmountEntry.data = {
    id: MoneyAmount,
    amount: faker.commerce.price(),
    currency_code: faker.finance.currencyCode(),
  }

  const catalogEntries: Catalog[] = [
    productEntry,
    variantEntry,
    linkProductPriceSetEntry,
    priceSetEntry,
    moneyAmountEntry,
  ]

  const productVariantRelationEntry = new CatalogRelation()
  productVariantRelationEntry.parent_id = productId
  productVariantRelationEntry.parent_name = "Product"
  productVariantRelationEntry.child_id = variantId
  productVariantRelationEntry.child_name = "ProductVariant"

  const variantLinkRelationEntry = new CatalogRelation()
  variantLinkRelationEntry.parent_id = variantId
  variantLinkRelationEntry.parent_name = "ProductVariant"
  variantLinkRelationEntry.child_id = linkProductPriceSetId
  variantLinkRelationEntry.child_name = "LinkProductVariantPriceSet"

  const linkPriceSetRelationEntry = new CatalogRelation()
  linkPriceSetRelationEntry.parent_id = linkProductPriceSetId
  linkPriceSetRelationEntry.parent_name = "LinkProductVariantPriceSet"
  linkPriceSetRelationEntry.child_id = PriceSet
  linkPriceSetRelationEntry.child_name = "PriceSet"

  const priceSetMoneyAmountRelationEntry = new CatalogRelation()
  priceSetMoneyAmountRelationEntry.parent_id = PriceSet
  priceSetMoneyAmountRelationEntry.parent_name = "PriceSet"
  priceSetMoneyAmountRelationEntry.child_id = MoneyAmount
  priceSetMoneyAmountRelationEntry.child_name = "MoneyAmount"

  const catalogRelationEntries: CatalogRelation[] = [
    productVariantRelationEntry,
    variantLinkRelationEntry,
    linkPriceSetRelationEntry,
    priceSetMoneyAmountRelationEntry,
  ]

  return {
    catalogEntries,
    catalogRelationEntries,
  }
}

export const catalogDataEntries: {
  catalogEntries: Catalog[]
  catalogRelationEntries: CatalogRelation[]
}[] = faker.helpers.multiple(createRandomEntries, {
  count: 10000,
})
