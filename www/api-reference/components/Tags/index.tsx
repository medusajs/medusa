"use client"

import { OpenAPIV3 } from "openapi-types"
import React, { useEffect, useState } from "react"
import TagSection from "./Section"
import { useInView } from "react-intersection-observer"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import Loading from "@/components/Loading"
import { useBaseSpecs } from "@/providers/base-specs"

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

const Tags = (props: TagsProps) => {
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

  useEffect(() => {
    if (location.hash) {
      const tagName = location.hash.replace("#", "").split("_")[0]
      const elm = document.getElementById(tagName) as Element
      elm?.scrollIntoView()
    }
  }, [tags])

  return (
    <div ref={ref}>
      {isLoading && <Loading />}
      {data && tags.map((tag, index) => <TagSection tag={tag} key={index} />)}
    </div>
  )
}

export default Tags
