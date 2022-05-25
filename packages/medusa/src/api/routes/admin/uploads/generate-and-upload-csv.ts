import stream from "stream"

export default async (req, res) => {
  try {
    const fileService = req.scope.resolve("fileService")

    const productsService = req.scope.resolve("productService")

    const logger = req.scope.resolve("logger")

    logger.info("Uploading file")
    logger.info(typeof fileService)
    logger.info(fileService.constructor.name)

    const products = await productsService.list()

    const result: string[] = []

    const { writeStream, promise, url } = await fileService.getUploadStream({
      name: "test",
    })

    for (const product of products) {
      logger.info(`Uploading product ${product.id}`)
      await new Promise((resolve) => setTimeout(resolve, 5000))
      writeStream.write(Object.values(product).join(";"))
      writeStream.write("\n")
      result.push(Object.values(product).join(";"))
      logger.info(`Uploaded product ${product.id}`)
    }

    writeStream.end()

    const resultUrl = await promise

    res.status(200).json({ result, resultUrl, url })
  } catch (err) {
    console.log(err)
    throw err
  }
}
