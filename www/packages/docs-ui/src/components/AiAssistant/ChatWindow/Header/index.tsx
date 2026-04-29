"use client"

import clsx from "clsx"
import React from "react"
import { Tooltip } from "../../../Tooltip"
import { Link } from "../../../Link"
import { ShieldCheck, XMark } from "@medusajs/icons"
import { Button } from "../../../Button"
import { useAiAssistant } from "../../../../providers/AiAssistant"

export const AiAssistantChatWindowHeader = () => {
  const { setChatOpened } = useAiAssistant()
  return (
    <div
      className={clsx(
        "flex gap-docs_0.5 items-center justify-between",
        "w-full px-docs_1 py-docs_0.75 rounded-t-docs_sm",
        "border-medusa-border-base border-b"
      )}
    >
      <div className="flex gap-[6px] items-center">
        <span className="text-h3 text-medusa-fg-base">Ask Bloom</span>
        <Tooltip
          tooltipChildren={
            <>
              This site is protected by reCAPTCHA and
              <br />
              the{" "}
              <Link href="https://policies.google.com/privacy">
                Google Privacy Policy
              </Link>{" "}
              and <Link href="https://policies.google.com/terms">ToS</Link>{" "}
              apply
            </>
          }
          clickable={true}
          tooltipClassName={"!text-compact-small-plus"}
        >
          <ShieldCheck className="text-medusa-fg-muted" />
        </Tooltip>
      </div>
      <Button
        variant="transparent-clear"
        className="!p-[6.5px] rounded-docs_sm"
        onClick={() => setChatOpened(false)}
      >
        <XMark className="text-medusa-fg-muted" height={15} width={15} />
      </Button>
    </div>
  )
}
