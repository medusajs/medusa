export * from "./connection"
export * from "./container"

import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/types"

import ConnectionLoader from "./connection"
import ContainerLoader from "./container"

export default async (
  { options, container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  await ConnectionLoader({ options, container }, moduleDeclaration)
  await ContainerLoader({ options, container }, moduleDeclaration)
}
