import React from "react"
import styles from "./styles.module.css"
import { IconProps } from ".."

const IconExternalLink: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 16 16"
      fill="none"
      className={styles.iconExternalLink}
    >
      <path
        d="M12.0099 3.99023L3.94995 12.0502"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-secondary dark:tw-stroke-medusa-icon-secondary"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.35156 3.94971L12.0098 3.9896L12.0505 9.64865"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-secondary dark:tw-stroke-medusa-icon-secondary"
        }
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconExternalLink
