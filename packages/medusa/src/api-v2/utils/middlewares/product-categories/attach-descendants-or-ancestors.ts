import { NextFunction } from "express"
import { MedusaRequest } from "../../../../types/routing"

export function maybeIncludeDescendantsAndAncestors() {
  return async (req: MedusaRequest, _, next: NextFunction) => {
    if (req.filterableFields["include_ancestors_tree"]) {
      req.remoteQueryConfig.fields.indexOf("parent_category") === -1 &&
        req.remoteQueryConfig.fields.push("parent_category")
    }

    if (req.filterableFields["include_descendants_tree"]) {
      req.remoteQueryConfig.fields.indexOf("category_children") === -1 &&
        req.remoteQueryConfig.fields.push("category_children")
    }

    return next()
  }
}
