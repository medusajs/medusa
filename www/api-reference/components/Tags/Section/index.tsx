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
import TagPaths from "../Paths"
import DividedLayout from "@/layouts/Divided"
import LoadingProvider from "@/providers/loading"
import type { LinkProps } from "../../MDXComponents/Link"

export type TagSectionProps = {
  tag: OpenAPIV3.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const Section = dynamic<SectionProps>(
  async () => import("../../Section")
) as React.FC<SectionProps>

const Link = dynamic<LinkProps>(
  async () => import("../../MDXComponents/Link")
) as React.FC<LinkProps>

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
      const tagName = location.hash.replace("#", "").split("_")
      if (tagName.length === 1 && tagName[0] === slugTagName) {
        const elm = document.getElementById(tagName[0]) as Element
        elm?.scrollIntoView()
      } else if (tagName.length > 1 && tagName[0] === slugTagName) {
        setLoadPaths(true)
      }
    }
  }, [slugTagName])

  return (
    <div className="min-h-screen pt-[57px]" id={slugTagName} ref={ref}>
      <DividedLayout
        mainContent={
          <>
            <h2>{tag.name}</h2>
            {tag.description && (
              <Section addToSidebar={false}>
                <MDXContentClient content={tag.description} />
              </Section>
            )}
            {tag.externalDocs && (
              <>
                Related guide:{" "}
                <Link href={tag.externalDocs.url} target="_blank">
                  {tag.externalDocs.description || "Read More"}
                </Link>
              </>
            )}
          </>
        }
        codeContent={<></>}
      />
      {loadPaths && (
        <LoadingProvider initialLoading={true}>
          <TagPaths tag={tag} />
        </LoadingProvider>
      )}
    </div>
  )
}

export default TagSection
