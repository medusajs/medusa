import { clx } from "@medusajs/ui"
import { ConditionalTooltip } from "../../../../common/conditional-tooltip"
import { PlaceholderCell } from "../placeholder-cell"

type CellProps = {
  text?: string | number
  align?: "left" | "center" | "right"
  maxWidth?: number
}

type HeaderProps = {
  text: string
  align?: "left" | "center" | "right"
}

export const TextCell = ({ text, align = "left", maxWidth = 220 }: CellProps) => {
  if (!text) {
    return <PlaceholderCell />
  }

  const stringLength = text.toString().length

  return (
    <ConditionalTooltip content={text} showTooltip={stringLength > 20}>
    <div className={clx("flex h-full w-full items-center gap-x-3 overflow-hidden", {
      "justify-start text-start": align === "left",
      "justify-center text-center": align === "center",
      "justify-end text-end": align === "right",
    })}
    style={{
      maxWidth: maxWidth,
    }}>
      <span className="truncate">{text}</span>
    </div>
    </ConditionalTooltip>
  )
}

export const TextHeader = ({ text, align = "left" }: HeaderProps) => {
  return (
    <div className={clx("flex h-full w-full items-center", {
      "justify-start text-start": align === "left",
      "justify-center text-center": align === "center",
      "justify-end text-end": align === "right",
    })}>
      <span className="truncate">{text}</span>
    </div>
  )
}
