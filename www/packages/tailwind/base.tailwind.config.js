import plugin from "tailwindcss/plugin"
import presets from "./theme-presets"

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("@medusajs/ui-preset")],
  darkMode: ["class", `[data-theme="dark"]`], // hooks into docusaurus' dark mode settings
  // TODO: remove anything that can be replaced by the
  // UI preset
  theme: {
    extend: {
      colors: {
        /* docs colors */
        medusa: {
          bg: {
            subtle: {
              DEFAULT: "var(--docs-bg-subtle)",
              hover: "var(--docs-bg-subtle-hover)",
              pressed: "var(--docs-bg-subtle-pressed)",
            },
            base: {
              DEFAULT: "var(--docs-bg-base)",
              hover: "var(--docs-bg-base-hover)",
              pressed: "var(--docs-bg-base-pressed)",
            },
            component: "var(--docs-bg-component)",
            "switch-off": {
              DEFAULT: "var(--docs-bg-switch-off)",
              hover: "var(--docs-bg-switch-off-hover)",
            },
            interactive: "var(--docs-bg-interactive)",
            overlay: "var(--docs-bg-overlay)",
            disabled: "var(--docs-bg-disabled)",
            highlight: {
              DEFAULT: "var(--docs-bg-highlight)",
              hover: "var(--docs-bg-highlight-hover)",
            },
            field: {
              DEFAULT: "var(--docs-bg-field)",
              hover: "var(--docs-bg-field-hover)",
            },
          },
          fg: {
            base: "var(--docs-fg-base)",
            subtle: "var(--docs-fg-subtle)",
            muted: "var(--docs-fg-muted)",
            disabled: "var(--docs-fg-disabled)",
            on: {
              color: "var(--docs-fg-on-color)",
              inverted: "var(--docs-fg-on-inverted)",
            },
            interactive: {
              DEFAULT: "var(--docs-fg-interactive)",
              hover: "var(--docs-fg-interactive-hover)",
            },
            error: "var(--docs-fg-error)",
          },
          border: {
            base: "var(--docs-border-base)",
            strong: "var(--docs-border-strong)",
            loud: "var(--docs-border-loud)",
            interactive: "var(--docs-border-interactive)",
            error: "var(--docs-border-error)",
            danger: "var(--docs-border-danger)",
            transparent: "var(--docs-border-transparent)",
          },
          button: {
            inverted: {
              DEFAULT: "var(--docs-button-inverted)",
              hover: "var(--docs-button-inverted-hover)",
              pressed: "var(--docs-button-inverted-pressed)",
            },
            neutral: {
              DEFAULT: "var(--docs-button-neutral)",
              hover: "var(--docs-button-neutral-hover)",
              pressed: "var(--docs-button-neutral-pressed)",
            },
            danger: {
              DEFAULT: "var(--docs-button-danger)",
              hover: "var(--docs-button-danger-hover)",
              pressed: "var(--docs-button-danger-pressed)",
            },
            transparent: {
              DEFAULT: "var(--docs-button-transparent)",
              hover: "var(--docs-button-transparent-hover)",
              pressed: "var(--docs-button-transparent-pressed)",
            },
            disabled: "var(--docs-button-disabled)",
          },
          tag: {
            neutral: {
              bg: {
                DEFAULT: "var(--docs-tags-neutral-bg)",
                hover: "var(--docs-tags-neutral-bg-hover)",
              },
              text: "var(--docs-tags-neutral-text)",
              icon: "var(--docs-tags-neutral-icon)",
              border: "var(--docs-tags-neutral-border)",
            },
            purple: {
              bg: {
                DEFAULT: "var(--docs-tags-purple-bg)",
                hover: "var(--docs-tags-purple-bg-hover)",
              },
              text: "var(--docs-tags-purple-text)",
              icon: "var(--docs-tags-purple-icon)",
              border: "var(--docs-tags-purple-border)",
            },
            blue: {
              bg: {
                DEFAULT: "var(--docs-tags-blue-bg)",
                hover: "var(--docs-tags-blue-bg-hover)",
              },
              text: "var(--docs-tags-blue-text)",
              icon: "var(--docs-tags-blue-icon)",
              border: "var(--docs-tags-blue-border)",
            },
            green: {
              bg: {
                DEFAULT: "var(--docs-tags-green-bg)",
                hover: "var(--docs-tags-green-bg-hover)",
              },
              text: "var(--docs-tags-green-text)",
              icon: "var(--docs-tags-green-icon)",
              border: "var(--docs-tags-green-border)",
            },
            orange: {
              bg: {
                DEFAULT: "var(--docs-tags-orange-bg)",
                hover: "var(--docs-tags-orange-bg-hover)",
              },
              text: "var(--docs-tags-orange-text)",
              icon: "var(--docs-tags-orange-icon)",
              border: "var(--docs-tags-orange-border)",
            },
            red: {
              bg: {
                DEFAULT: "var(--docs-tags-red-bg)",
                hover: "var(--docs-tags-red-bg-hover)",
              },
              text: "var(--docs-tags-red-text)",
              icon: "var(--docs-tags-red-icon)",
              border: "var(--docs-tags-red-border)",
            },
          },
          code: {
            text: {
              base: "var(--docs-code-text-base)",
              subtle: "var(--docs-code-text-subtle)",
              highlight: "var(--docs-code-text-highlight)",
            },
            icon: "var(--docs-code-icon)",
            bg: {
              base: {
                DEFAULT: "var(--docs-code-bg-base)",
                // Need this one for color-fade
                transparent: "var(--docs-code-bg-transparent)",
              },
              header: "var(--docs-code-bg-header)",
            },
            border: "var(--docs-code-border)",
          },
        },
        /* docs defaults */
        docs: {
          bg: {
            DEFAULT: "var(--docs-bg)",
            surface: "var(--docs-bg-surface)",
          },
        },
      },
      boxShadow: {
        "card-rest":
          "0px 2px 4px 0px rgba(3, 7, 18, 0.04), 0px 1px 2px -1px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)",
        "card-rest-dark":
          "0px 2px 4px 0px rgba(0, 0, 0, 0.40), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 0px 0px 1px rgba(255, 255, 255, 0.10)",
        "card-hover":
          "0px 2px 8px 0px rgba(3, 7, 18, 0.10), 0px 1px 2px -1px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)",
        "card-hover-dark":
          "0px 2px 8px 0px rgba(0, 0, 0, 0.40), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 0px 0px 1px rgba(255, 255, 255, 0.10)",
        tooltip:
          "0px 4px 8px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)",
        "tooltip-dark":
          "0px 4px 8px 0px rgba(0, 0, 0, 0.32), 0px 0px 0px 1px rgba(255, 255, 255, 0.10)",
        flyout:
          "0px 8px 16px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08)",
        "flyout-dark":
          "0px 8px 16px 0px rgba(0, 0, 0, 0.32), 0px 0px 0px 1px rgba(255, 255, 255, 0.10)",
        modal:
          "0px 2px 24px 0px rgba(3, 7, 18, 0.08), 0px 16px 32px 0px rgba(3, 7, 18, 0.08), 0px 0px 0px 1px rgba(3, 7, 18, 0.08), 0px 0px 0px 2px rgba(229, 231, 235, 0.40) inset, 0px 0px 0px 1px #FFF inset",
        "modal-dark":
          "0px 2px 24px 0px rgba(0, 0, 0, 0.32), 0px 16px 32px 0px rgba(0, 0, 0, 0.32), 0px 0px 0px 1px rgba(255, 255, 255, 0.10)",
        "navbar-dark": "0px 1px 0px 0px #2E2E32",
        "button-colored":
          "0px 0.5px 0px 0px rgba(3, 7, 18, 0.16), 0px 0.25px 0px 0px rgba(3, 7, 18, 0.16), 0px 1.75px 0px 0px rgba(255, 255, 255, 0.16) inset",
        "button-colored-dark":
          "0px 0.5px 0px 0px rgba(0, 0, 0, 0.60), 0px 0.25px 0px 0px rgba(0, 0, 0, 0.60)",
        "button-colored-focused":
          "0px 0px 0px 3px rgba(59, 130, 246, 0.60), 0px 0px 0px 1px #FFF, 0px 0.5px 0px 0px rgba(3, 7, 18, 0.20), 0px 0.25px 0px 0px rgba(3, 7, 18, 0.20), 0px 1.75px 0px 0px rgba(255, 255, 255, 0.16) inset",
        "button-colored-focused-dark":
          "0px 0px 0px 3px rgba(96, 165, 250, 0.80), 0px 0px 0px 1px #1B1B1F, 0px 0.5px 0px 0px rgba(0, 0, 0, 0.60), 0px 0.25px 0px 0px rgba(0, 0, 0, 0.60)",
        "button-neutral":
          "0px 0.5px 0px 0px rgba(3, 7, 18, 0.16), 0px 0.25px 0px 0px rgba(3, 7, 18, 0.16)",
        "button-neutral-dark":
          "0px 0.5px 0px 0px rgba(0, 0, 0, 0.60), 0px 0.25px 0px 0px rgba(0, 0, 0, 0.60), 0px 1.5px 0px 0px rgba(255, 255, 255, 0.10) inset",
        "button-neutral-focused":
          "0px 0px 0px 3px rgba(59, 130, 246, 0.60), 0px 0px 0px 1px #FFF, 0px 0.5px 0px 0px rgba(3, 7, 18, 0.16), 0px 0.25px 0px 0px rgba(3, 7, 18, 0.16)",
        "button-neutral-focused-dark":
          "0px 0px 0px 3px rgba(96, 165, 250, 0.80), 0px 0px 0px 1px #1B1B1F, 0px 0.5px 0px 0px rgba(0, 0, 0, 0.60), 0px 0.25px 0px 0px rgba(0, 0, 0, 0.60), 0px 1.5px 0px 0px rgba(255, 255, 255, 0.10) inset",
        "button-secondary":
          "0px 1px 1px 0px rgba(3, 7, 18, 0.06), 0px -1px 0px 0px rgba(3, 7, 18, 0.08) inset",
        "button-secondary-dark":
          "0px 1px 1px 0px rgba(3, 7, 18, 0.06), 0px -1px 0px 0px rgba(3, 7, 18, 0.08) inset", // TODO change
        "button-secondary-focus":
          "0px 0px 0px 3px rgba(59, 130, 246, 0.60), 0px 0px 0px 1px #FFF, 0px 1px 1px 0px rgba(3, 7, 18, 0.06), 0px -1px 0px 0px rgba(3, 7, 18, 0.08) inset",
        "button-secondary-focus-dark":
          "0px 0px 0px 3px rgba(59, 130, 246, 0.60), 0px 0px 0px 1px #FFF, 0px 1px 1px 0px rgba(3, 7, 18, 0.06), 0px -1px 0px 0px rgba(3, 7, 18, 0.08) inset", // TODO change
        // TODO remove if not used
        active: "0px 0px 0px 3px #E1F0FF",
        "active-dark": "0px 0px 0px 3px #2C2250",
        navbar: "0px 1px 0px 0px #E6E8EB",
      },
      borderRadius: {
        xxs: "2px",
        xs: "4px",
        sm: "6px",
        DEFAULT: "8px",
        md: "8px",
        lg: "12px",
        xl: "16px",
      },
      lineHeight: {
        DEFAULT: "24px",
      },
      backgroundImage: ({ theme }) => ({
        "button-neutral":
          "linear-gradient(180deg, rgba(3, 7, 18, 0.00) 0%, rgba(3, 7, 18, 0.03) 100%)",
        "button-neutral-dark":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.06) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "no-image": "none",
        "button-inverted":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "button-inverted-dark":
          "linear-gradient(180deg, rgba(0, 0, 0, 0.00) 0%, rgba(0, 0, 0, 0.12) 100%)",
        "button-danger":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "button-danger-dark":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "button-danger-hover":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "button-danger-hover-dark":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.00) 100%)",
        "button-danger-pressed":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.16) 100%)",
        "button-danger-pressed-dark":
          "linear-gradient(180deg, rgba(255, 255, 255, 0.00) 0%, rgba(255, 255, 255, 0.14) 100%)",
        "code-fade": `linear-gradient(90deg, ${theme(
          "colors.medusa.code.bg.base.transparent"
        )}, ${theme("colors.medusa.code.bg.base.DEFAULT")} 24px)`,
        fade: "linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
        "fade-dark":
          "linear-gradient(to top, rgba(27, 27, 31, 1), rgba(27, 27, 31, 0))",
        diagrams: "url('/img/diagrams-bg.png')",
      }),
      screens: {
        xs: "576px",
        lg: "1025px",
        xl: "1419px",
        xxl: "1440px",
      },
      transitionTimingFunction: {
        ease: "ease",
      },
      width: {
        sidebar: "321px",
        "sidebar-hidden": "0px",
        "main-content": "1140px",
        "main-content-hidden-sidebar": "1440px",
        "ref-sidebar": "280px",
        "ref-main": "calc(100% - 280px)",
        "ref-content": "calc(100% - 484px)",
      },
      height: {
        navbar: "57px",
      },
      maxWidth: {
        "main-content": "1140px",
        "main-content-hidden-sidebar": "1440px",
        xl: "1419px",
        xxl: "1440px",
      },
      minWidth: {
        xl: "1419px",
      },
      fontSize: {
        h1: [
          "32px",
          {
            lineHeight: "44px",
            fontWeight: "500",
          },
        ],
        h2: [
          "24px",
          {
            lineHeight: "32px",
            fontWeight: "500",
          },
        ],
        h3: [
          "18px",
          {
            lineHeight: "28px",
            fontWeight: "500",
          },
        ],
        h4: [
          "16px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "compact-large-plus": [
          "16px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "compact-large": [
          "16px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "compact-medium-plus": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "compact-medium": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "compact-small-plus": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "compact-small": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "compact-x-small-plus": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "compact-x-small": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "x-large-plus": [
          "18px",
          {
            lineHeight: "32px",
            fontWeight: "500",
          },
        ],
        "x-large": [
          "18px",
          {
            lineHeight: "32px",
            fontWeight: "400",
          },
        ],
        "large-plus": [
          "16px",
          {
            lineHeight: "28px",
            fontWeight: "500",
          },
        ],
        large: [
          "16px",
          {
            lineHeight: "28px",
            fontWeight: "400",
          },
        ],
        "medium-plus": [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "500",
          },
        ],
        medium: [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
        "code-label": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "code-body": [
          "13px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
      },
      keyframes: ({ theme }) => ({
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        fadeOut: {
          from: { opacity: 1 },
          to: { opacity: 0 },
        },
        tada: {
          from: {
            transform: "scale3d(1, 1, 1)",
          },
          "10%, 20%": {
            transform: "scale3d(0.9, 0.9, 0.9) rotate3d(0, 0, 1, -3deg)",
          },
          "30%, 50%, 70%, 90%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, 3deg)",
          },
          "40%, 60%, 80%": {
            transform: "scale3d(1.1, 1.1, 1.1) rotate3d(0, 0, 1, -3deg)",
          },
          to: {
            transform: "scale3d(1, 1, 1)",
          },
        },
        fadeInDown: {
          from: {
            opacity: "0",
            transform: "translate3d(0, -100%, 0)",
          },
          to: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        fadeInLeft: {
          from: {
            opacity: "0",
            transform: "translate3d(-100%, 0, 0)",
          },
          to: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        fadeInRight: {
          from: {
            opacity: "0",
            transform: "translate3d(100%, 0, 0)",
          },
          to: {
            opacity: "1",
            transform: "translate3d(0, 0, 0)",
          },
        },
        fadeOutUp: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
            transform: "translate3d(0, -100%, 0)",
          },
        },
        fadeOutLeft: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        fadeOutRight: {
          from: {
            opacity: "1",
          },
          to: {
            opacity: "0",
            transform: "translate3d(100%, 0, 0)",
          },
        },
        slideInRight: {
          from: {
            transform: "translate3d(100%, 0, 0)",
            visibility: "visible",
          },
          to: {
            transform: "translate3d(0, 0, 0)",
          },
        },
        slideOutRight: {
          from: {
            transform: "translate3d(0, 0, 0)",
          },
          to: {
            visibility: "hidden",
            transform: "translate3d(100%, 0, 0)",
          },
        },
        slideInLeft: {
          from: {
            transform: "translate3d(-100%, 0, 0)",
            visibility: "visible",
          },
          to: {
            transform: "translate3d(0, 0, 0)",
          },
        },
        slideOutLeft: {
          from: {
            transform: "translate3d(0, 0, 0)",
          },
          to: {
            visibility: "hidden",
            transform: "translate3d(-100%, 0, 0)",
          },
        },
        pulsingDots: {
          "0%": {
            opacity: 1,
          },
          "100%": {
            opacity: 0.3,
          },
        },
        minimize: {
          from: {
            transform: "scale(1)",
          },
          to: {
            transform: "scale(0)",
          },
        },
        maximize: {
          from: {
            transform: "scale(0)",
          },
          to: {
            transform: "scale(1)",
          },
        },
        flash: {
          "0%": {
            backgroundColor: "transparent",
          },
          "50%": {
            backgroundColor: "var(--animation-color)",
          },
          "100%": {
            backgroundColor: "transparent",
          },
        },
      }),
      animation: {
        fadeIn: "fadeIn 500ms",
        fadeOut: "fadeOut 500ms",
        fadeInDown: "fadeInDown 500ms",
        fadeInLeft: "fadeInLeft 500ms",
        fadeInRight: "fadeInRight 500ms",
        fadeOutUp: "fadeOutUp 500ms",
        fadeOutLeft: "fadeOutLeft 500ms",
        fadeOutRight: "fadeOutRight 500ms",
        tada: "tada 1s",
        slideInRight: "slideInRight 500ms",
        slideOutRight: "slideOutRight 500ms",
        slideInLeft: "slideInLeft 500ms",
        slideOutLeft: "slideOutLeft 500ms",
        pulsingDots: "pulsingDots 1s alternate infinite",
        minimize: "minimize 500ms",
        maximize: "maximize 500ms",
        flash: "flash 1500ms 1",
      },
    },
    fontFamily: {
      base: [
        "var(--font-inter)",
        "Inter",
        "BlinkMacSystemFont",
        "-apple-system",
        "Segoe UI",
        "Roboto",
        "Oxygen",
        "Ubuntu",
        "Cantarell",
        "Fira Sans",
        "Droid Sans",
        "Helvetica Neue",
        "Helvetica",
        "Arial",
        "sans-serif",
      ],
      monospace: [
        "var(--font-roboto-mono)",
        "Roboto Mono",
        "SFMono-Regular",
        "Menlo",
        "Monaco",
        "Consolas",
        "Liberation Mono",
        "Courier New",
        "monospace",
      ],
    },
    spacing: {
      px: "1px",
      0: "0px",
      0.125: "2px",
      0.25: "4px",
      0.4: "7px",
      0.5: "8px",
      0.75: "12px",
      1: "16px",
      1.5: "24px",
      2: "32px",
      2.5: "40px",
      3: "48px",
      4: "64px",
      5: "80px",
      6: "96px",
      7: "112px",
      8: "128px",
    },
    backgroundImage: {
      "large-card": "url('/img/squares-bg-light.svg')",
      "large-card-dark": "url('/img/squares-bg.svg')",
      "large-card-fade":
        "linear-gradient(transparent, url('/img/squares-bg-light.svg'))",
      "large-card-fade-dark":
        "linear-gradient(transparent, url('/img/squares-bg.svg'))",
      "large-card-fade-hover": "linear-gradient(transparent, #1C1C1F)",
      "large-card-fade-hover-dark": "linear-gradient(transparent, #232326)",
      "announcement-bg": "url('/img/announcement-bg.svg')",
      "card-highlighted": "url('/img/small-squares-bg-light.svg')",
      "card-highlighted-dark": "url('/img/small-squares-bg.svg')",
      "search-hit": "url('/img/search-hit-light.svg')",
      "search-hit-dark": "url('/img/search-hit.svg')",
      "search-arrow": "url('/img/search-hit-arrow-light.svg')",
      "search-arrow-dark": "url('/img/search-hit-arrow.svg')",
      "search-no-result": "url('/img/search-no-result-light.svg')",
      "search-no-result-dark": "url('/img/search-no-result.svg')",
      "magnifying-glass": "url('/img/magnifying-glass.svg')",
      "magnifying-glass-dark": "url('/img/magnifying-glass-dark.svg')",
      toc: "url('/img/side-menu-light.svg')",
      "toc-dark": "url('/img/side-menu.svg')",
    },
  },
  animationDelay: {
    0: "0ms",
    200: "200ms",
    400: "400ms",
  },
  plugins: [
    plugin(
      ({
        addBase,
        addVariant,
        addUtilities,
        addComponents,
        matchUtilities,
        theme,
      }) => {
        addBase(presets)
        addVariant("search-cancel", "&::-webkit-search-cancel-button")
        addUtilities({
          ".animation-fill-forwards": {
            animationFillMode: "forwards",
          },
          ".animate-fast": {
            animationDuration: "300ms",
          },
          ".animate-fastest": {
            animationDuration: "150ms",
          },
          ".clip": {
            clipPath: "inset(0)",
          },
          ".no-marker": {
            "&::-webkit-details-marker": {
              display: "none",
            },
          },
          ".flip-y": {
            transform: "rotateY(180deg)",
          },
          ".animate-bg-surface": {
            "--animation-color": "var(--docs-bg-subtle-pressed)",
          },
        })
        addComponents({
          ".btn-secondary-icon": {
            padding: "4px !important",
          },
          "btn-clear": {
            backgroundColor: "transparent",
            boxShadow: theme("shadow.none"),
            borderWidth: 0,
            borderColor: "transparent",
            outlineColor: "transparent",
            cursor: "pointer",
          },
          ".grecaptcha-badge": {
            visibility: "hidden",
          },
        })

        matchUtilities(
          {
            "animation-delay": (value) => ({
              animationDelay: value,
            }),
          },
          { values: theme("animationDelay") }
        )
      }
    ),
  ],
}
