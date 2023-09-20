import plugin from "tailwindcss/plugin"

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
              DEFAULT: "#F9FAFB",
              dark: "#18181A",
              hover: {
                DEFAULT: "#F3F4F6",
                dark: "#1B1B1F",
              },
              pressed: {
                DEFAULT: "#E5E7EB",
                dark: "#27282D",
              },
            },
            base: {
              DEFAULT: "#FFFFFF",
              dark: "#1B1B1F",
              hover: {
                DEFAULT: "#F9FAFB",
                dark: "#27282D",
              },
              pressed: {
                DEFAULT: "#F3F4F6",
                dark: "#2E3035",
              },
            },
            component: {
              DEFAULT: "#F1F3F5",
              dark: "#27282D",
            },
            "switch-off": {
              DEFAULT: "#E5E7EB",
              dark: "#35373C",
              hover: {
                DEFAULT: "#E5E7EB",
                dark: "#464B50",
              },
            },
            interactive: {
              DEFAULT: "#3B82F6",
              dark: "#60A5FA",
            },
            overlay: {
              DEFAULT: "rgba(3, 7, 18, 0.4)",
              dark: "rgba(24, 24, 26, 0.7)",
            },
            disabled: {
              DEFAULT: "#F3F4F6",
              dark: "#27282D",
            },
            highlight: {
              DEFAULT: "#EFF6FF",
              dark: "#172554",
              hover: {
                DEFAULT: "#DBEAFE",
                dark: "#1E3A8A",
              },
            },
            field: {
              DEFAULT: "#F9FAFB",
              dark: "#27282D",
              hover: {
                DEFAULT: "#F3F4F6",
                dark: "#2E3035",
              },
            },
          },
          fg: {
            base: {
              DEFAULT: "#030712",
              dark: "#EDEEF0",
            },
            subtle: {
              DEFAULT: "#4B5563",
              dark: "#ADB1B8",
            },
            muted: {
              DEFAULT: "#9CA3AF",
              dark: "#696E77",
            },
            disabled: {
              DEFAULT: "#D1D5DB",
              dark: "#3C3F44",
            },
            on: {
              color: {
                DEFAULT: "#FFFFFF",
                dark: "#FFFFFF",
              },
              inverted: {
                DEFAULT: "#FFFFFF",
                dark: "#18181A",
              },
            },
            interactive: {
              DEFAULT: "#3B82F6",
              dark: "#60A5FA",
              hover: {
                DEFAULT: "#2563EB",
                dark: "#3B82F6",
              },
            },
            error: {
              DEFAULT: "#E11D48",
              dark: "#FB7185",
            },
          },
          border: {
            base: {
              DEFAULT: "#E5E7EB",
              dark: "#2E3035",
            },
            strong: {
              DEFAULT: "#D1D5DB",
              dark: "#35373C",
            },
            loud: {
              DEFAULT: "#030712",
              dark: "#EDEEF0",
            },
            interactive: {
              DEFAULT: "#3B82F6",
              dark: "#60A5FA",
            },
            error: {
              DEFAULT: "#E11D48",
              dark: "#F43F5E",
            },
            danger: {
              DEFAULT: "#BE123C",
              dark: "#BE123C",
            },
            transparent: {
              DEFAULT: "rgba(3, 7, 18, 0)",
              dark: "rgba(238, 238, 238, 0)",
            },
          },
          button: {
            inverted: {
              DEFAULT: "#030712",
              dark: "#EDEEF0",
              hover: {
                DEFAULT: "#1F2937",
                dark: "#FFFFFF",
              },
              pressed: {
                DEFAULT: "#374151",
                dark: "#EDEEF0",
              },
            },
            neutral: {
              DEFAULT: "#FFFFFF",
              dark: "#27282D",
              hover: {
                DEFAULT: "#F9FAFB",
                dark: "#35373C",
              },
              pressed: {
                DEFAULT: "#F3F4F6",
                dark: "#3C3F44",
              },
            },
            danger: {
              DEFAULT: "#E11D48",
              dark: "#9F1239",
              hover: {
                DEFAULT: "#E11D48",
                dark: "#BE123C",
              },
              pressed: {
                DEFAULT: "#BE123C",
                dark: "#E11D48",
              },
            },
            transparent: {
              DEFAULT: "rgba(255, 255, 255, 0)",
              dark: "rgba(0, 0, 0, 0)",
              hover: {
                DEFAULT: "#F9FAFB",
                dark: "#27282D",
              },
              pressed: {
                DEFAULT: "#F3F4F6",
                dark: "#2E3035",
              },
            },
            disabled: {
              DEFAULT: "#ECEEF0",
              dark: "#28282C",
            },
          },
          tag: {
            neutral: {
              bg: {
                DEFAULT: "#F3F4F6",
                dark: "#2E3035",
                hover: {
                  DEFAULT: "#E5E7EB",
                  dark: "#35373C",
                },
              },
              text: {
                DEFAULT: "#4B5563",
                dark: "#ADB1B8",
              },
              icon: {
                DEFAULT: "#6B7280",
                dark: "#7D828A",
              },
              border: {
                DEFAULT: "#E5E7EB",
                dark: "#3C3F44",
              },
            },
            purple: {
              bg: {
                DEFAULT: "#EDE9FE",
                dark: "#2E1064",
                hover: {
                  DEFAULT: "#DDD6FE",
                  dark: "#4C1D95",
                },
              },
              text: {
                DEFAULT: "#6D28D9",
                dark: "#8B5CF6",
              },
              icon: {
                DEFAULT: "#7C3AED",
                dark: "#6D28D9",
              },
              border: {
                DEFAULT: "#DDD6FE",
                dark: "#4C1D95",
              },
            },
            blue: {
              bg: {
                DEFAULT: "#DBEAFE",
                dark: "#172554",
                hover: {
                  DEFAULT: "#BFDBFE",
                  dark: "#1E2A8A",
                },
              },
              text: {
                DEFAULT: "#1D4ED8",
                dark: "#3B82F6",
              },
              icon: {
                DEFAULT: "#2563EB",
                dark: "#1D4ED8",
              },
              border: {
                DEFAULT: "#BFDBFE",
                dark: "#1E3A8A",
              },
            },
            green: {
              bg: {
                DEFAULT: "#D1FAE5",
                dark: "#022C22",
                hover: {
                  DEFAULT: "#A7F3D0",
                  dark: "#064E3B",
                },
              },
              text: {
                DEFAULT: "#047857",
                dark: "#10B981",
              },
              icon: {
                DEFAULT: "#059669",
                dark: "#047857",
              },
              border: {
                DEFAULT: "#A7F3D0",
                dark: "#064E3B",
              },
            },
            orange: {
              bg: {
                DEFAULT: "#FEF4C7",
                dark: "#451A03",
                hover: {
                  DEFAULT: "#FDE68A",
                  dark: "#78350F",
                },
              },
              text: {
                DEFAULT: "#B45309",
                dark: "#F59E0B",
              },
              icon: {
                DEFAULT: "#D97706",
                dark: "#B45309",
              },
              border: {
                DEFAULT: "#FDE68A",
                dark: "#78350F",
              },
            },
            red: {
              bg: {
                DEFAULT: "#FFE4E6",
                dark: "#4C0519",
                hover: {
                  DEFAULT: "#FECDD3",
                  dark: "#881337",
                },
              },
              text: {
                DEFAULT: "#BE123C",
                dark: "#FB7185",
              },
              icon: {
                DEFAULT: "#E11D48",
                dark: "#F43F5E",
              },
              border: {
                DEFAULT: "#FECDD3",
                dark: "#881337",
              },
            },
          },
          code: {
            text: {
              base: {
                DEFAULT: "#F9FAFB",
                dark: "#EDEEF0",
              },
              subtle: {
                DEFAULT: "#9CA3AF",
                dark: "#696E77",
              },
              highlight: "#102A4C",
            },
            icon: {
              DEFAULT: "#6B7280",
              dark: "#464B50",
            },
            bg: {
              base: {
                DEFAULT: "#111827",
                dark: "#1B1B1F",
                // Need this one for color-fade
                transparent: {
                  DEFAULT: "#11182700",
                  dark: "#1B1B1F00",
                },
              },
              header: {
                DEFAULT: "#1F2937",
                dark: "#18181A",
              },
            },
            border: {
              DEFAULT: "#374151",
              dark: "#2E3035",
            },
          },
        },
        /* docs defaults */
        docs: {
          bg: {
            DEFAULT: "#FFFFFF",
            dark: "#18181A",
            surface: {
              DEFAULT: "#F9FAFB",
              dark: "#1B1B1F",
            },
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
          "colors.medusa.code.bg.base.transparent.DEFAULT"
        )}, ${theme("colors.medusa.code.bg.base.DEFAULT")} 24px)`,
        "code-fade-dark": `linear-gradient(90deg, ${theme(
          "colors.medusa.code.bg.base.transparent.dark"
        )}, ${theme("colors.medusa.code.bg.base.dark")} 24px)`,
        fade: "linear-gradient(to top, rgba(255, 255, 255, 1), rgba(255, 255, 255, 0))",
        "fade-dark":
          "linear-gradient(to top, rgba(27, 27, 31, 1), rgba(27, 27, 31, 0))",
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
      keyframes: {
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
      },
      animation: {
        fadeIn: "fadeIn 500ms",
        fadeOut: "fadeOut 500ms",
        tada: "tada 1s",
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
  plugins: [
    plugin(({ addVariant, addUtilities, addComponents, theme }) => {
      addVariant("search-cancel", "&::-webkit-search-cancel-button")
      addUtilities({
        ".animation-fill-forwards": {
          animationFillMode: "forwards",
        },
        ".animate-fast": {
          animationDuration: "300ms",
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
      })
    }),
  ],
}
