const INDEX_NS = "medusa-commerce"

export default async (container, options) => {
  try {
    const meilisearchService = container.resolve("meilisearchService")

    await Promise.all(
      Object.entries(options.settings).map(([key, value]) =>
        meilisearchService.updateSettings(`${INDEX_NS}_${key}`, value)
      )
    )
  } catch (err) {
    console.log(err)
  }
}
