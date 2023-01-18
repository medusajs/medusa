import { RequestHandler } from "express"
import { MedusaContainer } from "../types/global"

export type ApiPlugin = (
  rootDirectory: string,
  pluginOptions: Record<string, unknown>,
  container: MedusaContainer
) => RequestHandler
