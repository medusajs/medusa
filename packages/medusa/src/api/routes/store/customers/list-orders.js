import _ from "lodash"
import {
  defaultRelations,
  defaultFields,
  allowedFields,
  allowedRelations,
} from "../orders"

export default async (req, res) => {
  const { id } = req.params
  try {
    const orderService = req.scope.resolve("orderService")

    let selector = {
      customer_id: id,
    }

    const limit = parseInt(req.query.limit) || 10
    const offset = parseInt(req.query.offset) || 0

    let includeFields = []
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
      includeFields = includeFields.filter(f => allowedFields.includes(f))
    }

    let expandFields = []
    if ("expand" in req.query) {
      expandFields = req.query.expand.split(",")
      expandFields = expandFields.filter(f => allowedRelations.includes(f))
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

    res.json({ orders, count, offset, limit })
  } catch (error) {
    throw error
  }
}
