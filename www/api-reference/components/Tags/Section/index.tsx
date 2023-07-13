"use client"

import getSectionId from "@/utils/get-section-id"
import type { OpenAPIV3 } from "openapi-types"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"
import { useSidebar } from "@/providers/sidebar"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import type { SectionProps } from "../../Section"
import type { MDXContentClientProps } from "../../MDXContent/Client"
import type { TagSectionPathsProps } from "../Paths"
import ContentLoading from "@/components/ContentLoading"

export type TagSectionProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = dynamic<TagSectionPathsProps>(async () => import("../Paths"), {
  loading: () => <ContentLoading />,
}) as React.FC<TagSectionPathsProps>

const Section = dynamic<SectionProps>(async () => import("../../Section"), {
  loading: () => <ContentLoading />,
}) as React.FC<SectionProps>

const MDXContentClient = dynamic<MDXContentClientProps>(
  async () => import("../../MDXContent/Client"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentClientProps>

const TagSection = ({ tag }: TagSectionProps) => {
  const { setActivePath } = useSidebar()
  const [loadPaths, setLoadPaths] = useState(false)
  const slugTagName = getSectionId([tag.name])
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView && !loadPaths) {
        setLoadPaths(true)
      }
      if (inView) {
        // ensure that the hash link doesn't change if it links to an inner path
        const currentHashArr = location.hash.replace("#", "").split("_")
        if (currentHashArr.length < 2 || currentHashArr[0] !== slugTagName) {
          // can't use next router as it doesn't support
          // changing url without scrolling
          history.pushState({}, "", `#${slugTagName}`)
          setActivePath(slugTagName)
        }
      }
    },
  })

  useEffect(() => {
    if (location.hash && location.hash.includes(slugTagName)) {
      const tagName = location.hash.replace("#", "").split("_")[0]
      if (tagName === slugTagName) {
        const elm = document.getElementById(tagName) as Element
        elm?.scrollIntoView()
      }
    }
  }, [slugTagName])

  return (
    <div className="min-h-screen pt-[57px]" id={slugTagName} ref={ref}>
      <h2>{tag.name}</h2>
      {tag.description && (
        <Section addToSidebar={false}>
          <MDXContentClient content={tag.description} />
        </Section>
      )}
      {loadPaths && <TagPaths tag={tag} />}
      {!loadPaths && <ContentLoading />}
    </div>
  )
}

export default TagSection
