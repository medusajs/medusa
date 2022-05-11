import "../fonts/index.css"

import breakpoints from "./breakpoints"
import buttons from "./buttons"
import forms from "./forms"
import labels from "./labels"
import shadows from "./shadows"
import spacing from "./spacing"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  config: {
    initialColorModeName: 'light',
  },
  sizes: {
    headerHeight: "50px",
  },
  links: {
    topbar: {
      fontFamily: "body",
      fontSize: "2",
      textDecoration: "none",
      color: "dark",
    },
  },
  text: {
    labels,
    largest: {
      fontFamily: "body",
      fontSize: "22px",
      fontweight: "300",
      lineHeight: "1.5",
      letterSpacing: "normal",
    },
    large: {
      fontFamily: "body",
      fontSize: "18px",
      fontWeight: "300",
      lineHeight: "1.22",
      letterSpacing: "-0.5px",
    },
    medium: {
      fontFamily: "body",
      fontSize: "16px",
      fontWeight: "300",
      lineHeight: "1.22",
      letterSpacing: "normal",
    },
    base: {
      fontFamily: "body",
      fontsize: "14px",
      fontWeight: "300",
      lineHeight: "1.22",
      letterSpacing: "-0.25px",
    },
    small: {
      fontFamily: "body",
      fontSize: "12px",
      fontWeight: "300",
      lineHeight: "12px",
      letterSpacing: "0px",
    },
  },
  colors: {
    primary: "#7C53FF",
    primaryLight: "#7c53ff4a",
    secondary: "#79B28A",
    danger: "#FF7675",
    placeholder: "#a3acb9",
    dark: "#0a3149",
    darkContrast: "#0a314940",
    selectBg: "rgba(9, 10, 17, 0.8)",
    light: "#ffffff",
    faded: "#eef0f5",
    fadedContrast: "#eef0f540",
    text: '#000',
    background: '#fff',
    inverseText: '#000',
    separator: "#eef0f5",
    codeBoxShadow: "rgb(0 0 0 / 7%)",
    sectionSeparator: "#E3E8EE",
    modes: {
      dark: {
        text: '#fff',
        background: "#242526",
        inverseText: '#000',
        dark: "#eef0f5",
        separator: "#eef0f540",
        codeBoxShadow: "#d2d2d22b",
        sectionSeparator: "#404244",
        selectBg: "rgba(9, 10, 17, 0.8)"
      }
    }
  },
  borders: {
    hairline: "1px solid var(--theme-ui-colors-sectionSeparator)",
  },
  fontSizes: [12, 14, 16, 18, 22],
  fonts: {
    body:
      "-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Ubuntu, sans-serif",
    heading: "system-ui, sans-serif",
    monospace: "Menlo, monospace",
  },
  breakpoints,
  spacing,
  mediaQueries: {
    small: `@media screen and (min-width: ${breakpoints[0]})`,
    medium: `@media screen and (min-width: ${breakpoints[1]})`,
    large: `@media screen and (min-width: ${breakpoints[2]})`,
  },
  grid: {
    selectedShadow: `
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      inset rgba(206, 208, 190, 0.56) 0px 0px 0px 2px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      inset rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px, 
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      inset rgba(0, 0, 0, 0) 0px 0px 0px 0px;
    `,
    header: {
      padding: 2,
      fontSize: 1,
      fontFamily: "body",
    },
    data: {
      padding: 2,
      fontSize: 1,
      fontFamily: "body",
    },
  },
  shadows,
  variants: {
    loginCard: {
      boxShadow: "buttonBoxShadow",
      borderRadius: "3px",
    },
    badge: {
      fontSize: "0",
      color: "dark",
      backgroundColor: "lightest",
      boxShadow: "buttonBoxShadow",
      borderRadius: "3px",
      minWidth: "unset",
      px: "1",
    },
  },
  forms,
  buttons,
  radii: {
    small: "8px",
  },
}
