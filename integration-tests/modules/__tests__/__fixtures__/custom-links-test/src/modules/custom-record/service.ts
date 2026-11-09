import { MedusaService } from "@medusajs/framework/utils"
import { CustomRecord } from "./models"

export class CustomRecordModule extends MedusaService({
  CustomRecord,
}) {
  private manager_

  constructor({ manager }) {
    super(...arguments)

    this.manager_ = manager
  }

  // @ts-expect-error
  async listCustomRecords(find, config, medusaContext) {
    const { filters, context, id } = find ?? {}
    let lang = null

    if (filters || context) {
      lang = filters?.lang ?? context?.lang
      delete filters?.lang
    }

    const knex = this.manager_.getKnex()

    const q = knex({ tr: "custom_record" }).select(["tr.id", "tr.key"])

    // Select JSON content for a specific lang if provided
    if (lang) {
      q.select(
        knex.raw("tr.value->? AS content", [lang]),
        knex.raw("? AS lang", [lang])
      )
    } else {
      q.select("tr.value")
    }

    const key = filters?.key
    if (id) {
      q.whereIn("tr.id", Array.isArray(id) ? id : [id])
    } else if (key) {
      q.whereIn("tr.key", Array.isArray(key) ? key : [key])
    }

    // console.log(q.toString())
    return await q
  }
}
