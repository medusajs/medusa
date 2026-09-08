import { Tooltip, clx } from "@medusajs/ui"
import { useRef, useState } from "react"

interface TruncatedTextProps {
  /**
   * The full text. Rendered truncated; also used as the tooltip content.
   */
  text: string
  className?: string
}

/**
 * Truncating text span that shows a tooltip with the full text only when the
 * content actually overflows its container.
 *
 * Overflow is measured lazily on hover, so layout/resize changes don't need
 * to be observed.
 */
export const TruncatedText = ({ text, className }: TruncatedTextProps) => {
  const ref = useRef<HTMLSpanElement>(null)
  const [overflow, setOverflow] = useState(false)

  const check = () => {
    const el = ref.current
    if (el) {
      setOverflow(el.scrollWidth > el.clientWidth)
    }
  }

  return (
    // Cap the tooltip's width and break long unbroken strings so the text
    // wraps inside the bubble instead of overflowing it.
    <Tooltip
      content={text}
      hidden={!overflow}
      className="max-w-[360px] break-words"
    >
      <span
        ref={ref}
        onMouseEnter={check}
        // min-w-0 lets the span shrink below its content inside flex parents
        // (e.g. a Badge), which is what allows `truncate` to kick in.
        className={clx("min-w-0 truncate", className)}
      >
        {text}
      </span>
    </Tooltip>
  )
}
