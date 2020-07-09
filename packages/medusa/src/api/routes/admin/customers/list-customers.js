export default async (req, res) => {
  const selector = {}

  try {
    const customerService = req.scope.resolve("customerService")
    const customers = await customerService.list(selector)

    res.json({ customers })
  } catch (error) {
    throw error
  }
}
