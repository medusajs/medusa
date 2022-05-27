import fs from "fs"

export default async (req, res) => {
  try {
    const fileService = req.scope.resolve("fileService")

    const logger = req.scope.resolve("logger")

    logger.info("Uploading file")

    const result: string[] = []

    const { writeStream, promise, url } = await fileService.getUploadStream({
      name: "test",
    })

    fs.createReadStream(req.file.path).pipe(writeStream)

    logger.info("Uploaded file")

    const resultUrl = await promise

    res.status(200).json({ result, resultUrl, url })
  } catch (err) {
    console.log(err)
    throw err
  }
}
