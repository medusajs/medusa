import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { asValue } from "awilix"

export default async (
  { container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  if (!container.hasRegistration("eventBusService")) {
    container.register("eventBusService", asValue(undefined))
  }
}
