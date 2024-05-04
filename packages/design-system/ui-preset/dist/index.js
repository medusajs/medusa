"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// src/plugin.ts
var import_plugin = __toESM(require("tailwindcss/plugin"));

// src/constants.ts
var import_defaultTheme = require("tailwindcss/defaultTheme");
var FONT_FAMILY_SANS = ["Inter", ...import_defaultTheme.fontFamily.sans];
var FONT_FAMILY_MONO = ["Roboto Mono", ...import_defaultTheme.fontFamily.mono];

// src/theme/extension/theme.ts
var theme = {
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
          "fg": {
            "primary": {
              "DEFAULT": "var(--contrast-fg-primary)"
            },
            "secondary": {
              "DEFAULT": "var(--contrast-fg-secondary)"
            }
          },
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
      "buttons-danger": "var(--buttons-danger)",
      "details-contrast-on-bg-interactive": "var(--details-contrast-on-bg-interactive)",
      "borders-interactive-with-focus": "var(--borders-interactive-with-focus)",
      "borders-error": "var(--borders-error)",
      "borders-focus": "var(--borders-focus)",
      "borders-interactive-with-shadow": "var(--borders-interactive-with-shadow)",
      "details-switch-handle": "var(--details-switch-handle)",
      "buttons-neutral": "var(--buttons-neutral)",
      "details-commandbar": "var(--details-commandbar)",
      "details-switch-background-focus": "var(--details-switch-background-focus)",
      "buttons-inverted-focus": "var(--buttons-inverted-focus)",
      "details-switch-background": "var(--details-switch-background)",
      "borders-base": "var(--borders-base)",
      "elevation-tooltip": "var(--elevation-tooltip)",
      "elevation-card-hover": "var(--elevation-card-hover)",
      "elevation-modal": "var(--elevation-modal)",
      "buttons-inverted": "var(--buttons-inverted)",
      "elevation-card-rest": "var(--elevation-card-rest)",
      "buttons-neutral-focus": "var(--buttons-neutral-focus)",
      "elevation-flyout": "var(--elevation-flyout)"
    }
  }
};

