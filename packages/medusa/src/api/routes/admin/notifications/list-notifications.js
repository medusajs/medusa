import _ from "lodash"
import { defaultRelations, defaultFields } from "./"

export default async (req, res) => {
  try {
    const notificationService = req.scope.resolve("notificationService")

    const limit = parseInt(req.query.limit) || 50
    const offset = parseInt(req.query.offset) || 0

    let selector = {}

    let includeFields = []
    if ("fields" in req.query) {
      includeFields = req.query.fields.split(",")
    }

    let expandFields = []
    if ("expand" in req.query) {
      expandFields = req.query.expand.split(",")
    }

    if ("event_name" in req.query) {
      const values = req.query.event_name.split(",")
      selector.event_name = values.length > 1 ? values : values[0]
    }

    if ("resource_type" in req.query) {
      const values = req.query.resource_type.split(",")
      selector.resource_type = values.length > 1 ? values : values[0]
    }

    if ("resource_id" in req.query) {
      const values = req.query.resource_id.split(",")
      selector.resource_id = values.length > 1 ? values : values[0]
    }

    if ("to" in req.query) {
      const values = req.query.to.split(",")
      selector.to = values.length > 1 ? values : values[0]
    }

    if (!("include_resends" in req.query)) {
      selector.parent_id = null
    }

    const listConfig = {
      select: includeFields.length ? includeFields : defaultFields,
      relations: expandFields.length ? expandFields : defaultRelations,
      skip: offset,
      take: limit,
      order: { created_at: "DESC" },
    }

    const notifications = await notificationService.list(selector, listConfig)

    const fields = [...listConfig.select, ...listConfig.relations]
    const data = notifications.map(o => _.pick(o, fields))

    res.json({ notifications: data, offset, limit })
  } catch (error) {
    throw error
  }
}
