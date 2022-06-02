import fs from "fs"
import { IFileService } from "../../../../interfaces"

export default async (req, res) => {
  try {
    const fileService: IFileService<any> = req.scope.resolve("fileService")

    const logger = req.scope.resolve("logger")

    logger.info("Uploading file")

    const result: string[] = []

    const { writeStream, promise, url, key } =
      await fileService.getUploadStreamDescriptor({
        name: "test",
      })

    fs.createReadStream(req.file.path).pipe(writeStream)

    logger.info("Uploaded file")

    const resultUrl = await promise

    res.status(200).json({ result, resultUrl, url, key })
  } catch (err) {
    console.log(err)
    throw err
  }
}
