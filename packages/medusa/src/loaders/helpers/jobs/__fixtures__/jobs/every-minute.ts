import { MedusaContainer } from "@medusajs/types"

export default async function (
  container: MedusaContainer,
  pluginOptions: Record<string, unknown>
) {
  // noop
  return {}
}

export const config = {
  name: "every-minute",
  schedule: "* * * * *",
}
