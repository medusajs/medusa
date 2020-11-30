export default async (req, res) => {
  const { cart_id } = req.params

  try {
    const swapService = req.scope.resolve("swapService")
    const swap = await swapService.retrieveByCartId(cart_id)
    res.json({ swap })
  } catch (error) {
    throw error
  }
}
