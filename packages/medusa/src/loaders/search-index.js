export default async ({ container }) => {
  const searchService = container.resolve("searchService")
  const logger = container.resolve("logger")
  if (searchService.isDefault) {
    logger.warn(
      "No search engine provider was found: make sure to include a search plugin to enable searching"
    )
    return
  }
}
