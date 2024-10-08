import clsx from "clsx"
import React from "react"
import { CollapsibleReturn } from "../../../../hooks"

export type CodeBlockCollapsibleFadeProps = {
  type: "start" | "end"
  hasHeader?: boolean
} & Pick<CollapsibleReturn, "collapsed">

export const CodeBlockCollapsibleFade = ({
  type,
  hasHeader = false,
  collapsed,
}: CodeBlockCollapsibleFadeProps) => {
  if (!collapsed) {
    return <></>
  }

  return (
    <span
      className={clsx(
        "absolute flex flex-col z-10",
        hasHeader && "left-[6px] w-[calc(100%-12px)]",
        !hasHeader && "w-full left-0",
        type === "start" && [
          hasHeader && "top-[44px]",
          !hasHeader && "top-[36px]",
        ],
        type === "end" && [
          hasHeader && "bottom-[44px]",
          !hasHeader && "bottom-[36px]",
        ]
      )}
    >
      {type === "end" && (
        <span
          className={clsx(
            "w-full h-[56px]",
            "bg-code-fade-bottom-to-top dark:bg-code-fade-bottom-to-top-dark"
          )}
        />
      )}
      {type === "start" && (
        <span
          className={clsx(
            "w-full h-[56px]",
            "bg-code-fade-top-to-bottom dark:bg-code-fade-top-to-bottom-dark"
          )}
        />
      )}
    </span>
  )
}
