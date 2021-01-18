import { defaultRelations, defaultFields } from "."
export default async (req, res) => {
  const { variant_id } = req.params

  try {
    const productVariantService = req.scope.resolve("productVariantService")
    await productVariantService.delete(variant_id)
    const data = await productService.retrieve(id, {
      select: defaultFields,
      relations: defaultRelations,
    })

    res.json({
      variant_id,
      object: "product-variant",
      deleted: true,
      product: data,
    })
  } catch (err) {
    throw err
  }
}
