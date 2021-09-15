const INDEX_NS = "medusa-commerce"

export default async (container, options) => {
  try {
    const searchService = container.resolve("searchService")

    await Promise.all(
      Object.entries(options.settings).map(([key, value]) =>
        searchService.updateSettings(`${INDEX_NS}_${key}`, value)
      )
    )
  } catch (err) {
    console.log(err)
  }
}
