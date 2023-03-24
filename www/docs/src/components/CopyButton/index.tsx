import React, { useState, useEffect, useRef, useCallback } from "react"
// @ts-expect-error: TODO, we need to make theme-classic have type: module
import copy from "copy-text-to-clipboard"
import Tooltip from "@site/src/theme/Tooltip"

type CopyButtonProps = {
  text: string
  buttonClassName?: string
  tooltipClassName?: string
} & React.HTMLAttributes<HTMLDivElement>

const CopyButton: React.FC<CopyButtonProps> = ({
  text,
  buttonClassName = "",
  tooltipClassName = "",
  children,
}) => {
  const [isCopied, setIsCopied] = useState(false)
  const copyTimeout = useRef(undefined)

  const handleCopy = useCallback(() => {
    copy(text)
    setIsCopied(true)
    copyTimeout.current = window.setTimeout(() => {
      setIsCopied(false)
    }, 1000)
  }, [text])

  useEffect(() => () => window.clearTimeout(copyTimeout.current), [])

  return (
    <Tooltip
      text={isCopied ? `Copied!` : `Copy to Clipboard`}
      tooltipClassName={tooltipClassName}
    >
      <span className={`copy-action ${buttonClassName}`} onClick={handleCopy}>
        {children}
      </span>
    </Tooltip>
  )
}

export default CopyButton
