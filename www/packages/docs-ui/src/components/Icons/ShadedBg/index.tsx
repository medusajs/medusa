"use client"

import React, { useMemo } from "react"
import { IconProps } from "@medusajs/icons/dist/types"
import { BadgeVariant } from "../../.."

type ShadedBgIconProps = IconProps & {
  variant?: BadgeVariant
}

export const ShadedBgIcon = ({
  variant = "blue",
  ...props
}: ShadedBgIconProps) => {
  const color = useMemo(() => {
    switch (variant) {
      case "neutral":
      case "code":
        return "#E4E4E7"
      case "blue":
        return "#BFDBFE"
      case "purple":
        return "#DDD6FE"
      case "green":
        return "#A7F3D0"
      case "orange":
        return "#FED7AA"
      case "red":
        return "#FECDD3"
    }
  }, [variant])

  return (
    <svg
      width="33"
      height="20"
      viewBox="0 0 33 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_7397_14857)">
        <rect
          x="10.136"
          y="-41.6187"
          width="1.5"
          height="64"
          transform="rotate(45 10.136 -41.6187)"
          fill={color}
        />
        <rect
          x="12.6109"
          y="-39.1439"
          width="1.5"
          height="64"
          transform="rotate(45 12.6109 -39.1439)"
          fill={color}
        />
        <rect
          x="15.0858"
          y="-36.6689"
          width="1.5"
          height="64"
          transform="rotate(45 15.0858 -36.6689)"
          fill={color}
        />
        <rect
          x="17.5607"
          y="-34.1941"
          width="1.5"
          height="64"
          transform="rotate(45 17.5607 -34.1941)"
          fill={color}
        />
        <rect
          x="20.0355"
          y="-31.7192"
          width="1.5"
          height="64"
          transform="rotate(45 20.0355 -31.7192)"
          fill={color}
        />
        <rect
          x="22.5104"
          y="-29.2443"
          width="1.5"
          height="64"
          transform="rotate(45 22.5104 -29.2443)"
          fill={color}
        />
        <rect
          x="24.9853"
          y="-26.7695"
          width="1.5"
          height="64"
          transform="rotate(45 24.9853 -26.7695)"
          fill={color}
        />
        <rect
          x="27.4602"
          y="-24.2946"
          width="1.5"
          height="64"
          transform="rotate(45 27.4602 -24.2946)"
          fill={color}
        />
        <rect
          x="29.935"
          y="-21.8197"
          width="1.5"
          height="64"
          transform="rotate(45 29.935 -21.8197)"
          fill={color}
        />
        <rect
          x="32.4099"
          y="-19.3448"
          width="1.5"
          height="64"
          transform="rotate(45 32.4099 -19.3448)"
          fill={color}
        />
        <rect
          x="34.8848"
          y="-16.87"
          width="1.5"
          height="64"
          transform="rotate(45 34.8848 -16.87)"
          fill={color}
        />
        <rect
          x="37.3597"
          y="-14.3951"
          width="1.5"
          height="64"
          transform="rotate(45 37.3597 -14.3951)"
          fill={color}
        />
        <rect
          x="39.8345"
          y="-11.9202"
          width="1.5"
          height="64"
          transform="rotate(45 39.8345 -11.9202)"
          fill={color}
        />
        <rect
          x="42.3094"
          y="-9.44537"
          width="1.5"
          height="64"
          transform="rotate(45 42.3094 -9.44537)"
          fill={color}
        />
        <rect
          x="44.7843"
          y="-6.97046"
          width="1.5"
          height="64"
          transform="rotate(45 44.7843 -6.97046)"
          fill={color}
        />
        <rect
          x="47.2592"
          y="-4.49561"
          width="1.5"
          height="64"
          transform="rotate(45 47.2592 -4.49561)"
          fill={color}
        />
        <rect
          x="49.734"
          y="-2.02075"
          width="1.5"
          height="64"
          transform="rotate(45 49.734 -2.02075)"
          fill={color}
        />
        <rect
          x="52.2089"
          y="0.454163"
          width="1.5"
          height="64"
          transform="rotate(45 52.2089 0.454163)"
          fill={color}
        />
        <rect
          x="54.6838"
          y="2.92902"
          width="1.5"
          height="64"
          transform="rotate(45 54.6838 2.92902)"
          fill={color}
        />
        <rect
          x="57.1586"
          y="5.40387"
          width="1.5"
          height="64"
          transform="rotate(45 57.1586 5.40387)"
          fill={color}
        />
        <rect
          x="59.6335"
          y="7.87878"
          width="1.5"
          height="64"
          transform="rotate(45 59.6335 7.87878)"
          fill={color}
        />
        <rect
          x="62.1084"
          y="10.3536"
          width="1.5"
          height="64"
          transform="rotate(45 62.1084 10.3536)"
          fill={color}
        />
        <rect
          x="64.5833"
          y="12.8285"
          width="1.5"
          height="64"
          transform="rotate(45 64.5833 12.8285)"
          fill={color}
        />
        <rect
          x="67.0581"
          y="15.3034"
          width="1.5"
          height="64"
          transform="rotate(45 67.0581 15.3034)"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_7397_14857">
          <rect
            width="82"
            height="64"
            fill="white"
            transform="translate(10.136 -41.6187) rotate(45)"
          />
        </clipPath>
      </defs>
    </svg>
  )
}
