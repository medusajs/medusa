import React, { useEffect, useState } from "react"
import { CopyButton } from "../../../.."
import clsx from "clsx"
import { CheckMini, SquareTwoStack } from "@medusajs/icons"

export type CodeBlockCopyActionProps = {
  source: string
  inHeader: boolean
  iconColor: string
}

export const CodeBlockCopyAction = ({
  source,
  inHeader,
  iconColor,
}: CodeBlockCopyActionProps) => {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (copied) {
      setTimeout(() => {
        setCopied(false)
      }, 1000)
    }
  }, [copied])

  return (
    <CopyButton
      text={source}
      tooltipClassName="font-base"
      className={clsx(
        "h-fit",
        !inHeader && "p-[6px]",
        inHeader && "px-[6px] pb-[6px]"
      )}
      onCopy={() => setCopied(true)}
    >
      {!copied && <SquareTwoStack className={clsx(iconColor)} />}
      {copied && <CheckMini className={clsx(iconColor)} />}
    </CopyButton>
  )
}
