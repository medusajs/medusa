import { Router } from "express"
import { AdminPluginOptions } from "../types"
import { shouldServe } from "../utils/should-serve"

export default function (_rootDirectory: string, options: AdminPluginOptions) {
  const app = Router()
  const serve = shouldServe({ ...options })

  if (!serve) {
    return
  }
}
