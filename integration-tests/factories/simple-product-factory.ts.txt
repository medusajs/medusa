import {
  Product,
  ProductOption,
  ProductTag,
  ProductType,
  ShippingProfile,
  ShippingProfileType,
  Store,
} from "@medusajs/medusa"
import {
  ProductVariantFactoryData,
  simpleProductVariantFactory,
} from "./simple-product-variant-factory"
import {
  SalesChannelFactoryData,
  simpleSalesChannelFactory,
} from "./simple-sales-channel-factory"

import { generateEntityId } from "@medusajs/utils"
import faker from "faker"
import { DataSource } from "typeorm"

export type ProductFactoryData = {
  id?: string
  is_giftcard?: boolean
  status?: string
  title?: string
  type?: string
  tags?: string[]
  options?: { id: string; title: string }[]
  variants?: Omit<ProductVariantFactoryData, "product_id">[]
  sales_channels?: SalesChannelFactoryData[]
  metadata?: Record<string, unknown>
  isMedusaV2Enabled?: boolean
}

export const simpleProductFactory = async (
  dataSource: DataSource,
  data: ProductFactoryData = {},
  seed?: number
): Promise<Product | undefined | null> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  data.isMedusaV2Enabled =
    data.isMedusaV2Enabled ?? process.env.MEDUSA_FF_MEDUSA_V2 == "true"

  const manager = dataSource.manager

  const defaultProfile = (await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.DEFAULT,
    },
  })) || { id: "default-profile-id" }

  const gcProfile = await manager.findOne(ShippingProfile, {
    where: {
      type: ShippingProfileType.GIFT_CARD,
    },
  })

  let sales_channels
  if (data.sales_channels) {
    sales_channels = await Promise.all(
      data.sales_channels.map(async (salesChannel) =>
        salesChannel
          ? await simpleSalesChannelFactory(dataSource, salesChannel)
          : null
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
    profiles: [
      { id: data.is_giftcard ? gcProfile?.id : defaultProfile?.id },
    ] as ShippingProfile[],
    metadata: data.metadata || null,
  } as unknown as Product

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

  if (!data.isMedusaV2Enabled) {
    toSave.sales_channels = sales_channels
  }

  const product = await manager.save(toSave)

  if (data.isMedusaV2Enabled) {
    await manager.query(
      `INSERT INTO "product_sales_channel" (id, product_id, sales_channel_id) 
        VALUES ${sales_channels
          .map(
            (sc) =>
              `('${generateEntityId(undefined, "prodsc")}', '${toSave.id}', '${
                sc.id
              }')`
          )
          .join(", ")};
        `
    )
  }

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

  product.variants = await Promise.all(
    variants.map(async (pv) => {
      const factoryData = {
        ...pv,
        product_id: prodId,
      }
      if (typeof pv.options === "undefined") {
        factoryData.options = [
          { option_id: optionId, value: faker.commerce.productAdjective() },
        ]
      }
      return await simpleProductVariantFactory(dataSource, factoryData)
    })
  )

  return product
}
