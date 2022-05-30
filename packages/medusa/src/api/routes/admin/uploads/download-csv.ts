import stream from "stream"
import { IFileService } from "../../../../interfaces"

/**
 * [delete] /uploads
 * operationId: "AdminDeleteUpload"
 * summary: "Removes an uploaded file"
 * description: "Removes an uploaded file using the installed fileservice"
 * x-authenticated: true
 * tags:
 *   - Uploads
 * responses:
 *   200:
 *     description: OK
 */
function streamToString(stream) {
  const chunks: any[] = []
  return new Promise((resolve, reject) => {
    stream.on("data", (chunk) => chunks.push(Buffer.from(chunk)))
    stream.on("error", (err) => reject(err))
    stream.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")))
  })
}

export default async (req, res) => {
  try {
    const fileService: IFileService = req.scope.resolve("fileService")
    const logger = req.scope.resolve("logger")

    logger.info("Downloading file")

    const readStream: NodeJS.ReadableStream =
      await fileService.downloadAsStream({
        key: "test-1653493436170.csv",
      })

    const result = await streamToString(readStream)

    res.status(200).send({ result })
  } catch (err) {
    console.log(err)
    throw err
  }
}
