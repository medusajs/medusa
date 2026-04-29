import clsx from "clsx"
import { getSectionId } from "docs-utils"
import Link from "next/link"
import React, { useMemo } from "react"
import { OpenAPI } from "types"
import { compareOperations } from "@/utils/sort-operations-utils"

type RoutesSummaryProps = {
  tagName: string
  paths: OpenAPI.PathsObject
}

export const RoutesSummary = ({ tagName, paths }: RoutesSummaryProps) => {
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

  if (!sortedOperations.length) {
    return <></>
  }

  return (
    <div
      className={clsx(
        "hidden lg:flex flex-col",
        "bg-medusa-contrast-bg-base rounded-lg",
        "shadow-elevation-code-block dark:shadow-elevation-code-block-dark"
      )}
    >
      <div className="flex py-0.5 px-1 gap-x-0.75">
        <span className="text-medusa-contrast-fg-secondary text-code-label">
          API Routes
        </span>
      </div>
      <div className="flex p-[5px] justify-center items-center w-full">
        <div
          className={clsx(
            "bg-medusa-contrast-bg-subtle rounded-md border border-medusa-contrast-border-bot",
            "p-0.75 text-code-body w-full flex flex-col gap-y-0.25"
          )}
        >
          {sortedOperations.map(
            ({ endpointPath, method, operation }, operationIndex) => {
              const operationId = getSectionId([
                tagName,
                (operation as OpenAPI.Operation).operationId,
              ])
              return (
                <span className={clsx("flex gap-x-0.25")} key={operationIndex}>
                  <span
                    className={clsx(
                      "w-[15%]",
                      method === "get" && "text-medusa-tag-green-icon",
                      method === "post" && "text-medusa-tag-blue-icon",
                      method === "delete" && "text-medusa-tag-red-icon"
                    )}
                  >
                    {method.toUpperCase()}
                  </span>
                  <Link
                    href={`#${operationId}`}
                    className="text-medusa-contrast-fg-secondary hover:text-medusa-contrast-fg-primary w-[85%]"
                    data-testid="link"
                  >
                    {endpointPath}
                  </Link>
                </span>
              )
            }
          )}
        </div>
      </div>
    </div>
  )
}
