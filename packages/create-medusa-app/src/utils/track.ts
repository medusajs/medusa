import fetch from "node-fetch"
import { v4 as uuidv4 } from "uuid"
import { getConfigStore } from "./get-config-store.js"
import medusaPackage from "../../package.json" assert { type: "json" }

const store = getConfigStore()
const medusaCliVersion = medusaPackage.version

const analyticsApi =
  process.env.MEDUSA_TELEMETRY_API ||
  `https://telemetry.medusa-commerce.com/batch`

const getMachineId = (): string => {
  let machineId = store.get(`telemetry.machine_id`)

  if (typeof machineId !== `string`) {
    machineId = uuidv4()
    store.set(`telemetry.machine_id`, machineId)
  }

  return machineId
}

const sessionId = uuidv4()

export const track = (eventType: string, args?: any): void => {
  fetch(analyticsApi, {
    method: `POST`,
    headers: {
      "content-type": `application/json`,
      "user-agent": `create-medusa-app:${medusaCliVersion}`,
    },
    body: JSON.stringify({
      timestamp: new Date(),
      batch: [
        {
          type: eventType,
          timestamp: new Date(),
          sessionId,
          machine_id: getMachineId(),
          component_id: `create-medusa-app`,
          cli_version: medusaCliVersion,
          properties: args,
        },
      ],
    }),
  }).catch(() => {
    /* do nothing, it's telemetry */
  })
}
