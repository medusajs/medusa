"use client"

import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { useCallback, useEffect, useRef, useState } from "react"
import dynamic from "next/dynamic"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"
import type { TagOperationCodeSectionProps } from "./CodeSection"
import TagsOperationDescriptionSection from "./DescriptionSection"
import DividedLayout from "@/layouts/Divided"
import DividedLoading from "@/components/Loading/Divided"
import { CSSTransition } from "react-transition-group"

const TagOperationCodeSection = dynamic<TagOperationCodeSectionProps>(
  async () => import("./CodeSection")
) as React.FC<TagOperationCodeSectionProps>

export type TagOperationProps = {
  operation: Operation
  method?: string
  tag: OpenAPIV3.TagObject
  endpointPath: string
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TagOperation = ({
  operation,
  method,
  endpointPath,
}: TagOperationProps) => {
  const { setActivePath } = useSidebar()
  const [show, setShow] = useState(false)
  const path = getSectionId([...(operation.tags || []), operation.operationId])
  const nodeRef = useRef<Element | null>(null)
  // const nodeRef = useRef<HTMLDivElement>(null)
  const { ref } = useInView({
    threshold: 0.3,
    rootMargin: `57px 0px 0px 0px`,
    onChange: (changedInView) => {
      if (changedInView) {
        if (!show) {
          setShow(true)
        }
        // can't use next router as it doesn't support
        // changing url without scrolling
        history.pushState({}, "", `#${path}`)
        setActivePath(path)
      }
    },
  })

  // Use `useCallback` so we don't recreate the function on each render
  const setRefs = useCallback(
    (node: Element | null) => {
      // Ref's from useRef needs to have the node assigned to `current`
      nodeRef.current = node
      // Callback refs, like the one from `useInView`, is a function that takes the node as an argument
      ref(node)
    },
    [ref]
  )

  useEffect(() => {
    const enableShow = () => {
      setTimeout(() => {
        setShow(true)
      }, 300)
    }

    if (nodeRef && nodeRef.current) {
      const currentHash = location.hash.replace("#", "")
      if (currentHash === path) {
        setTimeout(() => {
          nodeRef.current?.scrollIntoView()
          enableShow()
        }, 300)
      } else if (currentHash.split("_")[0] === path.split("_")[0]) {
        enableShow()
      }
    }
  }, [nodeRef, path])

  return (
    <div
      className={clsx("relative min-h-screen w-full pt-[57px]")}
      id={path}
      ref={setRefs}
    >
      <CSSTransition
        in={!show}
        classNames={{ exit: "animate-fadeOut" }}
        timeout={100}
        unmountOnExit
      >
        <DividedLoading className="absolute top-0 left-0 h-full w-full" />
      </CSSTransition>
      <div
        className={clsx(
          "flex w-full justify-between gap-1 opacity-0",
          !show && "invisible",
          show && "animate-fadeIn"
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
          codeContentClassName="bg-docs-bg-surface dark:bg-docs-bg-surface-dark"
        />
      </div>
    </div>
  )
}

export default TagOperation
