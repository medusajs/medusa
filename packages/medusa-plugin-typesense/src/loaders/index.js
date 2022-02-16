export default async (container, options) => {
  try {
    const typesenseService = container.resolve("typesenseService")
    // TODO: Check if index exists
    return await typesenseService.createIndex("products", options)
  } catch (err) {
    // ignore
    console.log(err)
  }
}
