import fs from "fs"
import { MedusaError } from "medusa-core-utils"

export default async (req, res) => {
  try {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      JSON.stringify(req.files)
    )
    const fileService = req.scope.resolve("fileService")

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
