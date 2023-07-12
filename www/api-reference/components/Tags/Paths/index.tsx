"use client"

import getSectionId from "@/utils/get-section-id"
import fetcher from "@/utils/swr-fetcher"
import { OpenAPIV3 } from "openapi-types"
import useSWR from "swr"
import { Operation, PathsObject } from "@/types/openapi"
import {
  SidebarItemSections,
  SidebarItemType,
  useSidebar,
} from "@/providers/sidebar"
import { useEffect } from "react"
import dynamic from "next/dynamic"
import Loading from "@/app/loading"
import type { TagOperationProps } from "../Operation"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation"),
  {
    loading: () => <Loading />,
  }
) as React.FC<TagOperationProps>

export type TagSectionPathsProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag }: TagSectionPathsProps) => {
  const tagSlugName = getSectionId([tag.name])
  const { data } = useSWR<{
    paths: PathsObject
  }>(`/api/tag/${tagSlugName}`, fetcher)
  const { addItems } = useSidebar()

  const paths = data?.paths || []

  useEffect(() => {
    if (paths) {
      const items: SidebarItemType[] = []
      Object.entries(paths).forEach(([endpointPath, operations]) => {
        Object.entries(operations).map(([method, operation]) => {
          const definedOperation = operation as Operation
          const definedMethod = method as OpenAPIV3.HttpMethods
          items.push({
            path: getSectionId([definedOperation.operationId]),
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
    <div>
      {!paths && <Loading />}
      {paths && (
        <>
          {Object.entries(paths).map(
            ([endpointPath, operations], pathIndex) => (
              <div key={pathIndex}>
                {Object.entries(operations).map(
                  ([method, operation], operationIndex) => (
                    <TagOperation
                      method={method}
                      operation={operation as Operation}
                      tag={tag}
                      key={`${pathIndex}-${operationIndex}`}
                    />
                  )
                )}
              </div>
            )
          )}
        </>
      )}
    </div>
  )
}

export default TagPaths
