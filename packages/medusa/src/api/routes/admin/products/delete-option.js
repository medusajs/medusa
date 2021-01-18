import { defaultRelations, defaultFields } from "."

export default async (req, res) => {
  const { id, option_id } = req.params

  try {
    const productService = req.scope.resolve("productService")
    await productService.deleteOption(id, option_id)
    const data = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({
      option_id,
      object: "option",
      deleted: true,
      product: data,
    })
  } catch (err) {
    throw err
  }
}
