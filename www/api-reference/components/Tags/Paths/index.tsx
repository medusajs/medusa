"use client"

import getSectionId from "@/utils/get-section-id"
import fetcher from "@/utils/swr-fetcher"
import type { OpenAPIV3 } from "openapi-types"
import useSWR from "swr"
import type { Operation, PathsObject } from "@/types/openapi"
import type { SidebarItemType } from "@/providers/sidebar"
import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import { useEffect } from "react"
import dynamic from "next/dynamic"
import type { TagOperationProps } from "../Operation"
import { useArea } from "@/providers/area"
import ContentLoading from "@/components/ContentLoading"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation"),
  {
    loading: () => <ContentLoading />,
  }
) as React.FC<TagOperationProps>

export type TagSectionPathsProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag }: TagSectionPathsProps) => {
  const tagSlugName = getSectionId([tag.name])
  const { area } = useArea()
  const { data, isLoading } = useSWR<{
    paths: PathsObject
  }>(`/api/tag?tagName=${tagSlugName}&area=${area}`, fetcher)
  const { addItems } = useSidebar()

  const paths = data?.paths || []

  useEffect(() => {
    if (paths) {
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
          })
        })
      })

      addItems(items, {
        section: SidebarItemSections.BOTTOM,
        parentPath: tagSlugName,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paths])

  return (
    <>
      {isLoading && <ContentLoading />}
      {Object.entries(paths).map(([endpointPath, operations], pathIndex) => (
        <div key={pathIndex}>
          {Object.entries(operations).map(
            ([method, operation], operationIndex) => (
              <TagOperation
                method={method}
                operation={operation as Operation}
                tag={tag}
                key={`${pathIndex}-${operationIndex}`}
                endpointPath={endpointPath}
              />
            )
          )}
        </div>
      ))}
    </>
  )
}

export default TagPaths
