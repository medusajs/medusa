import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  const { id, key } = req.params

  try {
    const regionService = req.scope.resolve("regionService")
    await regionService.deleteMetadata(id, key)

    const region = await regionService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.status(200).json({ region })
  } catch (err) {
    throw err
  }
}
