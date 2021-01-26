export default async (req, res) => {
  const { id } = req.params

  try {
    const variantService = req.scope.resolve("productVariantService")
    let variant = await variantService.retrieve(id, { relations: ["prices"] })
    res.json({ variant })
  } catch (error) {
    throw error
  }
}
