"use client"

import React from "react"
import { CopyButton } from "@/components/CopyButton"
import {
  useGenerateSnippet,
  UseGenerateSnippet,
} from "@/hooks/use-generate-snippet"
import { SquareTwoStack, CheckCircle } from "@medusajs/icons"

export type CopyGeneratedSnippetButtonProps = UseGenerateSnippet & {
  tooltipText?: string
}

export const CopyGeneratedSnippetButton = ({
  tooltipText,
  ...props
}: CopyGeneratedSnippetButtonProps) => {
  const { snippet } = useGenerateSnippet(props)

  return (
    <CopyButton
      text={snippet}
      tooltipText={tooltipText}
      className="inline-block w-fit"
    >
      {({ isCopied }) => {
        if (isCopied) {
          return <CheckCircle />
        }
        return <SquareTwoStack />
      }}
    </CopyButton>
  )
}
