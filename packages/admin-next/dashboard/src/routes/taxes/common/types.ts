import { Override } from "./constants"

export type OverrideOption = {
  value: string
  label: string
}

export type OverrideState = {
  [K in Override]: boolean
}
