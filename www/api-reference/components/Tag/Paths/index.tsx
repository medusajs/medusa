"use client"

import getSectionId from "@/utils/get-section-id"
import fetcher from "@/utils/swr-fetcher"
import { OpenAPIV3 } from "openapi-types"
import Skeleton from "react-loading-skeleton"
import useSWR from "swr"
import TagOperation from "../Operation"
import { Operation, Path } from "@/types/openapi"
import {
  SidebarItemSections,
  SidebarItemType,
  useSidebar,
} from "@/providers/sidebar"
import { useEffect } from "react"

type TagSectionPathsProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagSectionPaths = ({ tag }: TagSectionPathsProps) => {
  const tagSlugName = getSectionId([tag.name])
  const { data } = useSWR<{
    paths: Path[]
  }>(`/api/tag/${tagSlugName}`, fetcher)
  const { addItems } = useSidebar()

  const paths = data?.paths || []

  useEffect(() => {
    if (paths.length) {
      const items: SidebarItemType[] = []
      paths.forEach((path) => {
        Object.entries(path).map(([method, operation]) => {
          const definedOperation = operation as Operation
          items.push({
            path: getSectionId([definedOperation.operationId]),
            title: `${method}: ${
              definedOperation.summary || definedOperation.operationId
            }`,
          })
        })
      })

      addItems(items, {
        section: SidebarItemSections.BOTTOM,
        parentPath: tagSlugName,
      })
    }
  }, [paths])

  return (
    <div>
      {!paths && <Skeleton count={10} containerClassName="w-api-ref-content" />}
      {paths.length > 0 && (
        <ul>
          {paths.map((path, pathIndex) => (
            <>
              {Object.entries(path).map(
                ([method, operation], operationIndex) => (
                  <TagOperation
                    method={method}
                    operation={operation as Operation}
                    tag={tag}
                    key={`${pathIndex}-${operationIndex}`}
                  />
                )
              )}
            </>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TagSectionPaths
