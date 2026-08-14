"use client"

import React from "react"
import type { OpenAPI } from "types"
import { Fragment, Suspense, useMemo } from "react"
import dynamic from "next/dynamic"
import type { TagOperationProps } from "../Operation"
import clsx from "clsx"
import { useLoading } from "@/providers/loading"
import DividedLoading from "@/components/DividedLoading"
import { compareOperations } from "@/utils/sort-operations-utils"

const TagOperation = dynamic<TagOperationProps>(
  async () => import("../Operation")
) as React.FC<TagOperationProps>

export type TagPathsProps = {
  tag: OpenAPI.TagObject
  paths: OpenAPI.PathsObject
} & React.HTMLAttributes<HTMLDivElement>

const TagPaths = ({ tag, className, paths }: TagPathsProps) => {
  const { loading } = useLoading()

  const sortedOperations = useMemo(() => {
    const sortedOperations: {
      endpointPath: string
      method: string
      operation: OpenAPI.Operation
    }[] = []

    Object.entries(paths).forEach(([endpointPath, operations]) => {
      Object.entries(operations).forEach(([method, operation]) => {
        sortedOperations.push({
          endpointPath,
          method,
          operation: operation as OpenAPI.Operation,
        })
      })
    })

    sortedOperations.sort((a, b) => {
      return compareOperations({
        httpMethodA: a.method,
        httpMethodB: b.method,
        summaryA: a.operation.summary,
        summaryB: b.operation.summary,
      })
    })

    return sortedOperations
  }, [paths])

  return (
    <Suspense>
      <div className={clsx("relative", className)}>
        {loading && <DividedLoading className="mt-7" />}
        {sortedOperations.map(
          ({ endpointPath, method, operation }, operationIndex) => (
            <Fragment key={operationIndex}>
              <TagOperation
                method={method}
                operation={operation}
                tag={tag}
                key={`${operationIndex}`}
                endpointPath={endpointPath}
                className={clsx("pt-7")}
                noDivider={operationIndex === sortedOperations.length - 1}
              />
            </Fragment>
          )
        )}
      </div>
    </Suspense>
  )
}

export default TagPaths
