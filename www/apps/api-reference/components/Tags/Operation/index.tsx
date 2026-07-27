"use client"

import React from "react"
import type { OpenAPI } from "types"
import clsx from "clsx"
import { useEffect, useMemo } from "react"
import dynamic from "next/dynamic"
import { InView } from "react-intersection-observer"
import {
  isElmWindow,
  useIsBrowser,
  useScrollController,
  useSidebar,
} from "docs-ui"
import type { TagOperationCodeSectionProps } from "./CodeSection"
import TagsOperationDescriptionSection from "./DescriptionSection"
import DividedLayout from "@/layouts/Divided"
import { useLoading } from "@/providers/loading"
import SectionContainer from "../../Section/Container"
import { getSectionId } from "docs-utils"
import basePathUrl from "../../../utils/base-path-url"
import {
  isScrollSpyLocked,
  markScrollSpyNavigation,
  scheduleScrollSpyUpdate,
} from "@/utils/scroll-spy-lock"

const TagOperationCodeSection = dynamic<TagOperationCodeSectionProps>(
  async () => import("./CodeSection")
) as React.FC<TagOperationCodeSectionProps>

export type TagOperationProps = {
  operation: OpenAPI.Operation
  method?: string
  tag: OpenAPI.OpenAPIV3.TagObject
  endpointPath: string
  className?: string
  noDivider?: boolean
}

const TagOperation = ({
  operation,
  method,
  endpointPath,
  className,
  noDivider,
}: TagOperationProps) => {
  const { activePath, setActivePath } = useSidebar()
  // The URL path (without basePath) for this operation, precomputed in the
  // spec data (see `getPathsOfTag`). Falls back to the legacy section id.
  const path = useMemo(
    () =>
      operation["x-path"] ||
      getSectionId([...(operation.tags || []), operation.operationId]),
    [operation]
  )
  const anchorId = useMemo(
    () => operation["x-slug"] || path.split("/").pop() || path,
    [operation, path]
  )
  const { removeLoading } = useLoading()
  const { scrollableElement } = useScrollController()
  const { isBrowser } = useIsBrowser()
  const root = useMemo(() => {
    if (!isBrowser) {
      return
    }

    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [isBrowser, scrollableElement])

  // clear the tag's loading indicator once the operations render
  useEffect(() => {
    removeLoading()
  }, [removeLoading])

  return (
    <InView
      id={anchorId}
      // A thin band near the top of the scroll area, so the operation at the
      // top is the single active one (stable highlight, no bounce). Scrolling to
      // an operation on navigation is handled centrally by TagSection.
      threshold={0}
      rootMargin={`-112px 0px -80% 0px`}
      root={root}
      onChange={(inView) => {
        if (!inView || isScrollSpyLocked() || activePath === path) {
          return
        }
        // update the sidebar highlight and reflect the operation in the URL as
        // it scrolls into the active band (debounced so fast scrolling applies a
        // single update once it settles). Marked as a scroll-spy update so the
        // deep-link controller ignores the resulting pathname change.
        scheduleScrollSpyUpdate(() => {
          if (isScrollSpyLocked()) {
            return
          }
          setActivePath(path)
          markScrollSpyNavigation(path)
          if (isBrowser) {
            window.history.replaceState(null, "", basePathUrl(path))
          }
        })
      }}
    >
      <SectionContainer
        className={clsx("relative w-full pb-7", className)}
        noDivider={noDivider}
      >
        <div
          className={clsx("flex w-full justify-between gap-1")}
          data-testid="operation-container"
        >
          <DividedLayout
            mainContent={
              <TagsOperationDescriptionSection operation={operation} />
            }
            codeContent={
              <TagOperationCodeSection
                method={method || ""}
                operation={operation}
                endpointPath={endpointPath}
              />
            }
          />
        </div>
      </SectionContainer>
    </InView>
  )
}

export default TagOperation
