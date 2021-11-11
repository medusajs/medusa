export default async(container, options) => {
    try {
        const elasticsearchService = container.resolve("elasticsearchService")

        await Promise.all(
            Object.entries(options.settings).map(([key, value]) =>
                elasticsearchService.updateSettings(key, value)
            )
        )
    } catch (err) {
        // ignore
        console.log(err)
    }
}