// src/theme/tokens/colors.ts
var colors = {
  "dark": {
    "--fg-on-color": "rgba(255, 255, 255, 1)",
    "--border-danger": "rgba(190, 18, 60, 1)",
    "--border-interactive": "rgba(96, 165, 250, 1)",
    "--fg-interactive-hover": "rgba(59, 130, 246, 1)",
    "--fg-error": "rgba(251, 113, 133, 1)",
    "--bg-interactive": "rgba(96, 165, 250, 1)",
    "--border-error": "rgba(244, 63, 94, 1)",
    "--button-danger": "rgba(159, 18, 57, 1)",
    "--button-danger-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-gradient-to": "rgba(255, 255, 255, 0)",
    "--fg-interactive": "rgba(96, 165, 250, 1)",
    "--tag-red-border": "rgba(136, 19, 55, 1)",
    "--tag-red-bg": "rgba(76, 5, 25, 1)",
    "--tag-blue-text": "rgba(96, 165, 250, 1)",
    "--tag-orange-text": "rgba(251, 191, 36, 1)",
    "--tag-green-text": "rgba(52, 211, 153, 1)",
    "--tag-orange-border": "rgba(120, 53, 15, 1)",
    "--tag-green-border": "rgba(6, 78, 59, 1)",
    "--tag-red-text": "rgba(251, 113, 133, 1)",
    "--tag-green-bg-hover": "rgba(6, 78, 59, 1)",
    "--tag-purple-bg-hover": "rgba(76, 29, 149, 1)",
    "--tag-red-bg-hover": "rgba(136, 19, 55, 1)",
    "--border-transparent": "rgba(255, 255, 255, 0)",
    "--tag-orange-icon": "rgba(245, 158, 11, 1)",
    "--tag-purple-bg": "rgba(46, 16, 100, 1)",
    "--tag-blue-bg": "rgba(23, 37, 84, 1)",
    "--tag-green-bg": "rgba(2, 44, 34, 1)",
    "--tag-blue-border": "rgba(30, 58, 138, 1)",
    "--tag-purple-border": "rgba(76, 29, 149, 1)",
    "--tag-blue-bg-hover": "rgba(30, 42, 138, 1)",
    "--tag-orange-bg": "rgba(69, 26, 3, 1)",
    "--tag-orange-bg-hover": "rgba(120, 53, 15, 1)",
    "--tag-blue-icon": "rgba(59, 130, 246, 1)",
    "--tag-red-icon": "rgba(244, 63, 94, 1)",
    "--tag-purple-icon": "rgba(139, 92, 246, 1)",
    "--tag-purple-text": "rgba(167, 139, 250, 1)",
    "--tag-green-icon": "rgba(16, 185, 129, 1)",
    "--button-danger-pressed": "rgba(225, 29, 72, 1)",
    "--button-danger-pressed-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-pressed-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-danger-hover": "rgba(190, 18, 60, 1)",
    "--button-danger-hover-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-hover-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-transparent": "rgba(0, 0, 0, 0.01)",
    "--code-bg-base": "rgba(9, 9, 11, 1)",
    "--button-neutral": "rgba(39, 39, 42, 1)",
    "--button-neutral-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-neutral-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-transparent-hover": "rgba(39, 39, 42, 1)",
    "--code-fg-subtle": "rgba(161, 161, 170, 1)",
    "--tag-neutral-bg-hover": "rgba(63, 63, 70, 1)",
    "--contrast-border-base": "rgba(82, 82, 91, 1)",
    "--button-neutral-pressed": "rgba(82, 82, 91, 1)",
    "--button-neutral-pressed-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-neutral-pressed-gradient-to": "rgba(255, 255, 255, 0)",
    "--tag-neutral-bg": "rgba(39, 39, 42, 1)",
    "--bg-highlight": "rgba(23, 37, 84, 1)",
    "--border-base": "rgba(255, 255, 255, 0.1)",
    "--code-fg-base": "rgba(250, 250, 250, 1)",
    "--tag-neutral-icon": "rgba(113, 113, 122, 1)",
    "--bg-switch-off-hover": "rgba(82, 82, 91, 1)",
    "--bg-base": "rgba(24, 24, 27, 1)",
    "--button-inverted-pressed": "rgba(161, 161, 170, 1)",
    "--button-inverted-pressed-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-pressed-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-neutral-hover": "rgba(63, 63, 70, 1)",
    "--button-neutral-hover-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-neutral-hover-gradient-to": "rgba(255, 255, 255, 0)",
    "--bg-switch-off": "rgba(63, 63, 70, 1)",
    "--border-strong": "rgba(255, 255, 255, 0.15)",
    "--fg-subtle": "rgba(161, 161, 170, 1)",
    "--bg-highlight-hover": "rgba(30, 58, 138, 1)",
    "--button-inverted": "rgba(82, 82, 91, 1)",
    "--button-inverted-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-gradient-to": "rgba(255, 255, 255, 0)",
    "--fg-base": "rgba(250, 250, 250, 1)",
    "--code-border": "rgba(39, 39, 42, 1)",
    "--contrast-bg-subtle": "rgba(39, 39, 42, 1)",
    "--contrast-bg-base-hover": "rgba(82, 82, 91, 1)",
    "--bg-base-hover": "rgba(39, 39, 42, 1)",
    "--bg-subtle-hover": "rgba(24, 24, 27, 1)",
    "--fg-disabled": "rgba(63, 63, 70, 1)",
    "--bg-subtle": "rgba(9, 9, 11, 1)",
    "--tag-neutral-border": "rgba(63, 63, 70, 1)",
    "--bg-subtle-pressed": "rgba(39, 39, 42, 1)",
    "--tag-neutral-text": "rgba(161, 161, 170, 1)",
    "--fg-muted": "rgba(82, 82, 91, 1)",
    "--bg-overlay": "rgba(9, 9, 11, 0.7)",
    "--button-inverted-hover": "rgba(113, 113, 122, 1)",
    "--button-inverted-hover-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-hover-gradient-to": "rgba(255, 255, 255, 0)",
    "--fg-on-inverted": "rgba(9, 9, 11, 1)",
    "--code-bg-subtle": "rgba(24, 24, 27, 1)",
    "--bg-component": "rgba(39, 39, 42, 1)",
    "--border-loud": "rgba(250, 250, 250, 1)",
    "--bg-base-pressed": "rgba(63, 63, 70, 1)",
    "--bg-disabled": "rgba(39, 39, 42, 1)",
    "--contrast-bg-highlight": "rgba(82, 82, 91, 1)",
    "--button-transparent-pressed": "rgba(63, 63, 70, 1)",
    "--code-fg-muted": "rgba(82, 82, 91, 1)",
    "--contrast-fg-secondary": "rgba(161, 161, 170, 1)",
    "--contrast-bg-base-pressed": "rgba(113, 113, 122, 1)",
    "--contrast-fg-primary": "rgba(250, 250, 250, 1)",
    "--contrast-bg-base": "rgba(63, 63, 70, 1)",
    "--bg-component-pressed": "rgba(82, 82, 91, 1)",
    "--bg-component-hover": "rgba(63, 63, 70, 1)",
    "--bg-field": "rgba(39, 39, 42, 1)",
    "--bg-field-component": "rgba(24, 24, 27, 1)",
    "--bg-field-component-hover": "rgba(24, 24, 27, 1)",
    "--bg-field-hover": "rgba(39, 39, 42, 1)"
  },
  "light": {
    "--tag-green-bg": "rgba(209, 250, 229, 1)",
    "--border-interactive": "rgba(59, 130, 246, 1)",
    "--bg-highlight": "rgba(239, 246, 255, 1)",
    "--tag-red-bg": "rgba(255, 228, 230, 1)",
    "--tag-orange-bg": "rgba(254, 244, 199, 1)",
    "--bg-base": "rgba(255, 255, 255, 1)",
    "--tag-green-icon": "rgba(5, 150, 105, 1)",
    "--tag-purple-bg-hover": "rgba(221, 214, 254, 1)",
    "--tag-blue-border": "rgba(191, 219, 254, 1)",
    "--tag-orange-icon": "rgba(217, 119, 6, 1)",
    "--tag-purple-bg": "rgba(237, 233, 254, 1)",
    "--tag-purple-text": "rgba(109, 40, 217, 1)",
    "--tag-blue-bg": "rgba(219, 234, 254, 1)",
    "--tag-blue-icon": "rgba(37, 99, 235, 1)",
    "--border-error": "rgba(225, 29, 72, 1)",
    "--fg-on-inverted": "rgba(255, 255, 255, 1)",
    "--fg-on-color": "rgba(255, 255, 255, 1)",
    "--fg-interactive-hover": "rgba(37, 99, 235, 1)",
    "--fg-interactive": "rgba(59, 130, 246, 1)",
    "--fg-error": "rgba(225, 29, 72, 1)",
    "--border-danger": "rgba(190, 18, 60, 1)",
    "--fg-muted": "rgba(161, 161, 170, 1)",
    "--bg-subtle-pressed": "rgba(228, 228, 231, 1)",
    "--tag-green-bg-hover": "rgba(167, 243, 208, 1)",
    "--tag-blue-bg-hover": "rgba(191, 219, 254, 1)",
    "--tag-red-icon": "rgba(225, 29, 72, 1)",
    "--tag-red-bg-hover": "rgba(254, 205, 211, 1)",
    "--tag-red-text": "rgba(190, 18, 60, 1)",
    "--tag-purple-icon": "rgba(124, 58, 237, 1)",
    "--tag-blue-text": "rgba(29, 78, 216, 1)",
    "--tag-orange-bg-hover": "rgba(253, 230, 138, 1)",
    "--tag-purple-border": "rgba(221, 214, 254, 1)",
    "--tag-orange-text": "rgba(180, 83, 9, 1)",
    "--tag-orange-border": "rgba(253, 230, 138, 1)",
    "--tag-red-border": "rgba(254, 205, 211, 1)",
    "--tag-green-border": "rgba(167, 243, 208, 1)",
    "--tag-green-text": "rgba(4, 120, 87, 1)",
    "--button-danger": "rgba(225, 29, 72, 1)",
    "--button-danger-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-danger-pressed": "rgba(159, 18, 57, 1)",
    "--button-danger-pressed-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-pressed-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-danger-hover": "rgba(190, 18, 60, 1)",
    "--button-danger-hover-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-danger-hover-gradient-to": "rgba(255, 255, 255, 0)",
    "--bg-interactive": "rgba(59, 130, 246, 1)",
    "--bg-highlight-hover": "rgba(219, 234, 254, 1)",
    "--button-transparent": "rgba(255, 255, 255, 0.01)",
    "--bg-overlay": "rgba(9, 9, 11, 0.4)",
    "--tag-neutral-border": "rgba(228, 228, 231, 1)",
    "--border-loud": "rgba(9, 9, 11, 1)",
    "--contrast-fg-primary": "rgba(250, 250, 250, 1)",
    "--bg-switch-off": "rgba(228, 228, 231, 1)",
    "--contrast-bg-base-pressed": "rgba(63, 63, 70, 1)",
    "--bg-base-pressed": "rgba(228, 228, 231, 1)",
    "--tag-neutral-text": "rgba(82, 82, 91, 1)",
    "--button-transparent-hover": "rgba(244, 244, 245, 1)",
    "--contrast-bg-base": "rgba(24, 24, 27, 1)",
    "--fg-disabled": "rgba(212, 212, 216, 1)",
    "--bg-field": "rgba(250, 250, 250, 1)",
    "--border-strong": "rgba(212, 212, 216, 1)",
    "--bg-field-hover": "rgba(244, 244, 245, 1)",
    "--contrast-border-base": "rgba(82, 82, 91, 1)",
    "--fg-base": "rgba(9, 9, 11, 1)",
    "--contrast-bg-subtle": "rgba(39, 39, 42, 1)",
    "--contrast-fg-secondary": "rgba(161, 161, 170, 1)",
    "--code-fg-subtle": "rgba(161, 161, 170, 1)",
    "--tag-neutral-bg": "rgba(244, 244, 245, 1)",
    "--button-transparent-pressed": "rgba(228, 228, 231, 1)",
    "--tag-neutral-bg-hover": "rgba(228, 228, 231, 1)",
    "--code-fg-muted": "rgba(113, 113, 122, 1)",
    "--contrast-bg-highlight": "rgba(63, 63, 70, 1)",
    "--tag-neutral-icon": "rgba(113, 113, 122, 1)",
    "--border-base": "rgba(228, 228, 231, 1)",
    "--code-bg-base": "rgba(24, 24, 27, 1)",
    "--button-neutral": "rgba(255, 255, 255, 1)",
    "--button-neutral-gradient-from": "rgba(9, 9, 11, 0)",
    "--button-neutral-gradient-to": "rgba(9, 9, 11, 1)",
    "--code-bg-subtle": "rgba(39, 39, 42, 1)",
    "--button-neutral-hover": "rgba(244, 244, 245, 1)",
    "--button-neutral-hover-gradient-from": "rgba(9, 9, 11, 0)",
    "--button-neutral-hover-gradient-to": "rgba(9, 9, 11, 1)",
    "--contrast-bg-base-hover": "rgba(39, 39, 42, 1)",
    "--bg-subtle": "rgba(250, 250, 250, 1)",
    "--bg-switch-off-hover": "rgba(212, 212, 216, 1)",
    "--code-fg-base": "rgba(250, 250, 250, 1)",
    "--bg-disabled": "rgba(244, 244, 245, 1)",
    "--code-border": "rgba(63, 63, 70, 1)",
    "--fg-subtle": "rgba(82, 82, 91, 1)",
    "--bg-subtle-hover": "rgba(244, 244, 245, 1)",
    "--button-neutral-pressed": "rgba(228, 228, 231, 1)",
    "--button-neutral-pressed-gradient-from": "rgba(9, 9, 11, 0)",
    "--button-neutral-pressed-gradient-to": "rgba(9, 9, 11, 1)",
    "--border-transparent": "rgba(9, 9, 11, 0)",
    "--button-inverted": "rgba(9, 9, 11, 1)",
    "--button-inverted-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-inverted-pressed": "rgba(39, 39, 42, 1)",
    "--button-inverted-pressed-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-pressed-gradient-to": "rgba(255, 255, 255, 0)",
    "--button-inverted-hover": "rgba(24, 24, 27, 1)",
    "--button-inverted-hover-gradient-from": "rgba(255, 255, 255, 1)",
    "--button-inverted-hover-gradient-to": "rgba(255, 255, 255, 0)",
    "--bg-component-hover": "rgba(244, 244, 245, 1)",
    "--bg-field-component": "rgba(255, 255, 255, 1)",
    "--bg-field-component-hover": "rgba(250, 250, 250, 1)",
    "--bg-component-pressed": "rgba(228, 228, 231, 1)",
    "--bg-component": "rgba(250, 250, 250, 1)",
    "--bg-base-hover": "rgba(244, 244, 245, 1)"
  }
};

