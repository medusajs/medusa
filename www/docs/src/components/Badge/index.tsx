import React from "react"
import styles from "./styles.module.css"
import clsx from "clsx"

export type BadgeProps = {
  className?: string
  variant: string
} & React.HTMLAttributes<HTMLSpanElement>

const variantClasses = {
  purple: styles.purpleBadge,
  orange: styles.orangeBadge,
  green: styles.greenBadge,
  blue: styles.blueBadge,
}

const Badge: React.FC<BadgeProps> = ({ className, variant, children }) => {
  return (
    <span className={clsx(styles.badge, className, variantClasses[variant])}>
      {children}
    </span>
  )
}

export default Badge
