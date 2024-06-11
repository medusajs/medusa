import { MedusaContainer } from "@medusajs/types"

export default async function handler(container: MedusaContainer) {
  console.log(`You have received 5 orders today`)
}

export const config = {
  name: "summarize-orders-job",
  schedule: "* * * * * *",
  numberOfExecutions: 2,
}
