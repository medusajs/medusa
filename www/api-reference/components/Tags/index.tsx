"use client"

import type { OpenAPIV3 } from "openapi-types"
import { useEffect, useState } from "react"
import { useInView } from "react-intersection-observer"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import Loading from "@/components/Loading"
import { useBaseSpecs } from "@/providers/base-specs"
import dynamic from "next/dynamic"
import type { TagSectionProps } from "./Section"

const TagSection = dynamic<TagSectionProps>(async () => import("./Section"), {
  loading: () => <Loading />,
}) as React.FC<TagSectionProps>

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

const Tags = () => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const [loadData, setLoadData] = useState<boolean>(false)
  const { ref } = useInView()
  const { setBaseSpecs } = useBaseSpecs()

  const { data, isLoading } = useSWR<OpenAPIV3.Document>(
    loadData ? `/api/base-specs` : null,
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
    <div ref={ref}>
      {isLoading && <Loading />}
      {data && tags.map((tag, index) => <TagSection tag={tag} key={index} />)}
    </div>
  )
}

export default Tags
