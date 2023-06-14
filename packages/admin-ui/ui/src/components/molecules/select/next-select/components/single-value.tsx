import { GroupBase, SingleValueProps } from "react-select"

import Tooltip from "../../../../atoms/tooltip"
import clsx from "clsx"
import { hasPrefix } from "../utils"
import { useRef } from "react"

const SingleValue = <
  Option,
  IsMulti extends boolean,
  Group extends GroupBase<Option>
>({
  innerProps,
  children,
  cx,
  className,
  isDisabled,
  data,
  getValue,
}: SingleValueProps<Option, IsMulti, Group>) => {
  const prefix = hasPrefix(data) ? data.prefix : null

  const isEllipsisActive = (e: HTMLDivElement | null) => {
    if (!e || !(e.offsetParent as HTMLDivElement)?.offsetWidth) {
      return false
    }

    return (e.offsetParent as HTMLDivElement).offsetWidth < e.scrollWidth
  }

  const getToolTipValue = () => {
    const values = getValue()
    if (!values.length) {
      return null
    }

    const value = values[0] as { label: string } // option with label
    return value.label ?? null
  }

  const toolTip = getToolTipValue()

  const ref = useRef(null)

  return (
    <Tooltip
      className={clsx({ hidden: !isEllipsisActive(ref.current) || !toolTip })}
      delayDuration={1000}
      content={<div>{toolTip}</div>}
    >
      <div
        {...innerProps}
        ref={ref}
        className={cx(
          {
            "single-value": true,
            "single-value--is-disabled": isDisabled,
          },
          clsx(
            "absolute top-1/2 -translate-y-1/2 overflow-hidden overflow-ellipsis whitespace-nowrap",
            className
          )
        )}
      >
        <div className="gap-x-xsmall inter-base-regular flex items-center">
          {prefix && <span className="inter-base-semibold">{prefix}</span>}
          {children}
        </div>
      </div>
    </Tooltip>
  )
}

export default SingleValue
