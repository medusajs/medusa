import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function setContext(context: Record<string, any>) {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    const ctx: Record<string, any> = { ...(req.context || {}) }

    for (const [contextKey, contextValue] of Object.entries(context || {})) {
      let valueToApply = contextValue

      if (typeof contextValue === "function") {
        valueToApply = await contextValue(req, ctx)
      }

      ctx[contextKey] = valueToApply
    }

    req.context = ctx

    return next()
  }
}
