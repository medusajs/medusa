export default async (container, options) => {
  try {
    const meilisearchService = container.resolve("meilisearchService")

    await Promise.all(
      Object.entries(options.settings).map(([key, value]) =>
        meilisearchService.updateSettings(key, value)
      )
    )
  } catch (err) {
    console.log(err)
  }
}
