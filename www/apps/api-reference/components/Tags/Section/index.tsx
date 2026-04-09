"use client"

import React from "react"
import { InView } from "react-intersection-observer"
import { useEffect, useMemo, useState } from "react"
import {
  H2,
  isElmWindow,
  swrFetcher,
  useIsBrowser,
  useScrollController,
  useSidebar,
  Loading,
  Link,
} from "docs-ui"
import dynamic from "next/dynamic"
import type { SectionProps } from "../../Section"
import type { MDXContentClientProps } from "../../MDXContent/Client"
import DividedLayout from "@/layouts/Divided"
import LoadingProvider from "@/providers/loading"
import SectionContainer from "../../Section/Container"
import { useArea } from "@/providers/area"
import SectionDivider from "../../Section/Divider"
import clsx from "clsx"
import { useRouter } from "next/navigation"
import { OpenAPI } from "types"
import TagSectionSchema from "./Schema"
import checkElementInViewport from "../../../utils/check-element-in-viewport"
import TagPaths from "../Paths"
import useSWR from "swr"
import basePathUrl from "../../../utils/base-path-url"
import { getSectionId } from "docs-utils"
import { RoutesSummary } from "./RoutesSummary"
import { Feedback } from "../../Feedback"

export type TagSectionProps = {
  tag: OpenAPI.TagObject
} & React.HTMLAttributes<HTMLDivElement>

const Section = dynamic<SectionProps>(
  async () => import("@/components/Section")
) as React.FC<SectionProps>

const MDXContentClient = dynamic<MDXContentClientProps>(
  async () => import("@/components/MDXContent/Client"),
  {
    loading: () => <Loading />,
  }
) as React.FC<MDXContentClientProps>

const TagSectionComponent = ({ tag }: TagSectionProps) => {
  const { activePath, setActivePath } = useSidebar()
  const router = useRouter()
  const [loadData, setLoadData] = useState(false)
  const slugTagName = useMemo(() => getSectionId([tag.name]), [tag])
  const { area } = useArea()
  const { scrollableElement, scrollToTop } = useScrollController()
  const { isBrowser } = useIsBrowser()

  const root = useMemo(() => {
    if (!isBrowser) {
      return
    }

    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [scrollableElement, isBrowser])
  const { data: schemaData } = useSWR<{
    schema: OpenAPI.SchemaObject
  }>(
    loadData && tag["x-associatedSchema"]
      ? basePathUrl(
          `/schema?name=${tag["x-associatedSchema"].$ref}&area=${area}`
        )
      : null,
    swrFetcher,
    {
      errorRetryInterval: 2000,
    }
  )
  const { data: pathsData } = useSWR<{
    paths: OpenAPI.PathsObject
  }>(
    loadData ? basePathUrl(`/tag?tagName=${slugTagName}&area=${area}`) : null,
    swrFetcher,
    {
      errorRetryInterval: 2000,
    }
  )

  useEffect(() => {
    if (!isBrowser || !activePath || !activePath.includes(slugTagName)) {
      return
    }

    const tagName = activePath.split("_")
    if (tagName[0] !== slugTagName) {
      return
    }
    if (tagName.length === 1) {
      const elm = document.getElementById(tagName[0])
      if (elm && !checkElementInViewport(elm, 0)) {
        scrollToTop(
          elm.offsetTop + (elm.offsetParent as HTMLElement)?.offsetTop,
          0
        )
      }
    } else if (tagName.length > 1) {
      setLoadData(true)
    }
  }, [slugTagName, activePath, isBrowser])

  return (
    <InView
      className={clsx("min-h-screen", !loadData && "relative")}
      id={slugTagName}
      threshold={0.8}
      rootMargin={`112px 0px 112px 0px`}
      root={root}
      onChange={(inView) => {
        if (!inView) {
          return
        }
        if (!loadData) {
          setLoadData(true)
        }
        // ensure that the hash link doesn't change if it links to an inner path
        const currentHashArr = location.hash.replace("#", "").split("_")
        if (currentHashArr.length < 2 || currentHashArr[0] !== slugTagName) {
          if (location.hash !== slugTagName) {
            router.push(`#${slugTagName}`, {
              scroll: false,
            })
          }
          if (activePath !== slugTagName) {
            setActivePath(slugTagName)
          }
        }
      }}
    >
      <SectionContainer>
        <DividedLayout
          mainContent={
            <div>
              <H2>{tag.name}</H2>
              {tag.description && (
                <Section>
                  <MDXContentClient
                    content={tag.description}
                    scope={{
                      addToSidebar: false,
                    }}
                  />
                </Section>
              )}
              {tag.externalDocs && (
                <p className="mt-1">
                  <span className="text-medium-plus">Related guide:</span>{" "}
                  <Link
                    href={tag.externalDocs.url}
                    target="_blank"
                    variant="content"
                  >
                    {tag.externalDocs.description || "Read More"}
                  </Link>
                </p>
              )}
              <Feedback
                extraData={{
                  section: tag.name,
                }}
                question="Was this section helpful?"
              />
            </div>
          }
          codeContent={
            <RoutesSummary tagName={tag.name} paths={pathsData?.paths || {}} />
          }
        />
      </SectionContainer>
      {schemaData && (
        <TagSectionSchema schema={schemaData.schema} tagName={tag.name} />
      )}
      {loadData && pathsData && (
        <LoadingProvider initialLoading={true}>
          <TagPaths tag={tag} paths={pathsData.paths} />
        </LoadingProvider>
      )}
      {!loadData && <SectionDivider className="lg:!-left-1" />}
    </InView>
  )
}

export default TagSectionComponent
