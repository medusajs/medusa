const webhookLoader = async (container) => {
  const brightpearlService = container.resolve("brightpearlService")
  await brightpearlService.verifyWebhooks()
}

export default webhookLoader
