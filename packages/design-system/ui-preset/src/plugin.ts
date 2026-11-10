import plugin from "tailwindcss/plugin"
import {
  ANIMATION,
  BORDER_RADIUS,
  FONT_FAMILY_MONO,
  FONT_FAMILY_SANS,
  KEYFRAMES,
  TRANSITION_PROPERTY_FG,
} from "./constants"
import { theme } from "./theme/extension/theme"
import { colors } from "./theme/tokens/colors"
import { components } from "./theme/tokens/components"
import { effects } from "./theme/tokens/effects"
import { typography } from "./theme/tokens/typography"

export default plugin(
  function medusaUi({ addBase, addComponents, addUtilities, config, ...api }) {
    const [darkMode, className = ".dark"] = ([] as string[]).concat(
      config("darkMode", "media")
    )

    addBase({
      "*": {
        borderColor: "var(--border-base)",
      },
      'button:not(:disabled), [role="button"]:not(:disabled)': {
        cursor: "pointer",
      },
    })

    // Only Tailwind 3 exposes `corePlugins`; v4 ships `outline-hidden` natively.
    if ("corePlugins" in api) {
      addUtilities({
        ".outline-hidden": {
          outlineStyle: "none",
          "@media (forced-colors: active)": {
            outline: "2px solid transparent",
            outlineOffset: "2px",
          },
        },
      })
    }

    addComponents(typography)

    addBase({
      ":root": { ...colors.light, ...effects.light },
      ...components.light,
    })

    if (darkMode === "class") {
      addBase({
        [className]: { ...colors.dark, ...effects.dark },
      })
    } else {
      addBase({
        "@media (prefers-color-scheme: dark)": {
          ":root": { ...colors.dark, ...effects.dark },
          ...components.dark,
        },
      })
    }
  },
  {
    theme: {
      extend: {
        ...theme.extend,
        borderRadius: BORDER_RADIUS,
        fontFamily: {
          sans: FONT_FAMILY_SANS,
          mono: FONT_FAMILY_MONO,
        },
        transitionProperty: {
          fg: TRANSITION_PROPERTY_FG,
        },
        keyframes: KEYFRAMES,
        animation: ANIMATION,
      },
    },
  }
)
