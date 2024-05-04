import { ScheduledJobArgs } from "../../../../../types/scheduled-jobs"

export default async function ({ container, pluginOptions }: ScheduledJobArgs) {
  // noop
  return {}
}

export const config = {
  name: "every-minute",
  schedule: "* * * * *",
}
