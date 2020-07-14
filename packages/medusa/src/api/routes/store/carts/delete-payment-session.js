export default async (req, res) => {
  const { id, provider_id } = req.params

  try {
    const cartService = req.scope.resolve("cartService")

    let cart = await cartService.deletePaymentSession(id, provider_id)
    cart = await cartService.decorate(cart, [], ["region"])

    res.status(200).json({ cart })
  } catch (err) {
    throw err
  }
}