// src/theme/tokens/components.ts
var components = {
  "dark": {
    ".button-danger-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-gradient-from), var(--button-danger-gradient-to))",
      "opacity": "10%"
    },
    ".button-danger-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-pressed-gradient-from), var(--button-danger-pressed-gradient-to))",
      "opacity": "10%"
    },
    ".button-danger-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-hover-gradient-from), var(--button-danger-hover-gradient-to))",
      "opacity": "10%"
    },
    ".button-neutral-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-gradient-from), var(--button-neutral-gradient-to))",
      "opacity": "6%"
    },
    ".button-neutral-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-pressed-gradient-from), var(--button-neutral-pressed-gradient-to))",
      "opacity": "6%"
    },
    ".button-inverted-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-pressed-gradient-from), var(--button-inverted-pressed-gradient-to))",
      "opacity": "6%"
    },
    ".button-neutral-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-hover-gradient-from), var(--button-neutral-hover-gradient-to))",
      "opacity": "6%"
    },
    ".button-inverted-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-gradient-from), var(--button-inverted-gradient-to))",
      "opacity": "6%"
    },
    ".button-inverted-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-hover-gradient-from), var(--button-inverted-hover-gradient-to))",
      "opacity": "6%"
    }
  },
  "light": {
    ".button-danger-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-gradient-from), var(--button-danger-gradient-to))",
      "opacity": "16%"
    },
    ".button-danger-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-pressed-gradient-from), var(--button-danger-pressed-gradient-to))",
      "opacity": "16%"
    },
    ".button-danger-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-danger-hover-gradient-from), var(--button-danger-hover-gradient-to))",
      "opacity": "16%"
    },
    ".button-neutral-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-gradient-from), var(--button-neutral-gradient-to))",
      "opacity": "3%"
    },
    ".button-neutral-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-hover-gradient-from), var(--button-neutral-hover-gradient-to))",
      "opacity": "3%"
    },
    ".button-neutral-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-neutral-pressed-gradient-from), var(--button-neutral-pressed-gradient-to))",
      "opacity": "3%"
    },
    ".button-inverted-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-gradient-from), var(--button-inverted-gradient-to))",
      "opacity": "16%"
    },
    ".button-inverted-pressed-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-pressed-gradient-from), var(--button-inverted-pressed-gradient-to))",
      "opacity": "16%"
    },
    ".button-inverted-hover-gradient": {
      "backgroundImage": "linear-gradient(180deg, var(--button-inverted-hover-gradient-from), var(--button-inverted-hover-gradient-to))",
      "opacity": "16%"
    }
  }
};

