const webhookLoader = async (container) => {
  const brightpearlService = container.resolve("brightpearlService")
  try {
    const client = await brightpearlService.getClient()
    await brightpearlService.verifyWebhooks()
  } catch (err) {
    if (err.name === "not_allowed") {
      return
    }
    throw err
  }
}

export default webhookLoader
