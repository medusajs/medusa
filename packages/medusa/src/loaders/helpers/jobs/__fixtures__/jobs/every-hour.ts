import { MedusaContainer } from "@medusajs/types"

export default async function (
  container: MedusaContainer,
  pluginOptions: Record<string, unknown>
) {
  // noop: We can't test the actual job running, but we can test that the job is registered
  return {}
}

export const config = {
  name: "every-hour",
  cron_schedule: "0 * * * *",
}
