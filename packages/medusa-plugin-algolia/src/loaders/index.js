export default async (container, options) => {
  try {
    const algoliaService = container.resolve("algoliaService")

    await Promise.all(
      Object.entries(options.settings).map(([key, value]) =>
        algoliaService.updateSettings(key, value)
      )
    )
  } catch (err) {
    console.log(err)
  }
}
