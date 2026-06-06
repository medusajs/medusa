import { MedusaContainer } from "@zjedene-medusa/types"

export default async function handler(container: MedusaContainer) {
  console.log(`You have received 5 orders today`)
}

export const config = {
  name: "summarize-orders",
  schedule: "* * * * * *",
  numberOfExecutions: 2,
}
