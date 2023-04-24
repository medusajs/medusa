import clsx from "clsx"
import { FieldValues, UseFormGetValues } from "react-hook-form/dist/types"
import tailwindColors from "tailwindcss/colors"
import { Font } from "../../../types/shared"

export const themeColors = [
  ...Object.keys(tailwindColors)
    .filter(
      (color) =>
        ![
          "inherit",
          "transparent",
          "current",
          "black",
          "white",
          "lightBlue",
          "warmGray",
          "trueGray",
          "coolGray",
          "blueGray",
        ].includes(color)
    )
    .reverse(),
  "custom",
]

export const colorRange = [
  "50",
  "100",
  "200",
  "300",
  "400",
  "500",
  "600",
  "700",
  "800",
  "900",
]

export const defaultColorOptions = (
  themeColor: string,
  watch: UseFormGetValues<FieldValues>
) =>
  colorRange
    .map((colorType) => {
      const value = watch(
        `${themeColor.toLowerCase()}_theme_colors.${colorType}`
      )
      return {
        value,
        label: (
          <div className="flex items-center">
            <div
              style={{ backgroundColor: value }}
              className="h-4 w-4 mr-2 rounded-full"
            />
            {colorType}
          </div>
        ),
      }
    })
    .filter((option) => !!option.value)

export const colorOptions = themeColors.map((color) => ({
  value: color,
  label: (
    <div className="flex items-center">
      <div
        className={clsx(`h-4 w-4 mr-2 rounded-full`, {
          "bg-[#94a3b8]": color === "slate",
          "bg-[#9ca3af]": color === "gray",
          "bg-[#a1a1aa]": color === "zinc",
          "bg-[#a3a3a3]": color === "neutral",
          "bg-[#a8a29e]": color === "stone",
          "bg-[#f87171]": color === "red",
          "bg-[#fb923c]": color === "orange",
          "bg-[#fbbf24]": color === "amber",
          "bg-[#facc15]": color === "yellow",
          "bg-[#a3e635]": color === "lime",
          "bg-[#4ade80]": color === "green",
          "bg-[#34d399]": color === "emerald",
          "bg-[#2dd4bf]": color === "teal",
          "bg-[#22d3ee]": color === "cyan",
          "bg-[#38bdf8]": color === "sky",
          "bg-[#60a5fa]": color === "blue",
          "bg-[#818cf8]": color === "indigo",
          "bg-[#a78bfa]": color === "violet",
          "bg-[#c084fc]": color === "purple",
          "bg-[#d946ef]": color === "fuchsia",
          "bg-[#f472b6]": color === "pink",
          "bg-[#fb7185]": color === "rose",
          "bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500":
            color === "custom",
        })}
      />
      <span className="capitalize">{color}</span>
    </div>
  ),
}))

export interface SiteDetailsState {
  toggle: {
    primary_theme_color?: boolean
    accent_theme_color?: boolean
    highlight_theme_color?: boolean
  }
}

const siteDetailsActions = {
  toggle: (state, payload) => ({
    ...state,
    toggle: {
      ...state.toggle,
      [payload]: !state.toggle[payload],
    },
  }),
  openColorToggle: (state, payload) => ({
    ...state,
    toggle: {
      ...state.toggle,
      [payload]: true,
    },
  }),
  closeColorToggle: (state, payload) => ({
    ...state,
    toggle: {
      ...state.toggle,
      [payload]: false,
    },
  }),
}

export interface SiteDetailsAction {
  readonly type: keyof typeof siteDetailsActions
  readonly payload?: any
}

export const siteDetailsReducer = (
  state: SiteDetailsState,
  action: SiteDetailsAction
) => {
  const { type, payload } = action
  const newState = siteDetailsActions[type](state, payload)
  return newState
}

export const defaultPrimaryThemeColors = Object.entries(
  tailwindColors.indigo
).reduce((acc, [key, value]) => {
  acc[key] = value
  return acc
}, {})
export const defaultAccentThemeColors = Object.entries(
  tailwindColors.sky
).reduce((acc, [key, value]) => {
  acc[key] = value
  return acc
}, {})
export const defaultHighlightThemeColors = Object.entries(
  tailwindColors.yellow
).reduce((acc, [key, value]) => {
  acc[key] = value
  return acc
}, {})

export const selectFontOptions: (
  fonts: Font[]
) => { label: JSX.Element; value: string }[] = (fonts) =>
  fonts.map((font) => ({
    label: (
      <span className="whitespace-nowrap" style={{ fontFamily: font.family }}>
        {font.family}
      </span>
    ),
    value: font.family,
  }))
