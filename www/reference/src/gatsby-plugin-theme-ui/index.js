import "../fonts/index.css"

import breakpoints from "./breakpoints"
import buttons from "./buttons"
import spacing from "./spacing"
import shadows from "./shadows"
import forms from "./forms"
import labels from "./labels"

// eslint-disable-next-line import/no-anonymous-default-export
export default {
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
    primary: "#53725D",
    secondary: "#79B28A",
    danger: "#FF7675",
    placeholder: "#a3acb9",
    dark: "#0a3149",
    darkContrast: "#0a314940",
    light: "#ffffff",
    faded: "#eef0f5",
    fadedContrast: "#eef0f540",
  },
  borders: {
    hairline: "1px solid #E3E8EE",
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
