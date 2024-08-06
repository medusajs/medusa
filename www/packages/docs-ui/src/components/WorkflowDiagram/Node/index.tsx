"use client"

import { Text } from "@medusajs/ui"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { WorkflowStep } from "types"
import { Tooltip } from "../../.."

export type WorkflowDiagramNodeProps = {
  step: WorkflowStep
}

export const WorkflowDiagramNode = ({ step }: WorkflowDiagramNodeProps) => {
  const stepId = step.name.split(".").pop()

  /**
   * We can't rely on the built-in hash scrolling because the collapsible,
   * so we instead need to manually scroll to the step when the hash changes
   */
  const handleScrollTo = () => {
    if (!stepId) {
      return
    }

    const historyItem = document.getElementById(stepId)

    if (!historyItem) {
      return
    }

    /**
     * Scroll to the step if it's the one we're looking for but
     * we need to wait for the collapsible to open before scrolling
     */
    setTimeout(() => {
      historyItem.scrollIntoView({
        behavior: "smooth",
        block: "end",
      })
    }, 100)
  }

  return (
    <Link
      href={step.link || `#${step.name}`}
      onClick={handleScrollTo}
      className="focus-visible:shadow-borders-focus transition-fg rounded-docs_sm outline-none"
    >
      <Tooltip
        html={`<h4 class="text-compact-x-small-plus">${step.name}</h4>${
          step.description ? `<span>${step.description}</span>` : ``
        }`}
        tooltipClassName="!text-left"
      >
        <div
          className={clsx(
            "shadow-borders-base flex min-w-[120px] bg-medusa-bg-base",
            "items-center rounded-docs_sm py-docs_0.125 px-docs_0.5",
            step.type === "hook" && "gap-x-docs_0.125"
          )}
          data-step-id={step.name}
        >
          {step.type === "hook" && (
            <div className="flex size-[20px] items-center justify-center">
              <div
                className={clsx(
                  "size-docs_0.5 rounded-docs_xxs shadow-[inset_0_0_0_1px_rgba(0,0,0,0.12)]",
                  "bg-medusa-tag-green-bg"
                )}
              />
            </div>
          )}
          <Text
            size="xsmall"
            leading="compact"
            weight="plus"
            className="select-none"
          >
            {stepId}
          </Text>
        </div>
      </Tooltip>
    </Link>
  )
}
