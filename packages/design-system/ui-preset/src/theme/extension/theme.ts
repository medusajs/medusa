export const theme = {
  "extend": {
    "colors": {
      "ui": {
        "tag": {
          "green": {
            "bg": {
              "DEFAULT": "var(--tag-green-bg)",
              "hover": {
                "DEFAULT": "var(--tag-green-bg-hover)"
              }
            },
            "icon": {
              "DEFAULT": "var(--tag-green-icon)"
            },
            "border": {
              "DEFAULT": "var(--tag-green-border)"
            },
            "text": {
              "DEFAULT": "var(--tag-green-text)"
            }
          },
          "red": {
            "bg": {
              "DEFAULT": "var(--tag-red-bg)",
              "hover": {
                "DEFAULT": "var(--tag-red-bg-hover)"
              }
            },
            "icon": {
              "DEFAULT": "var(--tag-red-icon)"
            },
            "text": {
              "DEFAULT": "var(--tag-red-text)"
            },
            "border": {
              "DEFAULT": "var(--tag-red-border)"
            }
          },
          "orange": {
            "bg": {
              "DEFAULT": "var(--tag-orange-bg)",
              "hover": {
                "DEFAULT": "var(--tag-orange-bg-hover)"
              }
            },
            "icon": {
              "DEFAULT": "var(--tag-orange-icon)"
            },
            "text": {
              "DEFAULT": "var(--tag-orange-text)"
            },
            "border": {
              "DEFAULT": "var(--tag-orange-border)"
            }
          },
          "purple": {
            "bg": {
              "hover": {
                "DEFAULT": "var(--tag-purple-bg-hover)"
              },
              "DEFAULT": "var(--tag-purple-bg)"
            },
            "text": {
              "DEFAULT": "var(--tag-purple-text)"
            },
            "icon": {
              "DEFAULT": "var(--tag-purple-icon)"
            },
            "border": {
              "DEFAULT": "var(--tag-purple-border)"
            }
          },
          "blue": {
            "border": {
              "DEFAULT": "var(--tag-blue-border)"
            },
            "bg": {
              "DEFAULT": "var(--tag-blue-bg)",
              "hover": {
                "DEFAULT": "var(--tag-blue-bg-hover)"
              }
            },
            "icon": {
              "DEFAULT": "var(--tag-blue-icon)"
            },
            "text": {
              "DEFAULT": "var(--tag-blue-text)"
            }
          },
          "neutral": {
            "border": {
              "DEFAULT": "var(--tag-neutral-border)"
            },
            "text": {
              "DEFAULT": "var(--tag-neutral-text)"
            },
            "bg": {
              "DEFAULT": "var(--tag-neutral-bg)",
              "hover": {
                "DEFAULT": "var(--tag-neutral-bg-hover)"
              }
            },
            "icon": {
              "DEFAULT": "var(--tag-neutral-icon)"
            }
          }
        },
        "border": {
          "interactive": {
            "DEFAULT": "var(--border-interactive)"
          },
          "error": {
            "DEFAULT": "var(--border-error)"
          },
          "danger": {
            "DEFAULT": "var(--border-danger)"
          },
          "loud": {
            "DEFAULT": "var(--border-loud)"
          },
          "strong": {
            "DEFAULT": "var(--border-strong)"
          },
          "base": {
            "DEFAULT": "var(--border-base)"
          },
          "transparent": {
            "DEFAULT": "var(--border-transparent)"
          }
        },
        "bg": {
          "highlight": {
            "DEFAULT": "var(--bg-highlight)",
            "hover": {
              "DEFAULT": "var(--bg-highlight-hover)"
            }
          },
          "base": {
            "DEFAULT": "var(--bg-base)",
            "pressed": {
              "DEFAULT": "var(--bg-base-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--bg-base-hover)"
            }
          },
          "subtle": {
            "pressed": {
              "DEFAULT": "var(--bg-subtle-pressed)"
            },
            "DEFAULT": "var(--bg-subtle)",
            "hover": {
              "DEFAULT": "var(--bg-subtle-hover)"
            }
          },
          "interactive": {
            "DEFAULT": "var(--bg-interactive)"
          },
          "overlay": {
            "DEFAULT": "var(--bg-overlay)"
          },
          "switch": {
            "off": {
              "DEFAULT": "var(--bg-switch-off)",
              "hover": {
                "DEFAULT": "var(--bg-switch-off-hover)"
              }
            }
          },
          "field": {
            "DEFAULT": "var(--bg-field)",
            "hover": {
              "DEFAULT": "var(--bg-field-hover)"
            },
            "component": {
              "DEFAULT": "var(--bg-field-component)",
              "hover": {
                "DEFAULT": "var(--bg-field-component-hover)"
              }
            }
          },
          "disabled": {
            "DEFAULT": "var(--bg-disabled)"
          },
          "component": {
            "hover": {
              "DEFAULT": "var(--bg-component-hover)"
            },
            "pressed": {
              "DEFAULT": "var(--bg-component-pressed)"
            },
            "DEFAULT": "var(--bg-component)"
          }
        },
        "fg": {
          "on": {
            "inverted": {
              "DEFAULT": "var(--fg-on-inverted)"
            },
            "color": {
              "DEFAULT": "var(--fg-on-color)"
            }
          },
          "interactive": {
            "hover": {
              "DEFAULT": "var(--fg-interactive-hover)"
            },
            "DEFAULT": "var(--fg-interactive)"
          },
          "error": {
            "DEFAULT": "var(--fg-error)"
          },
          "muted": {
            "DEFAULT": "var(--fg-muted)"
          },
          "disabled": {
            "DEFAULT": "var(--fg-disabled)"
          },
          "base": {
            "DEFAULT": "var(--fg-base)"
          },
          "subtle": {
            "DEFAULT": "var(--fg-subtle)"
          }
        },
        "button": {
          "danger": {
            "DEFAULT": "var(--button-danger)",
            "pressed": {
              "DEFAULT": "var(--button-danger-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--button-danger-hover)"
            }
          },
          "transparent": {
            "DEFAULT": "var(--button-transparent)",
            "hover": {
              "DEFAULT": "var(--button-transparent-hover)"
            },
            "pressed": {
              "DEFAULT": "var(--button-transparent-pressed)"
            }
          },
          "neutral": {
            "DEFAULT": "var(--button-neutral)",
            "hover": {
              "DEFAULT": "var(--button-neutral-hover)"
            },
            "pressed": {
              "DEFAULT": "var(--button-neutral-pressed)"
            }
          },
          "inverted": {
            "DEFAULT": "var(--button-inverted)",
            "pressed": {
              "DEFAULT": "var(--button-inverted-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--button-inverted-hover)"
            }
          }
        },
        "contrast": {
          "bg": {
            "base": {
              "pressed": {
                "DEFAULT": "var(--contrast-bg-base-pressed)"
              },
              "DEFAULT": "var(--contrast-bg-base)",
              "hover": {
                "DEFAULT": "var(--contrast-bg-base-hover)"
              }
            },
            "subtle": {
              "DEFAULT": "var(--contrast-bg-subtle)"
            },
            "highlight": {
              "DEFAULT": "var(--contrast-bg-highlight)"
            },
            "alpha": {
              "DEFAULT": "var(--contrast-bg-alpha)"
            }
          },
          "fg": {
            "primary": {
              "DEFAULT": "var(--contrast-fg-primary)"
            },
            "secondary": {
              "DEFAULT": "var(--contrast-fg-secondary)"
            }
          },
          "border": {
            "base": {
              "DEFAULT": "var(--contrast-border-base)"
            }
          }
        },
        "code": {
          "fg": {
            "subtle": {
              "DEFAULT": "var(--code-fg-subtle)"
            },
            "muted": {
              "DEFAULT": "var(--code-fg-muted)"
            },
            "base": {
              "DEFAULT": "var(--code-fg-base)"
            }
          },
          "bg": {
            "base": {
              "DEFAULT": "var(--code-bg-base)"
            },
            "subtle": {
              "DEFAULT": "var(--code-bg-subtle)"
            }
          },
          "border": {
            "DEFAULT": "var(--code-border)"
          }
        }
      }
    },
    "boxShadow": {
      "borders-interactive-with-active": "var(--borders-interactive-with-active)",
      "buttons-danger-focus": "var(--buttons-danger-focus)",
      "details-contrast-on-bg-interactive": "var(--details-contrast-on-bg-interactive)",
      "borders-interactive-with-focus": "var(--borders-interactive-with-focus)",
      "borders-error": "var(--borders-error)",
      "borders-focus": "var(--borders-focus)",
      "borders-interactive-with-shadow": "var(--borders-interactive-with-shadow)",
      "buttons-danger": "var(--buttons-danger)",
      "buttons-inverted-focus": "var(--buttons-inverted-focus)",
      "elevation-card-hover": "var(--elevation-card-hover)",
      "buttons-inverted": "var(--buttons-inverted)",
      "details-switch-handle": "var(--details-switch-handle)",
      "buttons-neutral": "var(--buttons-neutral)",
      "borders-base": "var(--borders-base)",
      "elevation-card-rest": "var(--elevation-card-rest)",
      "buttons-neutral-focus": "var(--buttons-neutral-focus)",
      "details-code-block": "var(--details-code-block)",
      "details-switch-background-focus": "var(--details-switch-background-focus)",
      "details-switch-background": "var(--details-switch-background)",
      "elevation-flyout": "var(--elevation-flyout)",
      "elevation-tooltip": "var(--elevation-tooltip)",
      "elevation-modal": "var(--elevation-modal)",
      "details-commandbar": "var(--details-commandbar)"
    }
  }
}