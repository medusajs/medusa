import { model } from "@medusajs/framework/utils"

const AnnouncementPreference = model.define("cloud_announcement_preference", {
  id: model.id({ prefix: "cloudannpref" }).primaryKey(),
  security: model.boolean().default(true),
  feature: model.boolean().default(true),
  cloud: model.boolean().default(true),
})

export default AnnouncementPreference
