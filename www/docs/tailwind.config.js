/** @type {import('tailwindcss').Config} */
module.exports = {
  prefix: "tw-",
  corePlugins: {
    preflight: false, // disable Tailwind's reset
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}", "../../docs/content/*.{mdx,md}"],
  darkMode: ["class", `[data-theme="dark"]`], // hooks into docusaurus' dark mode settigns
  theme: {
    extend: {
      colors: {
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
          },
        },
        boxShadow: {
          overlay: {
            DEFAULT: "0px 2px 16px rgba(0, 0, 0, 0.08)",
            dark: "0px 2px 16px rgba(0, 0, 0, 0.32)",
          },
          "field-focused": {
            DEFAULT: "0px 0px 0px 4px #EDE9FE",
            dark: "0px 0px 0px 4px #2C2250",
          },
          "button-focused": {
            DEFAULT: "0px 0px 0px 2px #FFFFFF, 0px 0px 0px 4px #6E56CF",
            dark: "0px 0px 0px 2px #1C1C1F, 0px 0px 0px 4px #6E56CF",
          },
        },
      },
    },
  },
  plugins: [],
}
