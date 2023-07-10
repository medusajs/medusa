import Typesense from "typesense"

export default async (container, options) => {
  try {
    const typesenseService = container.resolve("typesenseService")
    const { settings } = options

    await Promise.all(
      Object.entries(settings).map(async ([indexName, indexSettings]) => {
        try {
          await typesenseService.getIndex(indexName)
        } catch (e) {
          if (e instanceof Typesense.Errors.ObjectNotFound) {
            return await typesenseService.createIndex(indexName, indexSettings)
          } else {
            return Promise.reject(e)
          }
        }
      })
    )
  } catch (err) {
    // ignore
  }
}