// src/theme/tokens/effects.ts
var effects = {
  "dark": {
    "--borders-interactive-with-shadow": "0px 1px 2px 0px rgba(219, 234, 254, 0.5), 0px 0px 0px 1px rgba(96, 165, 250, 1)",
    "--details-contrast-on-bg-interactive": "0px 1px 2px 0px rgba(30, 58, 138, 0.6)",
    "--details-switch-handle": "0px 0px 2px 1px rgba(255, 255, 255, 1) inset, 0px 1px 0px 0px rgba(255, 255, 255, 1) inset, 0px 0px 0px 0.5px rgba(0, 0, 0, 0.16), 0px 5px 4px 0px rgba(0, 0, 0, 0.1), 0px 3px 3px 0px rgba(0, 0, 0, 0.1), 0px 1px 2px 0px rgba(0, 0, 0, 0.1), 0px 0px 1px 0px rgba(0, 0, 0, 0.1)",
    "--borders-interactive-with-active": "0px 0px 0px 1px rgba(96, 165, 250, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.25)",
    "--borders-error": "0px 0px 0px 1px rgba(244, 63, 94, 1), 0px 0px 0px 4px rgba(225, 29, 72, 0.25)",
    "--details-switch-background-focus": "0px 0px 0px 1px rgba(24, 24, 27, 1), 0px 0px 0px 3px rgba(96, 165, 250, 0.8), 0px 1px 1px 0px rgba(0, 0, 0, 0.1) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.1) inset, 0px 0px 0px 0.5px rgba(255, 255, 255, 0.12) inset, 0px 0px 8px 0px rgba(0, 0, 0, 0.1) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.2)",
    "--elevation-card-rest": "0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 2px 4px 0px rgba(0, 0, 0, 0.4)",
    "--borders-focus": "0px 0px 0px 1px rgba(24, 24, 27, 1), 0px 0px 0px 3px rgba(96, 165, 250, 0.8)",
    "--buttons-danger": "0px 1px 0px 0px rgba(255, 255, 255, 0.12), 0px -0.75px 0px 0px rgba(255, 255, 255, 0.24), 0px 0px 0px 1px rgba(159, 18, 57, 1), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 1px 1px 0px rgba(0, 0, 0, 0.3)",
    "--borders-interactive-with-focus": "0px 1px 2px 0px rgba(219, 234, 254, 0.5), 0px 0px 0px 1px rgba(96, 165, 250, 1), 0px 0px 0px 2px rgba(24, 24, 27, 1), 0px 0px 0px 4px rgba(96, 165, 250, 0.8)",
    "--details-commandbar": "0px 0px 0px 1px rgba(63, 63, 70, 1) inset, 0px 0px 0px 1.5px rgba(113, 113, 122, 0.4) inset, 0px 16px 32px 0px rgba(0, 0, 0, 0.32), 0px 2px 24px 0px rgba(0, 0, 0, 0.32)",
    "--elevation-tooltip": "0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 4px 8px 0px rgba(0, 0, 0, 0.32)",
    "--elevation-flyout": "0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 8px 16px 0px rgba(0, 0, 0, 0.32)",
    "--details-switch-background": "0px 1px 1px 0px rgba(0, 0, 0, 0.1) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.1) inset, 0px 0px 0px 0.5px rgba(255, 255, 255, 0.12) inset, 0px 0px 8px 0px rgba(0, 0, 0, 0.1) inset, 0px 2px 4px 0px rgba(0, 0, 0, 0.2)",
    "--elevation-modal": "0px 0px 0px 1px rgba(24, 24, 27, 1) inset, 0px 0px 0px 1.5px rgba(63, 63, 70, 0.4) inset, 0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 16px 32px 0px rgba(0, 0, 0, 0.32), 0px 2px 24px 0px rgba(0, 0, 0, 0.32)",
    "--elevation-card-hover": "0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 1px 2px -1px rgba(255, 255, 255, 0.16), 0px 2px 8px 0px rgba(0, 0, 0, 0.4)",
    "--buttons-inverted": "0px -0.75px 0px 0px rgba(255, 255, 255, 0.12), 0px 0px 0px 1px rgba(255, 255, 255, 0.36), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3)",
    "--buttons-neutral": "0px 1px 0px 0px rgba(255, 255, 255, 0.04), 0px -0.75px 0px 0px rgba(255, 255, 255, 0.08), 0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3)",
    "--buttons-danger-focus": "0px 1px 0px 0px rgba(255, 255, 255, 0.12), 0px -0.75px 0px 0px rgba(255, 255, 255, 0.24), 0px 0px 0px 1px rgba(159, 18, 57, 1), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3), 0px 0px 0px 2px rgba(27, 27, 31, 1), 0px 0px 0px 4px rgba(96, 165, 250, 0.8)",
    "--borders-base": "0px 1px 0px 0px rgba(255, 255, 255, 0.04), 0px -0.75px 0px 0px rgba(255, 255, 255, 0.06), 0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3)",
    "--buttons-neutral-focus": "0px 1px 0px 0px rgba(255, 255, 255, 0.04), 0px -0.75px 0px 0px rgba(255, 255, 255, 0.08), 0px 0px 0px 1px rgba(255, 255, 255, 0.12), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3), 0px 0px 0px 2px rgba(24, 24, 27, 1), 0px 0px 0px 4px rgba(96, 165, 250, 0.8)",
    "--buttons-inverted-focus": "0px -0.75px 0px 0px rgba(255, 255, 255, 0.12), 0px 0px 0px 1px rgba(255, 255, 255, 0.36), 0px 1px 1px 0px rgba(0, 0, 0, 0.3), 0px 2px 2px 0px rgba(0, 0, 0, 0.3), 0px 0px 0px 2px rgba(27, 27, 31, 1), 0px 0px 0px 4px rgba(96, 165, 250, 0.8)"
  },
  "light": {
    "--borders-interactive-with-active": "0px 0px 0px 1px rgba(59, 130, 246, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.2)",
    "--buttons-danger-focus": "0px 0.75px 0px 0px rgba(255, 255, 255, 0.2) inset, 0px 1px 2px 0px rgba(190, 18, 60, 0.4), 0px 0px 0px 1px rgba(190, 18, 60, 0.8), 0px 0px 0px 2px rgba(255, 255, 255, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.6)",
    "--buttons-danger": "0px 0.75px 0px 0px rgba(255, 255, 255, 0.2) inset, 0px 1px 2px 0px rgba(190, 18, 60, 0.4), 0px 0px 0px 1px rgba(190, 18, 60, 0.8)",
    "--details-contrast-on-bg-interactive": "0px 1px 2px 0px rgba(30, 58, 138, 0.6)",
    "--borders-interactive-with-focus": "0px 1px 2px 0px rgba(30, 58, 138, 0.5), 0px 0px 0px 1px rgba(59, 130, 246, 1), 0px 0px 0px 2px rgba(255, 255, 255, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.6)",
    "--borders-error": "0px 0px 0px 1px rgba(225, 29, 72, 1), 0px 0px 0px 3px rgba(225, 29, 72, 0.15)",
    "--borders-focus": "0px 0px 0px 1px rgba(255, 255, 255, 1), 0px 0px 0px 3px rgba(59, 130, 246, 0.6)",
    "--borders-interactive-with-shadow": "0px 1px 2px 0px rgba(30, 58, 138, 0.5), 0px 0px 0px 1px rgba(59, 130, 246, 1)",
    "--details-switch-handle": "0px 0px 2px 1px rgba(255, 255, 255, 1) inset, 0px 1px 0px 0px rgba(255, 255, 255, 1) inset, 0px 0px 0px 0.5px rgba(9, 9, 11, 0.02), 0px 5px 4px 0px rgba(9, 9, 11, 0.02), 0px 3px 3px 0px rgba(9, 9, 11, 0.04), 0px 1px 2px 0px rgba(9, 9, 11, 0.12), 0px 0px 1px 0px rgba(9, 9, 11, 0.08)",
    "--buttons-neutral": "0px 1px 2px 0px rgba(9, 9, 11, 0.12), 0px 0px 0px 1px rgba(9, 9, 11, 0.08)",
    "--details-commandbar": "0px 0px 0px 1px rgba(24, 24, 27, 1) inset, 0px 0px 0px 1.5px rgba(255, 255, 255, 0.2) inset, 0px 16px 32px 0px rgba(9, 9, 11, 0.16), 0px 2px 24px 0px rgba(9, 9, 11, 0.08)",
    "--details-switch-background-focus": "0px 0px 0px 1px rgba(255, 255, 255, 1), 0px 0px 0px 3px rgba(59, 130, 246, 0.6), 0px 1px 1px 0px rgba(9, 9, 11, 0.04) inset, 0px 2px 4px 0px rgba(9, 9, 11, 0.04) inset, 0px 0px 0px 0.5px rgba(9, 9, 11, 0.06) inset, 0px 0px 8px 0px rgba(9, 9, 11, 0.02) inset, 0px 2px 4px 0px rgba(9, 9, 11, 0.04)",
    "--buttons-inverted-focus": "0px 0.75px 0px 0px rgba(255, 255, 255, 0.2) inset, 0px 1px 2px 0px rgba(9, 9, 11, 0.4), 0px 0px 0px 1px rgba(9, 9, 11, 0.8), 0px 0px 0px 2px rgba(255, 255, 255, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.6)",
    "--details-switch-background": "0px 1px 1px 0px rgba(9, 9, 11, 0.04) inset, 0px 2px 4px 0px rgba(9, 9, 11, 0.04) inset, 0px 0px 0px 0.5px rgba(9, 9, 11, 0.06) inset, 0px 0px 8px 0px rgba(9, 9, 11, 0.02) inset, 0px 2px 4px 0px rgba(9, 9, 11, 0.04)",
    "--borders-base": "0px 1px 2px 0px rgba(9, 9, 11, 0.12), 0px 0px 0px 1px rgba(9, 9, 11, 0.08)",
    "--elevation-tooltip": "0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 4px 8px 0px rgba(9, 9, 11, 0.08)",
    "--elevation-card-hover": "0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 1px 2px -1px rgba(9, 9, 11, 0.08), 0px 2px 8px 0px rgba(9, 9, 11, 0.1)",
    "--elevation-modal": "0px 0px 0px 1px rgba(255, 255, 255, 1) inset, 0px 0px 0px 1.5px rgba(228, 228, 231, 0.6) inset, 0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 16px 32px 0px rgba(9, 9, 11, 0.08), 0px 2px 24px 0px rgba(9, 9, 11, 0.08)",
    "--buttons-inverted": "0px 0.75px 0px 0px rgba(255, 255, 255, 0.2) inset, 0px 1px 2px 0px rgba(9, 9, 11, 0.4), 0px 0px 0px 1px rgba(9, 9, 11, 0.8)",
    "--elevation-card-rest": "0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 1px 2px -1px rgba(9, 9, 11, 0.08), 0px 2px 4px 0px rgba(9, 9, 11, 0.04)",
    "--buttons-neutral-focus": "0px 1px 2px 0px rgba(9, 9, 11, 0.12), 0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 0px 0px 2px rgba(255, 255, 255, 1), 0px 0px 0px 4px rgba(59, 130, 246, 0.6)",
    "--elevation-flyout": "0px 0px 0px 1px rgba(9, 9, 11, 0.08), 0px 8px 16px 0px rgba(9, 9, 11, 0.08)"
  }
};

