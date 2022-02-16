import Typesense from "typesense";

export default async (container, options) => {
  try {
    const typesenseService = container.resolve("typesenseService")
    await Promise.all(
      Object.entries(options.collectionSchemas).map(async ([collectionName, _collectionSchema]) => {
        try {
          await typesenseService.getIndex(collectionName)
          console.log(`Typesense Collection ${collectionName} already exists.`)
        } catch (e) {
          if(e instanceof Typesense.Errors.ObjectNotFound) {
            console.log(`Typesense Collection ${collectionName} does not exist, so creating it`)
            return await typesenseService.createIndex(collectionName, options)
          } else {
            console.log(e)
            return Promise.reject(e)
          }
        }
      })
    )

  } catch (err) {
    // ignore
    console.log(err)
  }
}
