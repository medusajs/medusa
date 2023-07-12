"use client"

import { OpenAPIV3 } from "openapi-types"
import React, { useEffect, useState } from "react"
import TagSection from "./Section"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"
import BaseSpecsProvider from "@/providers/base-specs"
import useSWR from "swr"
import fetcher from "@/utils/swr-fetcher"
import Loading from "@/app/loading"

export type TagsProps = React.HTMLAttributes<HTMLDivElement>

const Tags = (props: TagsProps) => {
  const [tags, setTags] = useState<OpenAPIV3.TagObject[]>([])
  const { setActivePath } = useSidebar()
  const { ref } = useInView({
    onChange: (inView) => {
      if (!inView) {
        setActivePath(null)
        history.pushState({}, "", "/")
      }
    },
  })

  const { data, isLoading } = useSWR<OpenAPIV3.Document>(
    `/api/base-specs`,
    fetcher
  )

  useEffect(() => {
    if (data?.tags) {
      setTags(data.tags)
    }
  }, [data])

  // console.log(isLoading, data)

  return (
    <div ref={ref}>
      {isLoading && <Loading />}
      {data && (
        <BaseSpecsProvider initialSpecs={data}>
          {tags.map((tag, index) => (
            <TagSection tag={tag} key={index} />
          ))}
        </BaseSpecsProvider>
      )}
    </div>
  )
}

export default Tags
