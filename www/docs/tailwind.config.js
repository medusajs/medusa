/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../docs/content/**/*.{mdx,md}"],
  darkMode: ["class", `[data-theme="dark"]`], // hooks into docusaurus' dark mode settigns
  theme: {
    extend: {
      colors: {
        white: "#FFFFFF",
        gray: {
          50: "#F8F9FA",
          100: "#F1F3F5",
          200: "#ECEEF0",
          300: "#ECEDEE",
          400: "#E6E8EB",
          500: "#DFE3E6",
          600: "#C1C8CD",
          700: "#889096",
          800: "#787F85",
          900: "#687076",
        },
        black: {
          50: "#697177",
          100: "#3A3F42",
          200: "#2B2F31",
          300: "#202425",
          400: "#28282C",
          500: "#26292B",
          600: "#151718",
          700: "#1C1C1F",
          800: "#11181C",
          900: "#1A1D1E",
        },
        green: {
          50: "#DDF3E4",
          100: "#CCEBD7",
          200: "#B4DFC4",
          300: "#4CC38A",
          400: "#30A46C",
          500: "#18794E",
          600: "#164430",
          700: "#133929",
          800: "#113123",
        },
        blue: {
          50: "#E1F0FF",
          100: "#CEE7FE",
          200: "#B7D9F8",
          300: "#52A9FF",
          400: "#0091FF",
          500: "#006ADC",
          600: "#0D3868",
          700: "#0F3058",
          800: "#102A4C",
        },
        purple: {
          50: "#EDE9FE",
          100: "#E4DEFC",
          200: "#D7CFF9",
          300: "#9E8CFC",
          400: "#7C66DC",
          500: "#6E56CF",
          600: "#644FC1",
          700: "#5746AF",
          800: "#5842C3",
          900: "#392C72",
        },
        orange: {
          50: "#FFECBC",
          100: "#FFE3A2",
          200: "#FFD386",
          300: "#FFB224",
          400: "#F1A10D",
          500: "#AD5700",
          600: "#573300",
          700: "#4A2900",
          800: "#3F2200",
        },
        red: {
          50: "#FFE5E5",
          100: "#FDD8D8",
          200: "#F9C6C6",
          300: "#FF6369",
          400: "#F2555A",
          500: "#E5484D",
          600: "#DC3D43",
          700: "#CD2B31",
          800: "#AA2429",
          900: "#671E22",
        },
        pink: {
          50: "#FCE5F3",
          100: "#F9D8EC",
          200: "#F3C6E2",
          300: "#F65CB6",
          400: "#D6409F",
          500: "#CD1D8D",
          600: "#601D48",
          700: "#501B3F",
          800: "#451A37",
        },
        /* docs colors */
        medusa: {
          bg: {
            subtle: {
              DEFAULT: "#F8F9FA",
              dark: "#161618",
              hover: {
                DEFAULT: "#F1F3F5",
                dark: "#1C1C1F",
              },
              pressed: {
                DEFAULT: "#ECEEF0",
                dark: "#232326",
              },
            },
            base: {
              DEFAULT: "#FFFFFF",
              dark: "#1C1C1F",
              hover: {
                DEFAULT: "#F8F9FA",
                dark: "#232326",
              },
              pressed: {
                DEFAULT: "#F1F3F5",
                dark: "#28282C",
              },
            },
            component: {
              DEFAULT: "#F1F3F5",
              dark: "#2E2E32",
            },
            field: {
              DEFAULT: "#F8F9FA",
              dark: "#232326",
              hover: {
                DEFAULT: "#F1F3F5",
                dark: "#28282C",
              },
            },
            highlight: {
              DEFAULT: "#EDE9FE",
              dark: "#2C2250",
            },
            "toggle-off": {
              DEFAULT: "#C1C8CD",
              dark: "#3E3E44",
            },
            overlay: {
              DEFAULT: "rgba(17, 24, 28, 0.4)",
              dark: "rgba(22, 22, 24, 0.7)",
            },
            interactive: {
              DEFAULT: "#6E56CF",
              dark: "#6E56CF",
            },
          },
          border: {
            base: {
              DEFAULT: "#E6E8EB",
              dark: "#2E2E32",
            },
            strong: {
              DEFAULT: "#D7DBDF",
              dark: "#3E3E44",
            },
            focus: {
              DEFAULT: "#6E56CF",
              dark: "#6E56CF",
              inset: {
                DEFAULT: "#FFFFFF",
                dark: "#1C1C1F",
              },
            },
            interactive: {
              DEFAULT: "#6E56CF",
              dark: "#6E56CF",
            },
            "neutral-buttons": {
              DEFAULT: "#11181C1A",
              dark: "#FFFFFF1F",
            },
          },
          text: {
            base: {
              DEFAULT: "#11181C",
              dark: "#EDEDEF",
            },
            subtle: {
              DEFAULT: "#687076",
              dark: "#7E7D86",
            },
            placeholder: {
              DEFAULT: "#889096",
              dark: "#706F78",
            },
            disabled: {
              DEFAULT: "#C1C8CD",
              dark: "#504F57",
            },
            "on-color": {
              DEFAULT: "#FFFFFF",
              dark: "#FFFFFF",
            },
            interactive: {
              DEFAULT: "#6E56CF",
              dark: "#7C66DC",
              hover: {
                DEFAULT: "#644FC1",
                dark: "#9E8CFC",
              },
            },
            error: {
              DEFAULT: "#E5484D",
              dark: "#E5484D",
            },
          },
          button: {
            primary: {
              DEFAULT: "#6E56CF",
              dark: "#6E56CF",
              hover: {
                DEFAULT: "#644FC1",
                dark: "#7C66DC",
              },
              pressed: {
                DEFAULT: "#5746AF",
                dark: "#9E8CFC",
              },
            },
            secondary: {
              DEFAULT: "#FFFFFF",
              dark: "#232326",
              hover: {
                DEFAULT: "#F8F9FA",
                dark: "#2E2E32",
              },
              pressed: {
                DEFAULT: "#F1F3F5",
                dark: "#2E2E32",
              },
            },
            danger: {
              DEFAULT: "#E5484D",
              dark: "#E5484D",
              hover: {
                DEFAULT: "#DC3D43",
                dark: "#DC3D43",
              },
              pressed: {
                DEFAULT: "#CD2B31",
                dark: "#CD2B31",
              },
            },
            success: {
              DEFAULT: "#30A46C",
              dark: "#30A46C",
            },
            neutral: {
              hover: {
                DEFAULT: "#F8F9FA",
                dark: "#2E2E32",
              },
              pressed: {
                DEFAULT: "#F1F3F5",
                dark: "#34343A",
              },
            },
            disabled: {
              DEFAULT: "#ECEEF0",
              dark: "#28282C",
            },
          },
          icon: {
            primary: {
              DEFAULT: "#11181C",
              dark: "#EDEDEF",
            },
            secondary: {
              DEFAULT: "#687076",
              dark: "#7E7D86",
            },
            placeholder: {
              DEFAULT: "#889096",
              dark: "#706F78",
            },
            disabled: {
              DEFAULT: "#C1C8CD",
              dark: "#504F57",
            },
            "on-color": {
              DEFAULT: "#FFFFFF",
              dark: "#FFFFFF",
            },
            interactive: {
              DEFAULT: "#6E56CF",
              dark: "#7C66DC",
              hover: {
                DEFAULT: "#644FC1",
                dark: "#9E8CFC",
              },
            },
            error: {
              DEFAULT: "#E5484D",
              dark: "#E5484D",
            },
            subtle: {
              DEFAULT: "#687076",
              dark: "#7E7D86",
            },
          },
          support: {
            error: {
              DEFAULT: "#E5484D",
              dark: "#E5484D",
            },
            warning: {
              DEFAULT: "#FFB224",
              dark: "#FFB224",
            },
            success: {
              DEFAULT: "#30A46C",
              dark: "#30A46C",
            },
            info: {
              DEFAULT: "#0091FF",
              dark: "#0091FF",
            },
          },
          code: {
            block: {
              bg: "#1C1C1F",
              transparent: "transparent",
              border: "#2E2E32",
              action: "#706F78",
            },
            tabs: {
              bg: "#161616",
            },
            tab: {
              bg: "#1C1C1F",
              hover: "rgba(141, 141, 141, 0.16)",
              border: "#3E3E44",
              text: {
                DEFAULT: "#7E7D86",
                active: "#EDEDEF",
              },
              title: "#7E7D86",
            },
          },
          tag: {
            purple: {
              bg: {
                DEFAULT: "#EDE9FE",
                dark: "#2C2250",
                hover: {
                  DEFAULT: "#E4DEFC",
                  dark: "#32275F",
                },
              },
              text: {
                DEFAULT: "#5746AF",
                dark: "#9E8CFC",
              },
              icon: {
                DEFAULT: "#6E56CF",
                dark: "#6E56CF",
              },
              border: {
                DEFAULT: "#D7CFF9",
                dark: "#392C72",
              },
            },
            orange: {
              bg: {
                DEFAULT: "#FFECBC",
                dark: "#3F2200",
                hover: {
                  DEFAULT: "#FFE3A2",
                  dark: "#4A2900",
                },
              },
              text: {
                DEFAULT: "#AD5700",
                dark: "#F1A10D",
              },
              icon: {
                DEFAULT: "#FFB224",
                dark: "#FFB224",
              },
              border: {
                DEFAULT: "#FFD386",
                dark: "#573300",
              },
            },
            green: {
              bg: {
                DEFAULT: "#DDF3E4",
                dark: "#113123",
                hover: {
                  DEFAULT: "#CCEBD7",
                  dark: "#133929",
                },
              },
              text: {
                DEFAULT: "#18794E",
                dark: "#4CC38A",
              },
              icon: {
                DEFAULT: "#30A46C",
                dark: "#30A46C",
              },
              border: {
                DEFAULT: "#B4DFC4",
                dark: "#164430",
              },
            },
            blue: {
              bg: {
                DEFAULT: "#E1F0FF",
                dark: "#102A4C",
                hover: {
                  DEFAULT: "#CEE7FE",
                  dark: "#0F3058",
                },
              },
              text: {
                DEFAULT: "#006ADC",
                dark: "#52A9FF",
              },
              icon: {
                DEFAULT: "#0091FF",
                dark: "#0091FF",
              },
              border: {
                DEFAULT: "#B7D9F8",
                dark: "#0D3868",
              },
            },
            neutral: {
              bg: {
                DEFAULT: "#F1F3F5",
                dark: "#28282C",
                hover: {
                  DEFAULT: "#ECEEF0",
                  dark: "#2E2E32",
                },
              },
              text: {
                DEFAULT: "#687076",
                dark: "#A09FA6",
              },
              icon: {
                DEFAULT: "#889096",
                dark: "#706F78",
              },
              border: {
                DEFAULT: "#DFE3E6",
                dark: "#3E3E44",
              },
            },
          },
        },
        /* docs defaults */
        docs: {
          bg: {
            DEFAULT: "#FFFFFF",
            dark: "#161618",
            surface: {
              DEFAULT: "#F8F9FA",
              dark: "#1C1C1F",
            },
          },
        },
      },
      boxShadow: {
        overlay: "0px 2px 16px rgba(0, 0, 0, 0.08)",
        "overlay-dark": "0px 2px 16px rgba(0, 0, 0, 0.32)",
        "field-focused": "0px 0px 0px 4px #EDE9FE",
        "field-focused-dark": "0px 0px 0px 4px #2C2250",
        "button-focused": "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #6E56CF",
        "button-focused-dark":
          "0px 0px 0px 2px #1C1C1F, 0px 0px 0px 4px #6E56CF",
        navbar: "0px 1px 0px 0px #E6E8EB",
        "navbar-dark": "0px 1px 0px 0px #2E2E32",
        flyout:
          "0px 0px 0px 1px rgba(17, 24, 28, 0.08), 0px 8px 16px rgba(17, 24, 28, 0.08)",
        "flyout-dark":
          "0px 0px 0px 1px rgba(255, 255, 255, 0.1), 0px 8px 16px rgba(0, 0, 0, 0.32)",
        "neutral-button-focused":
          "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #6E56CF",
        "neutral-button-focused-dark":
          "0px 0px 0px 2px #1C1C1F, 0px 0px 0px 4px #6E56CF",
        "card-rest":
          "0px 0px 0px 1px rgba(17, 24, 28, 0.08), 0px 1px 2px -1px rgba(17, 24, 28, 0.08), 0px 2px 4px rgba(17, 24, 28, 0.04)",
        "card-rest-dark":
          "0px 0px 0px 1px rgba(255, 255, 255, 0.1), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 2px 4px rgba(0, 0, 0, 0.32)",
        "card-hover":
          "0px 0px 0px 1px rgba(17, 24, 28, 0.08), 0px 1px 2px -1px rgba(17, 24, 28, 0.08), 0px 2px 8px rgba(17, 24, 28, 0.1)",
        "card-hover-dark":
          "0px 0px 0px 1px rgba(255, 255, 255, 0.1), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 2px 8px rgba(0, 0, 0, 0.32)",
      },
      borderRadius: {
        DEFAULT: "8px",
        sm: "4px",
      },
      lineHeight: {
        DEFAULT: "24px",
      },
      backgroundImage: {
        "primary-gradient":
          "linear-gradient(90deg, rgba(146, 144, 254, 0) 0%, rgba(163, 219, 254, 0.4) 26.04%, #9290FE 53.65%, rgba(197, 145, 255, 0.4) 78.65%, rgba(201, 138, 255, 0) 100%)",
        "code-fade": "linear-gradient(90deg, #1C1C1F00, #1C1C1F 24px)",
        "button-neutral":
          "linear-gradient(180deg, #FFFFFF 30.1%, #F8F9FA 100%)",
        "button-neutral-dark":
          "linear-gradient(180deg, #2E2E32 0%, #28282C 32.67%)",
        "no-image": "none",
      },
      screens: {
        xs: "576px",
        lg: "992px",
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
      },
      height: {
        navbar: "57px",
      },
      maxWidth: {
        "main-content": "1140px",
        "main-content-hidden-sidebar": "1440px",
        xl: "1419px",
      },
      minWidth: {
        xl: "1419px",
      },
      fontSize: {
        "body-regular-plus": [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "500",
          },
        ],
        "body-regular": [
          "14px",
          {
            lineHeight: "24px",
            fontWeight: "400",
          },
        ],
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
        "label-large-plus": [
          "16px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "label-regular-plus": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "label-regular": [
          "14px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "label-small-plus": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
        "label-small": [
          "13px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "label-x-small": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "400",
          },
        ],
        "label-x-small-plus": [
          "12px",
          {
            lineHeight: "20px",
            fontWeight: "500",
          },
        ],
      },
    },
    fontFamily: {
      base: [
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
      0.4: "7px",
      0.5: "8px",
      1: "16px",
      1.5: "24px",
      2: "32px",
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
      "magnifying-glass": "url('/static/img/magnifying-glass.svg')",
      toc: "url('/img/side-menu-light.svg')",
      "toc-dark": "url('/img/side-menu.svg')",
    },
  },
  plugins: [],
}
