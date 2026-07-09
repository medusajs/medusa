import { MedusaContainer } from "@medusajs/types"
import { ScheduledJobContext } from "../../../types"

declare global {
  // eslint-disable-next-line no-var
  var __medusaScheduledForTest: Date | undefined
}

export default async function scheduledForJob(
  _container: MedusaContainer,
  context: ScheduledJobContext
) {
  global.__medusaScheduledForTest = context.scheduledFor
}

export const config = {
  name: "capture-scheduled-for",
  schedule: "* * * * * *",
}
