/**
 * @oas [get] /customers
 * operationId: "GetCustomers"
 * summary: "List Customers"
 * description: "Retrieves a list of Customers."
 * tags:
 *   - Customer
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *           properties:
 *             customer:
 *               $ref: "#/components/schemas/customer"
 */
export default async (req, res) => {
  try {
    const customerService = req.scope.resolve("customerService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    if ("q" in req.query) {
      selector.q = req.query.q
    }

    let expandFields = []
    if ("expand" in req.query) {
      expandFields = req.query.expand.split(",")
    }

    const listConfig = {
      relations: expandFields.length ? expandFields : [],
      skip: offset,
      take: limit,
    }

    const [customers, count] = await customerService.listAndCount(
      selector,
      listConfig
    )

    res.json({ customers, count, offset, limit })
  } catch (error) {
    throw error
  }
}
