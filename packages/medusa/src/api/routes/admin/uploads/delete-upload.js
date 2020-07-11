export default async (req, res) => {
  try {
    const fileService = req.scope.resolve("fileService")

    await fileService.delete(req.body.file)

    res.status(200).send("Deleted image")
  } catch (err) {
    console.log(err)
    throw err
  }
}
