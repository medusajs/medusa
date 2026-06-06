import { defineJoinerConfig, Modules } from "@zjedene-medusa/framework/utils"

export const joinerConfig = defineJoinerConfig(Modules.FILE, {
  models: [{ name: "File" }],
})
