"use client"

import { Text } from "@medusajs/ui"
import clsx from "clsx"
import Link from "next/link"
import React from "react"
import { WorkflowStepUi } from "types"
import { InlineCode, MarkdownContent, Tooltip } from "../../.."
import { Bolt, InformationCircle } from "@medusajs/icons"

export type WorkflowDiagramNodeProps = {
  step: WorkflowStepUi
}

export const WorkflowDiagramStepNode = ({ step }: WorkflowDiagramNodeProps) => {
  const stepId = step.name.split(".").pop()

  return (
    <Tooltip
      tooltipClassName="!text-left max-w-[300px] text-pretty overflow-scroll"
      tooltipChildren={
        <>
          <h4 className="text-compact-x-small-plus">{step.name}</h4>
          {step.when && (
            <span className="block py-docs_0.25">
              Runs only if a <InlineCode>when</InlineCode> condition is
              satisfied.
            </span>
          )}
          {step.description && (
            <MarkdownContent
              allowedElements={["a", "strong", "code"]}
              unwrapDisallowed={true}
            >
              {step.description}
            </MarkdownContent>
          )}
        </>
      }
      clickable={true}
      place="right"
    >
      <Link
        href={step.link || `#${step.name}`}
        className="focus-visible:shadow-borders-focus transition-fg rounded-docs_sm outline-none"
      >
        <div
          className={clsx(
            "shadow-borders-base flex min-w-[120px] w-min bg-medusa-bg-base",
            "items-center rounded-docs_sm py-docs_0.125 px-docs_0.5",
            (step.type === "hook" || step.when) && "gap-x-docs_0.125"
          )}
          data-step-id={step.name}
        >
          {step.type === "hook" && (
            <div className="flex size-[20px] items-center justify-center text-medusa-tag-orange-icon">
              <Bolt />
            </div>
          )}
          {step.when && (
            <div className="flex size-[20px] items-center justify-center text-medusa-tag-green-icon">
              <InformationCircle />
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
      </Link>
    </Tooltip>
  )
}
