import {
  Product,
  ProductOption,
  ProductTag,
  ProductType,
  ShippingProfile,
  ShippingProfileType,
  Store,
} from "@medusajs/medusa"
import faker from "faker"
import { DataSource } from "typeorm"
import {
  ProductVariantFactoryData,
  simpleProductVariantFactory,
} from "./simple-product-variant-factory"
import {
  SalesChannelFactoryData,
  simpleSalesChannelFactory,
} from "./simple-sales-channel-factory"

export type ProductFactoryData = {
  id?: string
  is_giftcard?: boolean
  status?: string
  title?: string
  type?: string
  tags?: string[]
  options?: { id: string; title: string }[]
  variants?: ProductVariantFactoryData[]
  sales_channels?: SalesChannelFactoryData[]
  metadata?: Record<string, unknown>
}

export const simpleProductFactory = async (
  dataSource: DataSource,
  data: ProductFactoryData = {},
  seed?: number
): Promise<Product | undefined | null> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  const defaultProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.DEFAULT,
    }
  })

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.GIFT_CARD,
    }
  })

  let sales_channels
  if (data.sales_channels) {
    sales_channels = await Promise.all(
      data.sales_channels.map(
        async (salesChannel) =>
          await simpleSalesChannelFactory(dataSource, salesChannel)
      )
    )
  } else {
    const stores = await manager.find(Store, {
      relations: { default_sales_channel: true },
    })

    const store = stores[0]

    if (store?.default_sales_channel) {
      sales_channels = [store.default_sales_channel]
    } else {
      const salesChannel = await simpleSalesChannelFactory(dataSource, {
        id: `default-${Math.random() * 1000}`,
        is_default: true,
      })

      sales_channels = [salesChannel]
    }
  }

  const prodId = data.id || `simple-product-${Math.random() * 1000}`
  const productToCreate = {
    id: prodId,
    title: data.title || faker.commerce.productName(),
    status: data.status,
    is_giftcard: data.is_giftcard || false,
    discountable: !data.is_giftcard,
    tags: [] as ProductTag[],
    profile_id: data.is_giftcard ? gcProfile?.id : defaultProfile?.id,
    metadata: data.metadata || null,
  } as Product

  if (typeof data.tags !== "undefined") {
    for (let i = 0; i < data.tags.length; i++) {
      const createdTag = manager.create(ProductTag, {
        id: `tag-${Math.random() * 1000}`,
        value: data.tags[i],
      })

      const tagRes = await manager.save(createdTag)

      productToCreate.tags.push(tagRes)
    }
  }

  if (typeof data.type !== "undefined") {
    const toSave = manager.create(ProductType, {
      value: data.type,
    })
    const res = await manager.save(toSave)
    productToCreate["type_id"] = res.id
  }

  const toSave = manager.create(Product, productToCreate)

  toSave.sales_channels = sales_channels

  await manager.save(toSave)

  const optionId = `${prodId}-option`
  const options = data.options || [{ id: optionId, title: "Size" }]
  for (const o of options) {
    await manager.insert(ProductOption, {
      id: o.id,
      title: o.title,
      product_id: prodId,
    })
  }

  const variants = data.variants || [
    {
      id: `simple-test-variant-${Math.random() * 1000}`,
      title: "Test",
      product_id: prodId,
      prices: [{ currency: "usd", amount: 100 }],
      options: [{ option_id: optionId, value: "Large" }],
    },
  ]

  for (const pv of variants) {
    const factoryData = {
      ...pv,
      product_id: prodId,
    }
    if (typeof pv.options === "undefined") {
      factoryData.options = [
        { option_id: optionId, value: faker.commerce.productAdjective() },
      ]
    }
    await simpleProductVariantFactory(dataSource, factoryData)
  }

  return await manager.findOne(
    Product,
    {
      where: {
        id: prodId
      },
      relations: { tags: true, variants: { prices: true }}
    }
  )
}
