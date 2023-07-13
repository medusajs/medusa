"use client"

import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { useCallback, useEffect, useRef } from "react"
import dynamic from "next/dynamic"
import Loading from "@/components/Loading"
import { useInView } from "react-intersection-observer"
import { useSidebar } from "@/providers/sidebar"
import type { TagOperationCodeSectionProps } from "./CodeSection"
import TagsOperationDescriptionSection from "./DescriptionSection"

const TagOperationCodeSection = dynamic<TagOperationCodeSectionProps>(
  async () => import("./CodeSection"),
  {
    loading: () => <Loading />,
  }
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
  const path = getSectionId([...(operation.tags || []), operation.operationId])
  const nodeRef = useRef<Element | null>()
  const { ref } = useInView({
    threshold: 0.5,
    onChange: (inView) => {
      if (inView) {
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
    if (nodeRef && nodeRef.current) {
      const currentHash = location.hash.replace("#", "")
      if (currentHash === path) {
        nodeRef.current.scrollIntoView()
      }
    }
  }, [nodeRef])

  return (
    <div
      className={clsx("flex min-h-screen justify-between gap-1 pt-[57px]")}
      id={path}
      ref={setRefs}
    >
      <div className={clsx("w-api-ref-content")}>
        <TagsOperationDescriptionSection operation={operation} />
      </div>
      <div className={clsx("w-api-ref-code z-10")}>
        <TagOperationCodeSection
          method={method || ""}
          operation={operation}
          endpointPath={endpointPath}
        />
      </div>
    </div>
  )
}

export default TagOperation
