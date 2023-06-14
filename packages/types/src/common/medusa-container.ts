import { AwilixContainer } from "awilix"

export type MedusaContainer = AwilixContainer & {
  registerAdd: <T>(name: string, registration: T) => MedusaContainer
  createScope: () => MedusaContainer
}