// src/theme/tokens/typography.ts
var typography = {
  ".h1-docs": {
    "fontSize": "2rem",
    "lineHeight": "2.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h2-docs": {
    "fontSize": "1.5rem",
    "lineHeight": "2rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h4-webs": {
    "fontSize": "1.125rem",
    "lineHeight": "1.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h1-webs": {
    "fontSize": "4.5rem",
    "lineHeight": "5.5rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h2-core": {
    "fontSize": "1rem",
    "lineHeight": "1.5rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h2-webs": {
    "fontSize": "2rem",
    "lineHeight": "2.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h3-docs": {
    "fontSize": "1.125rem",
    "lineHeight": "1.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h3-webs": {
    "fontSize": "1.5rem",
    "lineHeight": "2rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h3-core": {
    "fontSize": "0.875rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-medium": {
    "fontSize": "0.875rem",
    "lineHeight": "1.5rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-large": {
    "fontSize": "1rem",
    "lineHeight": "1.75rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-medium-plus": {
    "fontSize": "0.875rem",
    "lineHeight": "1.5rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-xsmall": {
    "fontSize": "0.75rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-xsmall-plus": {
    "fontSize": "0.75rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-xlarge-plus": {
    "fontSize": "1.125rem",
    "lineHeight": "2rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-large-plus": {
    "fontSize": "1rem",
    "lineHeight": "1.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-xlarge": {
    "fontSize": "1.125rem",
    "lineHeight": "2rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-large": {
    "fontSize": "1rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-medium-plus": {
    "fontSize": "0.875rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-small-plus": {
    "fontSize": "0.8125rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-medium": {
    "fontSize": "0.875rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-small": {
    "fontSize": "0.8125rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-xlarge-plus": {
    "fontSize": "1.125rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-xsmall-plus": {
    "fontSize": "0.75rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-xlarge": {
    "fontSize": "1.125rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-small-plus": {
    "fontSize": "0.8125rem",
    "lineHeight": "1.375rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-xsmall": {
    "fontSize": "0.75rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-compact-large-plus": {
    "fontSize": "1rem",
    "lineHeight": "1.25rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".txt-small": {
    "fontSize": "0.8125rem",
    "lineHeight": "1.375rem",
    "fontWeight": "400",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".h1-core": {
    "fontSize": "1.125rem",
    "lineHeight": "1.75rem",
    "fontWeight": "500",
    "fontFamily": "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, Noto Sans, sans-serif, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, Noto Color Emoji"
  },
  ".code-label": {
    "fontSize": "0.75rem",
    "lineHeight": "1.25rem",
    "fontWeight": "400",
    "fontFamily": "Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
  },
  ".code-body": {
    "fontSize": "0.75rem",
    "lineHeight": "1.375rem",
    "fontWeight": "400",
    "fontFamily": "Roboto Mono, ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, Liberation Mono, Courier New, monospace"
  }
};

// src/plugin.ts
var plugin_default = (0, import_plugin.default)(
  function medusaUi({ addBase, addComponents, config }) {
    const [darkMode, className = ".dark"] = [].concat(
      config("darkMode", "media")
    );
    addBase({
      "*": {
        borderColor: "var(--border-base)"
      }
    });
    addComponents(typography);
    addBase({
      ":root": { ...colors.light, ...effects.light },
      ...components.light
    });
    if (darkMode === "class") {
      addBase({
        [className]: { ...colors.dark, ...effects.dark }
      });
    } else {
      addBase({
        "@media (prefers-color-scheme: dark)": {
          ":root": { ...colors.dark, ...effects.dark },
          ...components.dark
        }
      });
    }
  },
  {
    theme: {
      extend: {
        ...theme.extend,
        fontFamily: {
          sans: FONT_FAMILY_SANS,
          mono: FONT_FAMILY_MONO
        },
        transitionProperty: {
          fg: "color, background-color, border-color, box-shadow, opacity"
        },
        keyframes: {
          "accordion-down": {
            from: { height: "0px" },
            to: { height: "var(--radix-accordion-content-height)" }
          },
          "accordion-up": {
            from: { height: "var(--radix-accordion-content-height)" },
            to: { height: "0px" }
          }
        },
        animation: {
          "accordion-down": "accordion-down 0.2s ease-out",
          "accordion-up": "accordion-up 0.2s ease-out"
        }
      }
    }
  }
);

// src/preset.ts
var preset = {
  content: [],
  plugins: [plugin_default, require("tailwindcss-animate")]
};

// src/index.ts
module.exports = preset;
