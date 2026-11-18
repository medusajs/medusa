const tailwindFontFamily = {
  sans: [
    "ui-sans-serif",
    "system-ui",
    "sans-serif",
    '"Apple Color Emoji"',
    '"Segoe UI Emoji"',
    '"Segoe UI Symbol"',
    '"Noto Color Emoji"',
  ],
  serif: [
    "ui-serif",
    "Georgia",
    "Cambria",
    '"Times New Roman"',
    "Times",
    "serif",
  ],
  mono: [
    "ui-monospace",
    "SFMono-Regular",
    "Menlo",
    "Monaco",
    "Consolas",
    '"Liberation Mono"',
    '"Courier New"',
    "monospace",
  ],
}

export const FONT_FAMILY_SANS = ["Inter", ...tailwindFontFamily.sans]
export const FONT_FAMILY_MONO = ["Roboto Mono", ...tailwindFontFamily.mono]

export const TRANSITION_PROPERTY_FG =
  "color, background-color, border-color, box-shadow, opacity"

export const KEYFRAMES = {
  "accordion-down": {
    from: { height: "0px" },
    to: { height: "var(--radix-accordion-content-height)" },
  },
  "accordion-up": {
    from: { height: "var(--radix-accordion-content-height)" },
    to: { height: "0px" },
  },
}

export const ANIMATION = {
  "accordion-down": "accordion-down 0.2s ease-out",
  "accordion-up": "accordion-up 0.2s ease-out",
}

export const BORDER_RADIUS = {
  xs: "0.125rem",
}
