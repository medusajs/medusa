import type { SidebarItemType } from "types"
import type { Operation, PathsObject } from "@/types/openapi"
import type { OpenAPIV3 } from "openapi-types"
import dynamic from "next/dynamic"
import type { MethodLabelProps } from "@/components/MethodLabel"
import getSectionId from "./get-section-id"

const MethodLabel = dynamic<MethodLabelProps>(
  async () => import("../components/MethodLabel")
) as React.FC<MethodLabelProps>

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
        additionalElms: (
          <MethodLabel method={definedMethod} className="h-fit" />
        ),
        loaded: true,
      })
    })
  })

  return items
}
