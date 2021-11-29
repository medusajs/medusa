import fs from "fs"
import { ServiceIdentifiers } from "../../../../services"

export default async (req, res) => {
  try {
    const fileService = req.scope.resolve(ServiceIdentifiers.fileService)

    const result = await Promise.all(
      req.files.map(async (f) => {
        return fileService.upload(f).then((result) => {
          fs.unlinkSync(f.path)
          return result
        })
      })
    )

    res.status(200).json({ uploads: result })
  } catch (err) {
    console.log(err)
    throw err
  }
}
