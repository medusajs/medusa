import { FC, PropsWithChildren } from "react"
import { SiteSettings } from "@medusajs/medusa"
import clsx from "clsx"
import { useGetSiteSettings } from "../../../../../../../../../hooks/admin"

export const textAlignOptions = [
  {
    label: "Left",
    value: "left",
  },
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Right",
    value: "right",
  },
  {
    label: "Justify",
    value: "justify",
  },
]

export const backgroundTypeOptions = [
  {
    label: "Image",
    value: "image",
  },
  {
    label: "Video",
    value: "video",
  },
  {
    label: "None",
    value: "none",
  },
]

export const backgroundPositionOptions = [
  {
    label: "Center",
    value: "center",
  },
  {
    label: "Top left",
    value: "top left",
  },
  {
    label: "Top",
    value: "top",
  },
  {
    label: "Top right",
    value: "top right",
  },
  {
    label: "Right",
    value: "right",
  },
  {
    label: "Bottom left",
    value: "bottom left",
  },
  {
    label: "Bottom",
    value: "bottom",
  },
  {
    label: "Bottom right",
    value: "bottom right",
  },
  {
    label: "Left",
    value: "left",
  },
]

export const backgroundSizeOptions = [
  {
    label: "Cover",
    value: "cover",
  },
  {
    label: "Contain",
    value: "contain",
  },
  {
    label: "Auto",
    value: "auto",
  },
]

export const backgroundRepeatOptions = [
  {
    label: "Off",
    value: "no-repeat",
  },
  {
    label: "Horizontally",
    value: "repeat-x",
  },
  {
    label: "Vertically",
    value: "repeat-y",
  },
  {
    label: "Both",
    value: "repeat",
  },
]

export const blendModeOptions = [
  {
    label: "Normal",
    value: "normal",
  },
  {
    label: "Multiply",
    value: "multiply",
  },
  {
    label: "Screen",
    value: "screen",
  },
  {
    label: "Overlay",
    value: "overlay",
  },
  {
    label: "Darken",
    value: "darken",
  },
  {
    label: "Lighten",
    value: "lighten",
  },
  {
    label: "Color",
    value: "color",
  },
  {
    label: "Color dodge",
    value: "color-dodge",
  },
  {
    label: "Color burn",
    value: "color-burn",
  },
  {
    label: "Hard light",
    value: "hard-light",
  },
  {
    label: "Soft light",
    value: "soft-light",
  },
  {
    label: "Difference",
    value: "difference",
  },
  {
    label: "Exclusion",
    value: "exclusion",
  },
  {
    label: "Hue",
    value: "hue",
  },
  {
    label: "Saturation",
    value: "saturation",
  },
  {
    label: "Luminosity",
    value: "luminosity",
  },
]

export const ColorOptionLabel: FC<
  PropsWithChildren<{
    color: string
    isCustom?: boolean
    showSwatch?: boolean
  }>
> = ({ color, isCustom, showSwatch = true, children }) => {
  const isTransparent = color === "transparent"
  return (
    <div className="flex items-center">
      {showSwatch && (
        <div
          className={clsx(`h-4 w-4 mr-2 rounded-full border border-grey-20`, {
            "!bg-gradient-to-br !from-indigo-500 !via-purple-500 !to-pink-500":
              isCustom,
          })}
          style={{
            backgroundColor: isCustom ? undefined : color,
            backgroundSize: isTransparent ? "8px 8px" : undefined,
            backgroundPosition: isTransparent
              ? "0 0, 0 4px, 4px -4px, -4px 0px"
              : undefined,
            backgroundImage: isTransparent
              ? "linear-gradient(45deg, #ddd 25%, transparent 25%), linear-gradient(-45deg, #ddd 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #ddd 75%), linear-gradient(-45deg, transparent 75%, #ddd 75%)"
              : undefined,
          }}
        />
      )}
      <div>{children}</div>
    </div>
  )
}

const baseColorOptions = [
  {
    value: "transparent",
    label: <ColorOptionLabel color="transparent">Transparent</ColorOptionLabel>,
  },
  {
    value: "#000",
    label: <ColorOptionLabel color="#000">Black</ColorOptionLabel>,
  },
  {
    value: "#fff",
    label: <ColorOptionLabel color="#fff">White</ColorOptionLabel>,
  },
]

export const getThemeColorOptions = (
  siteSettings: SiteSettings
): { label: JSX.Element; value: string }[] =>
  ["primary", "accent", "highlight"].flatMap((colorKey) => {
    const colorRange = (siteSettings || {})[`${colorKey}_theme_colors`]

    if (!colorRange) return []

    const options = Object.entries(colorRange)
      .sort((a) => (a[0] === "DEFAULT" ? -1 : 0))
      .map(([key, value]) => ({
        value: `var(--color-${colorKey}-${key})`,
        label: (
          <ColorOptionLabel color={value as string}>
            <span className="capitalize">{colorKey}</span>{" "}
            <span className="text-grey-40 lowercase">({key})</span>
          </ColorOptionLabel>
        ),
      }))

    return options
  })

export const getColorOptions = (siteSettings: SiteSettings) => [
  ...baseColorOptions,
  ...getThemeColorOptions(siteSettings),
]

export const useDefaultCustomColor = () => {
  const { site_settings } = useGetSiteSettings()

  return site_settings?.primary_theme_colors?.DEFAULT || "#ddd"
}
