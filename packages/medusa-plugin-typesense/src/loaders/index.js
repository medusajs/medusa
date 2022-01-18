export default async (container, options) => {
  try {
    const typesenseService = container.resolve("typesenseService")

    // Not needed in Typesense
    // await Promise.all(
    //   Object.entries(options.settings).map(([key, value]) =>
    //     typesenseService.updateSettings(key, value)
    //   )
    // )
  } catch (err) {
    // ignore
    console.log(err)
  }
}
