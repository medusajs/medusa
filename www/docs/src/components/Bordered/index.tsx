import React from "react"
import clsx from "clsx"
import styles from "./styles.module.css"

type BorderedProps = {
  wrapperClassName?: string
} & React.HTMLAttributes<HTMLSpanElement>

const Bordered: React.FC<BorderedProps> = ({ wrapperClassName, children }) => {
  return (
    <span
      className={clsx(styles.elementWrapper, "no-zoom-img", wrapperClassName)}
    >
      {children}
    </span>
  )
}

export default Bordered
