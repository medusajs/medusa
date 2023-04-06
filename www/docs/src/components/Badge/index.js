import React from "react"
import styles from "./styles.module.css"
import clsx from "clsx"

export default function Badge({ className, variant, children }) {
  return (
    <span
      className={clsx(
        styles.badge,
        className,
        variant === "purple" && styles.purpleBadge,
        variant === "orange" && styles.orangeBadge,
        variant === "green" && styles.greenBadge,
        variant === "blue" && styles.blueBadge
      )}
    >
      {children}
    </span>
  )
}
