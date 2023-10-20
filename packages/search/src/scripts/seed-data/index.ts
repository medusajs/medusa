// ESM
import { faker } from "@faker-js/faker"

export function createRandomEntries(): {
  catalogEntries: any[]
  catalogRelationEntries: any[]
} {
  const productId = faker.string.uuid()

  const catalogEntries: any[] = []
  const catalogRelationEntries: any[] = []

  /**
   * build product entry
   */

  const productEntry = {
    id: productId,
    name: "Product",
    data: {
      id: productId,
      title: faker.commerce.productName(),
    },
  }

  catalogEntries.push(productEntry)

  /**
   * build 10 variant entries
   */

  for (let i = 0; i < 10; i++) {
    const variantId = faker.string.uuid()

    const variantEntry = {
      id: variantId,
      name: "ProductVariant",
      data: {
        id: variantId,
        title: faker.commerce.productName(),
        product_id: productId,
        sku: faker.commerce.productName(),
      },
    }

    catalogEntries.push(variantEntry)

    /**
     * build relation between product and variant
     */

    const productVariantRelationEntry = {
      parent_id: productId,
      parent_name: "Product",
      child_id: variantId,
      child_name: "ProductVariant",
      pivot: "Product-ProductVariant",
    }

    catalogRelationEntries.push(productVariantRelationEntry)

    const priceSetId = faker.string.uuid()

    const linkProductPriceSetId = faker.string.uuid()

    /**
     * build link entry between variant and price set
     */

    const linkProductPriceSetEntry = {
      id: linkProductPriceSetId,
      name: "LinkProductVariantPriceSet",
      data: {
        id: linkProductPriceSetId,
        variant_id: variantId,
        price_set_id: priceSetId,
      },
    }

    catalogEntries.push(linkProductPriceSetEntry)

    /**
     * build relation between variant and link entry
     */

    const variantLinkRelationEntry = {
      parent_id: variantId,
      parent_name: "ProductVariant",
      child_id: linkProductPriceSetId,
      child_name: "LinkProductVariantPriceSet",
      pivot: "ProductVariant-LinkProductVariantPriceSet",
    }

    catalogRelationEntries.push(variantLinkRelationEntry)

    /**
     * build price set entry
     */

    const priceSetEntry = {
      id: priceSetId,
      name: "PriceSet",
      data: {
        id: priceSetId,
      },
    }

    catalogEntries.push(priceSetEntry)

    /**
     * build relation between link entry and price set
     */

    const linkPriceSetRelationEntry = {
      parent_id: linkProductPriceSetId,
      parent_name: "LinkProductVariantPriceSet",
      child_id: priceSetId,
      child_name: "PriceSet",
      pivot: "LinkProductVariantPriceSet-PriceSet",
    }

    catalogRelationEntries.push(linkPriceSetRelationEntry)

    /**
     * build 3 money amount entries
     */

    for (let j = 0; j < 3; j++) {
      const moneyAmountId = faker.string.uuid()

      /**
       * build money amount entry
       */

      const moneyAmountEntry = {
        id: moneyAmountId,
        name: "MoneyAmount",
        data: {
          id: moneyAmountId,
          amount: faker.commerce.price({
            dec: 0,
          }),
          //currency_code: faker.finance.currencyCode(),
        },
      }

      catalogEntries.push(moneyAmountEntry)

      /**
       * build relation between price set and money amount
       */

      const moneyAmountPriceSetRelationEntry = {
        parent_id: priceSetId,
        parent_name: "PriceSet",
        child_id: moneyAmountId,
        child_name: "MoneyAmount",
        pivot: "PriceSet-MoneyAmount",
      }

      catalogRelationEntries.push(moneyAmountPriceSetRelationEntry)
    }
  }

  return {
    catalogEntries,
    catalogRelationEntries,
  }
}

export const searchData: {
  catalogEntries: any[]
  catalogRelationEntries: any[]
}[] = faker.helpers.multiple(createRandomEntries, {
  count: 10000,
})
