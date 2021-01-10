import _ from "lodash"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  try {
    const orderService = req.scope.resolve("orderService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    const selector = {}

    let includeFields = []
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
    }

    let expandFields = []
    if ("expand" in req.query) {
      expandFields = req.query.expand.split(",")
    }

    const listConfig = {
      select: includeFields.length ? includeFields : defaultFields,
      relations: expandFields.length ? expandFields : defaultRelations,
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }

    const [orders, count] = await orderService.listAndCount(
      selector,
      listConfig
    )

    const data = orders.map(o => _.pick(o, [...includeFields, ...expandFields]))

    res.json({ orders: data, count, offset, limit })
  } catch (error) {
    throw error
  }
}
