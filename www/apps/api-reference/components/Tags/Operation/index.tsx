"use client"

import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
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
import { useRouter } from "next/navigation"
import SectionDivider from "../../Section/Divider"
import checkElementInViewport from "../../../utils/check-element-in-viewport"
import DividedLoading from "../../DividedLoading"

const TagOperationCodeSection = dynamic<TagOperationCodeSectionProps>(
  async () => import("./CodeSection")
) as React.FC<TagOperationCodeSectionProps>

export type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
  endpointPath: string
  className?: string
}

const TagOperation = ({
  operation,
  method,
  endpointPath,
  className,
}: TagOperationProps) => {
  const { activePath, setActivePath } = useSidebar()
  const router = useRouter()
  const [show, setShow] = useState(false)
  const path = useMemo(
    () => getSectionId([...(operation.tags || []), operation.operationId]),
    [operation]
  )
  const nodeRef = useRef(null)
  const { loading, removeLoading } = useLoading()
  const { scrollableElement, scrollToTop } = useScrollController()
  const { isBrowser } = useIsBrowser()
  const root = useMemo(() => {
    if (!isBrowser) {
      return
    }

    return isElmWindow(scrollableElement) ? document.body : scrollableElement
  }, [isBrowser, scrollableElement])

  const scrollIntoView = useCallback(() => {
    if (!isBrowser) {
      return
    }

    if (nodeRef.current && !checkElementInViewport(nodeRef.current, 0)) {
      const elm = nodeRef.current as HTMLElement
      scrollToTop(
        elm.offsetTop + (elm.offsetParent as HTMLElement)?.offsetTop,
        0
      )
    }
    setShow(true)
  }, [nodeRef, isBrowser, scrollToTop])

  useEffect(() => {
    if (nodeRef && nodeRef.current) {
      removeLoading()
      const currentHash = location.hash.replace("#", "")
      if (currentHash === path) {
        setTimeout(scrollIntoView, 200)
      } else if (currentHash.split("_")[0] === path.split("_")[0]) {
        setShow(true)
      }
    }
  }, [nodeRef, path, scrollIntoView])

  return (
    <InView
      id={path}
      threshold={0.3}
      rootMargin={`112px 0px 112px 0px`}
      root={root}
      onChange={(changedInView) => {
        if (changedInView) {
          if (!show) {
            if (loading) {
              removeLoading()
            }
            setShow(true)
          }
          if (location.hash !== path) {
            router.push(`#${path}`, {
              scroll: false,
            })
          }
          if (activePath !== path) {
            setActivePath(path)
          }
        } else if (
          nodeRef.current &&
          !checkElementInViewport(nodeRef.current, 0)
        ) {
          setShow(false)
        }
      }}
    >
      <div
        ref={nodeRef}
        className={clsx("relative min-h-screen w-full pb-7", className)}
      >
        {!show && <DividedLoading className="mt-7" />}
        {show && (
          <div
            className={clsx(
              "flex w-full justify-between gap-1 opacity-0 animate-fadeIn"
            )}
            style={{
              animationFillMode: "forwards",
            }}
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
        )}
        <SectionDivider className="-left-[16px] lg:!-left-1/4" />
      </div>
    </InView>
  )
}

export default TagOperation
