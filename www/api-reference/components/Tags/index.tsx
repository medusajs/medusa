"use client"

import type { OpenAPIV3 } from "openapi-types"
import { useEffect, useState } from "react"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import Loading from "@/components/Loading"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import type { TagSectionProps } from "./Section"

const TagSection = dynamic<TagSectionProps>(async () => import("./Section"), {
  loading: () => <Loading />,
}) as React.FC<TagSectionProps>

export type TagsProps = {
  area: string
} & React.HTMLAttributes<HTMLDivElement>

const Tags = ({ area }: TagsProps) => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const [loadData, setLoadData] = useState<boolean>(false)
  const { setBaseSpecs } = useBaseSpecs()

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
    <div>
      {isLoading && <Loading />}
      {data &&
        tags.map((tag, index) => (
          <TagSection tag={tag} key={index} area={area} />
        ))}
    </div>
  )
}

export default Tags
