import { DataSource } from "typeorm"
import faker from "faker"
import { ProductCollection } from "@medusajs/medusa"

export type Data = {
  title?: string,
  handle?: string
}

export const simpleProductCollectionFactory = async <
  TData extends Data | Data[] = Data | Data[],
  TResult = TData extends Array<Data> ? ProductCollection[] : ProductCollection
>(
  dataSource: DataSource,
  data?: TData,
  seed?: number
): Promise<TResult> => {
  if (typeof seed !== "undefined") {
    faker.seed(seed)
  }

  const manager = dataSource.manager

  data = data || [{
    title: faker.datatype.string(10),
  }] as TData

  const collectionsData = Array.isArray(data) ? data : [data]

  const collections: ProductCollection[] = []

  for (const collectionData of collectionsData) {
    const collection_ = manager.create(ProductCollection, {
      id: `simple-id-${Math.random() * 1000}`,
      title: collectionData.title ?? faker.datatype.string(10),
      handle: collectionData.handle
    })
    collections.push(collection_)
  }

  const productCollections = await manager.save(collections)
  return (Array.isArray(data) ? productCollections : productCollections[0]) as unknown as TResult
}
