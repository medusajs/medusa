import React from "react"
import { IconProps } from ".."

const IconFlyingBox: React.FC<IconProps> = ({
  iconColorClassName,
  ...props
}) => {
  return (
    <svg
      width={props.width || 20}
      height={props.height || 20}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M2.6232 5.9021H1.80406"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.44234 3.44348H1.80406"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.0978 16.5565H2.62378"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.3227 3.44348L13.5146 6.13742C13.4105 6.4841 13.0908 6.72178 12.7294 6.72178H10.1789C9.62979 6.72178 9.23639 6.19233 9.39375 5.66698L10.0609 3.44348"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.72057 10.8195H8.46533"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14.4564 13.2784H5.77873C4.46086 13.2784 3.51589 12.008 3.89453 10.7459L5.66481 4.84495C5.91478 4.01309 6.68026 3.44348 7.54901 3.44348H16.2275C17.5453 3.44348 18.4903 4.71382 18.1117 5.97596L16.3414 11.8769C16.0914 12.7088 15.3251 13.2784 14.4564 13.2784Z"
        className={
          iconColorClassName ||
          "tw-stroke-medusa-icon-subtle dark:tw-stroke-medusa-icon-subtle"
        }
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default IconFlyingBox
