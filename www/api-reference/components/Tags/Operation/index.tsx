"use client"

import type { Operation } from "@/types/openapi"
import clsx from "clsx"
import type { OpenAPIV3 } from "openapi-types"
import getSectionId from "@/utils/get-section-id"
import { Suspense, useEffect } from "react"
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

  useEffect(() => {
    const currentHash = location.hash.replace("#", "")
    if (currentHash === path) {
      const elm = document.getElementById(currentHash) as Element
      elm?.scrollIntoView()
    }
  }, [path])

  return (
    <Suspense fallback={<Loading />}>
      <div
        className={clsx("flex min-h-screen justify-between gap-1 pt-[57px]")}
        id={path}
        ref={ref}
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
    </Suspense>
  )
}

export default TagOperation
