"use client"

import type { OpenAPIV3 } from "openapi-types"
import { useEffect, useState } from "react"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import Loading from "@/components/Loading"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import type { TagSectionProps } from "./Section"
import { useArea } from "@/providers/area"
import ContentLoading from "../ContentLoading"

const TagSection = dynamic<TagSectionProps>(async () => import("./Section"), {
  loading: () => <Loading />,
}) as React.FC<TagSectionProps>

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

const Tags = () => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const [loadData, setLoadData] = useState<boolean>(false)
  const { setBaseSpecs } = useBaseSpecs()
  const { area } = useArea()

  const { data, isLoading } = useSWR<OpenAPIV3.Document>(
    loadData ? `/api/base-specs?area=${area}` : null,
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

  return (
    <>
      {isLoading && <ContentLoading />}
      {data && tags.map((tag, index) => <TagSection tag={tag} key={index} />)}
    </>
  )
}

export default Tags
