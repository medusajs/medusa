import React from "react"
import AdmonitionIconDanger from "./Danger"
import type { IconProps } from "@medusajs/icons/dist/types"

export default function AdmonitionIconCaution(props: IconProps): JSX.Element {
  return <AdmonitionIconDanger {...props} />
}
