"use client"

import getSectionId from "@/utils/get-section-id"
import { OpenAPIV3 } from "openapi-types"
import Section from "../../Section"
import MDXContentClient from "@/components/MDXContent/Client"
import { useInView } from "react-intersection-observer"
import { Suspense, useState } from "react"
import { useRouter } from "next/navigation"
import { useSidebar } from "@/providers/sidebar"
import dynamic from 'next/dynamic'
import Loading from "@/app/loading"

type TagSectionProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = dynamic(() => import('../Paths'), {
  loading: () => <Loading />
})

const TagSection = ({ tag }: TagSectionProps) => {
  const { changeActiveItem } = useSidebar()
  const [loadPaths, setLoadPaths] = useState(false)
  const slugTagName = getSectionId([tag.name])
  const router = useRouter()
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView && !loadPaths) {
        setLoadPaths(true)
      }
      if (inView) {
        void router.push(`#${slugTagName}`)
        changeActiveItem(slugTagName)
      }
    },
  })

  return (
    <div className="min-h-screen" id={slugTagName} ref={ref}>
      <h2>{tag.name}</h2>
      {tag.description && (
        <Suspense fallback={<Loading />}>
          <Section
            addToSidebar={false}
            content={<MDXContentClient content={tag.description} />}
          />
        </Suspense>
      )}
      {loadPaths && <TagPaths tag={tag} />}
      {!loadPaths && (
        <Loading />
      )}
    </div>
  )
}

export default TagSection
