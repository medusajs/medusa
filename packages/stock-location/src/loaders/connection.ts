import {
  ConfigurableModuleDeclaration,
  LoaderOptions,
} from "@medusajs/modules-sdk"

export default async (
  { configModule }: LoaderOptions,
  moduleDeclaration?: ConfigurableModuleDeclaration
): Promise<void> => {}
