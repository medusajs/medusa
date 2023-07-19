"use client"

import type { OpenAPIV3 } from "openapi-types"
import { useEffect, useState } from "react"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import type { TagSectionProps } from "./Section"
import { useArea } from "@/providers/area"
import getLinkWithBasePath from "@/utils/get-link-with-base-path"
import { SidebarItemSections, useSidebar } from "@/providers/sidebar"
import getSectionId from "@/utils/get-section-id"

const TagSection = dynamic<TagSectionProps>(
  async () => import("./Section")
) as React.FC<TagSectionProps>

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

const Tags = () => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const [loadData, setLoadData] = useState<boolean>(false)
  const { baseSpecs, setBaseSpecs } = useBaseSpecs()
  const { addItems } = useSidebar()
  const { area } = useArea()

  const { data } = useSWR<OpenAPIV3.Document>(
    loadData ? getLinkWithBasePath(`/api/base-specs?area=${area}`) : null,
    fetcher
  )

  useEffect(() => {
    setLoadData(true)
  }, [])

  useEffect(() => {
    if (data) {
      setBaseSpecs(data)
    }
    if (data?.tags) {
      setTags(data.tags)
    }
  }, [data, setBaseSpecs])

  useEffect(() => {
    if (baseSpecs) {
      addItems(
        baseSpecs.tags?.map((tag) => ({
          path: getSectionId([tag.name.toLowerCase()]),
          title: tag.name,
        })) || [],
        {
          section: SidebarItemSections.BOTTOM,
        }
      )
    }
  }, [baseSpecs, addItems])

  return (
    <>
      {data && tags.map((tag, index) => <TagSection tag={tag} key={index} />)}
    </>
  )
}

export default Tags
