import type { SidebarItemType } from "@/providers/sidebar"
import type { Operation, PathsObject } from "@/types/openapi"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "./get-section-id"

export default function getTagChildSidebarItems(
  paths: PathsObject
): SidebarItemType[] {
  const items: SidebarItemType[] = []
  Object.entries(paths).forEach(([, operations]) => {
    Object.entries(operations).map(([method, operation]) => {
      const definedOperation = operation as Operation
      const definedMethod = method as OpenAPIV3.HttpMethods
      items.push({
        path: getSectionId([
          ...(definedOperation.tags || []),
          definedOperation.operationId,
        ]),
        title: definedOperation.summary || definedOperation.operationId,
        method: definedMethod,
        loaded: true,
      })
    })
  })

  return items
}
