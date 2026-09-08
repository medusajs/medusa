"use client"

import React from "react"
import { InView } from "react-intersection-observer"
import { useEffect, useMemo, useState } from "react"
import {
  isElmWindow,
  swrFetcher,
  useIsBrowser,
  useScrollController,
  useSidebar,
  Loading,
  Link,
  H1,
  WideSection,
} from "docs-ui"
import dynamic from "next/dynamic"
import { usePathname } from "next/navigation"
import type { SectionProps } from "../../Section"
import type { MDXContentClientProps } from "../../MDXContent/Client"
import DividedLayout from "@/layouts/Divided"
import LoadingProvider from "@/providers/loading"
import SectionContainer from "../../Section/Container"
import { useArea } from "@/providers/area"
import SectionDivider from "../../Section/Divider"
import clsx from "clsx"
import { OpenAPI } from "types"
import TagSectionSchema from "./Schema"
import TagPaths from "../Paths"
import DividedLoading from "../../DividedLoading"
import useSWR from "swr"
import basePathUrl from "../../../utils/base-path-url"
import { getApiRefTagSlug } from "docs-utils"
import { RoutesSummary } from "./RoutesSummary"
import { Feedback } from "../../Feedback"
import ViewAsMarkdown from "@/components/ViewAsMarkdown"
import { ArrowLeft } from "@medusajs/icons"
import {
  isScrollSpyLocked,
  isScrollSpyNavigation,
  lockScrollSpy,
  markScrollSpyNavigation,
  scheduleScrollSpyUpdate,
} from "@/utils/scroll-spy-lock"

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
  const [loadData, setLoadData] = useState(false)
  const slugTagName = useMemo(() => getApiRefTagSlug(tag.name), [tag])
  const { area } = useArea()
  const tagPath = useMemo(() => `/${area}/${slugTagName}`, [area, slugTagName])
  const pathname = usePathname()
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

  // load the tag's operations whenever we're within this tag (the tag page
  // itself or one of its operations).
  useEffect(() => {
    if (pathname?.startsWith(tagPath) || activePath?.startsWith(tagPath)) {
      setLoadData(true)
    }
  }, [pathname, activePath, tagPath])

  // Deep-link scroll controller: on navigation to a section within this tag
  // (heading, schema, or an operation), scroll to it and keep it anchored while
  // the layout settles (schema/code samples load). Scroll-spy is locked for the
  // duration so no other section claims the URL and aborts the scroll. Only runs
  // for real navigations — scroll-spy URL updates are ignored.
  useEffect(() => {
    if (!isBrowser || !pathname || !pathname.startsWith(tagPath)) {
      return
    }
    if (isScrollSpyNavigation(pathname)) {
      return
    }

    const rest = pathname.slice(tagPath.length).replace(/^\//, "")
    const targetId = rest === "" ? slugTagName : rest

    const release = lockScrollSpy()
    let cancelled = false
    const scrollTarget: EventTarget | null | undefined = isElmWindow(
      scrollableElement
    )
      ? window
      : scrollableElement

    const scrollToTarget = () => {
      if (cancelled) {
        return
      }
      const elm = document.getElementById(targetId)
      if (!elm) {
        return
      }
      // compute the element's offset within the scroll container from its
      // bounding rect (offsetTop only accounts for the nearest positioned
      // ancestor, which undercounts for deeply-nested operations).
      const container =
        scrollableElement instanceof HTMLElement ? scrollableElement : undefined
      const offset = container
        ? elm.getBoundingClientRect().top -
          container.getBoundingClientRect().top +
          container.scrollTop
        : elm.getBoundingClientRect().top + window.scrollY
      scrollToTop(offset, 0)
    }

    const stop = () => {
      cancelled = true
      cleanup()
    }
    const userScrollEvents = ["wheel", "touchmove", "keydown"]
    userScrollEvents.forEach((evt) =>
      scrollTarget?.addEventListener(evt, stop, { passive: true })
    )

    const content = document.getElementById("content")
    const resizeObserver =
      content && typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => scrollToTarget())
        : null
    resizeObserver?.observe(content as Element)

    const timeout = setTimeout(stop, 10000)
    scrollToTarget()

    function cleanup() {
      resizeObserver?.disconnect()
      clearTimeout(timeout)
      userScrollEvents.forEach((evt) =>
        scrollTarget?.removeEventListener(evt, stop)
      )
      release()
    }

    return cleanup
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, tagPath, slugTagName, isBrowser, scrollableElement])

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
        if (isScrollSpyLocked()) {
          return
        }
        // when the tag heading is in view, reflect the tag path in the URL
        // (unless the active path is already one of the tag's operations).
        if (!activePath || !activePath.startsWith(`${tagPath}/`)) {
          if (activePath !== tagPath) {
            // debounced so fast scrolling applies a single update once it settles
            scheduleScrollSpyUpdate(() => {
              if (isScrollSpyLocked()) {
                return
              }
              setActivePath(tagPath)
              markScrollSpyNavigation(tagPath)
              if (isBrowser) {
                window.history.replaceState(null, "", basePathUrl(tagPath))
              }
            })
          }
        }
      }}
    >
      <SectionContainer noTopPadding>
        <DividedLayout
          mainContent={
            <div>
              <H1>{tag.name}</H1>
              <ViewAsMarkdown path={tagPath} className="mb-1" />
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
          codeContent={<RoutesSummary paths={pathsData?.paths || {}} />}
        />
      </SectionContainer>
      {schemaData && (
        <TagSectionSchema schema={schemaData.schema} tagName={tag.name} />
      )}
      {loadData && !pathsData && (
        <>
          <SectionContainer>
            <DividedLoading />
          </SectionContainer>
          <SectionContainer>
            <DividedLoading />
          </SectionContainer>
        </>
      )}
      {loadData && pathsData && (
        <LoadingProvider initialLoading={true}>
          <TagPaths tag={tag} paths={pathsData.paths} />
        </LoadingProvider>
      )}
      {loadData && pathsData && (
        <WideSection className="pt-2">
          <Link
            href={`/${area}`}
            variant="content"
            className="flex w-fit items-center gap-0.5"
          >
            <ArrowLeft />
            Back to Introduction
          </Link>
        </WideSection>
      )}
      {!loadData && <SectionDivider className="lg:!-left-1" />}
    </InView>
  )
}

export default TagSectionComponent
