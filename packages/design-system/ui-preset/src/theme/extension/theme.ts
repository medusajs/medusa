export const theme = {
  "extend": {
    "colors": {
      "ui": {
        "button": {
          "inverted": {
            "DEFAULT": "var(--button-inverted)",
            "pressed": {
              "DEFAULT": "var(--button-inverted-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--button-inverted-hover)"
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
            "pressed": {
              "DEFAULT": "var(--button-neutral-pressed)"
            },
            "DEFAULT": "var(--button-neutral)",
            "hover": {
              "DEFAULT": "var(--button-neutral-hover)"
            }
          },
          "danger": {
            "DEFAULT": "var(--button-danger)",
            "pressed": {
              "DEFAULT": "var(--button-danger-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--button-danger-hover)"
            }
          }
        },
        "code": {
          "text": {
            "base": {
              "DEFAULT": "var(--code-text-base)"
            },
            "subtle": {
              "DEFAULT": "var(--code-text-subtle)"
            }
          },
          "bg": {
            "base": {
              "DEFAULT": "var(--code-bg-base)"
            },
            "header": {
              "DEFAULT": "var(--code-bg-header)"
            }
          },
          "border": {
            "DEFAULT": "var(--code-border)"
          },
          "icon": {
            "DEFAULT": "var(--code-icon)"
          }
        },
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
          "neutral": {
            "bg": {
              "DEFAULT": "var(--tag-neutral-bg)",
              "hover": {
                "DEFAULT": "var(--tag-neutral-bg-hover)"
              }
            },
            "border": {
              "DEFAULT": "var(--tag-neutral-border)"
            },
            "text": {
              "DEFAULT": "var(--tag-neutral-text)"
            },
            "icon": {
              "DEFAULT": "var(--tag-neutral-icon)"
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
          }
        },
        "border": {
          "strong": {
            "DEFAULT": "var(--border-strong)"
          },
          "interactive": {
            "DEFAULT": "var(--border-interactive)"
          },
          "base": {
            "DEFAULT": "var(--border-base)"
          },
          "error": {
            "DEFAULT": "var(--border-error)"
          },
          "loud": {
            "DEFAULT": "var(--border-loud)"
          },
          "danger": {
            "DEFAULT": "var(--border-danger)"
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
            "hover": {
              "DEFAULT": "var(--bg-base-hover)"
            },
            "DEFAULT": "var(--bg-base)",
            "pressed": {
              "DEFAULT": "var(--bg-base-pressed)"
            }
          },
          "subtle": {
            "DEFAULT": "var(--bg-subtle)",
            "pressed": {
              "DEFAULT": "var(--bg-subtle-pressed)"
            },
            "hover": {
              "DEFAULT": "var(--bg-subtle-hover)"
            }
          },
          "component": {
            "DEFAULT": "var(--bg-component)"
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
            "hover": {
              "DEFAULT": "var(--bg-field-hover)"
            },
            "DEFAULT": "var(--bg-field)"
          },
          "interactive": {
            "DEFAULT": "var(--bg-interactive)"
          },
          "disabled": {
            "DEFAULT": "var(--bg-disabled)"
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
          "base": {
            "DEFAULT": "var(--fg-base)"
          },
          "disabled": {
            "DEFAULT": "var(--fg-disabled)"
          },
          "subtle": {
            "DEFAULT": "var(--fg-subtle)"
          },
          "muted": {
            "DEFAULT": "var(--fg-muted)"
          }
        },
        "contrast": {
          "bg": {
            "subtle": {
              "DEFAULT": "var(--contrast-bg-subtle)"
            },
            "base": {
              "DEFAULT": "var(--contrast-bg-base)",
              "pressed": {
                "DEFAULT": "var(--contrast-bg-base-pressed)"
              },
              "hover": {
                "DEFAULT": "var(--contrast-bg-base-hover)"
              }
            },
            "highlight": {
              "DEFAULT": "var(--contrast-bg-highlight)"
            }
          },
          "border": {
            "base": {
              "DEFAULT": "var(--contrast-border-base)"
            }
          },
          "fg": {
            "primary": {
              "DEFAULT": "var(--contrast-fg-primary)"
            },
            "secondary": {
              "DEFAULT": "var(--contrast-fg-secondary)"
            }
          }
        }
      }
    },
    "boxShadow": {
      "elevation-card-hover": "var(--elevation-card-hover)",
      "elevation-modal": "var(--elevation-modal)",
      "buttons-inverted": "var(--buttons-inverted)",
      "elevation-card-rest": "var(--elevation-card-rest)",
      "buttons-neutral-focus": "var(--buttons-neutral-focus)",
      "borders-interactive-with-active": "var(--borders-interactive-with-active)",
      "buttons-danger-focus": "var(--buttons-danger-focus)",
      "borders-base": "var(--borders-base)",
      "buttons-danger": "var(--buttons-danger)",
      "details-contrast-on-bg-interactive": "var(--details-contrast-on-bg-interactive)",
      "details-switch-handle": "var(--details-switch-handle)",
      "buttons-neutral": "var(--buttons-neutral)",
      "borders-interactive-with-focus": "var(--borders-interactive-with-focus)",
      "details-switch-background-focus": "var(--details-switch-background-focus)",
      "borders-error": "var(--borders-error)",
      "buttons-inverted-focus": "var(--buttons-inverted-focus)",
      "borders-focus": "var(--borders-focus)",
      "details-switch-background": "var(--details-switch-background)",
      "elevation-tooltip": "var(--elevation-tooltip)",
      "borders-interactive-with-shadow": "var(--borders-interactive-with-shadow)",
      "elevation-flyout": "var(--elevation-flyout)"
    }
  }
}