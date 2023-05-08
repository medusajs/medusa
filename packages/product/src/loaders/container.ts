import { InternalModuleDeclaration, LoaderOptions } from "@medusajs/modules-sdk"

import { ProductService } from "../services"

import { asClass } from "awilix"

export default async (
  { container }: LoaderOptions,
  moduleDeclaration?: InternalModuleDeclaration
): Promise<void> => {
  container.register({
    productService: asClass(ProductService).singleton(),
  })
}
