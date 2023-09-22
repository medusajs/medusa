import * as React from "react"

type ExampleType = {
  name: string
  component: React.LazyExoticComponent<() => React.JSX.Element>
  file: string
}

export const ExampleRegistry: Record<string, ExampleType> = {
  "avatar-demo": {
    name: "avatar-demo",
    component: React.lazy(async () => import("@/examples/avatar-demo")),
    file: "src/examples/avatar-demo.tsx",
  },
  "badge-demo": {
    name: "badge-demo",
    component: React.lazy(async () => import("@/examples/badge-demo")),
    file: "src/examples/badge-demo.tsx",
  },
  "badge-blue": {
    name: "badge-blue",
    component: React.lazy(async () => import("@/examples/badge-blue")),
    file: "src/examples/badge-blue.tsx",
  },
  "badge-green": {
    name: "badge-green",
    component: React.lazy(async () => import("@/examples/badge-green")),
    file: "src/examples/badge-green.tsx",
  },
  "badge-red": {
    name: "badge-red",
    component: React.lazy(async () => import("@/examples/badge-red")),
    file: "src/examples/badge-red.tsx",
  },
  "badge-orange": {
    name: "badge-orange",
    component: React.lazy(async () => import("@/examples/badge-orange")),
    file: "src/examples/badge-orange.tsx",
  },
  "badge-purple": {
    name: "badge-purple",
    component: React.lazy(async () => import("@/examples/badge-purple")),
    file: "src/examples/badge-purple.tsx",
  },
  "badge-grey": {
    name: "badge-grey",
    component: React.lazy(async () => import("@/examples/badge-grey")),
    file: "src/examples/badge-grey.tsx",
  },
  "badge-small": {
    name: "badge-small",
    component: React.lazy(async () => import("@/examples/badge-small")),
    file: "src/examples/badge-small.tsx",
  },
  "badge-large": {
    name: "badge-large",
    component: React.lazy(async () => import("@/examples/badge-large")),
    file: "src/examples/badge-large.tsx",
  },
  "badge-rounded": {
    name: "badge-rounded",
    component: React.lazy(async () => import("@/examples/badge-rounded")),
    file: "src/examples/badge-rounded.tsx",
  },
  "badge-icon": {
    name: "badge-icon",
    component: React.lazy(async () => import("@/examples/badge-icon")),
    file: "src/examples/badge-icon.tsx",
  },
  "button-demo": {
    name: "button-demo",
    component: React.lazy(async () => import("@/examples/button-demo")),
    file: "src/examples/button-demo.tsx",
  },
  "calendar-demo": {
    name: "calendar-demo",
    component: React.lazy(async () => import("@/examples/calendar-demo")),
    file: "src/examples/calendar-demo.tsx",
  },
  "checkbox-demo": {
    name: "checkbox-demo",
    component: React.lazy(async () => import("@/examples/checkbox-demo")),
    file: "src/examples/checkbox-demo.tsx",
  },
  "code-block-demo": {
    name: "code-block-demo",
    component: React.lazy(async () => import("@/examples/code-block-demo")),
    file: "src/examples/code-block-demo.tsx",
  },
  "command-demo": {
    name: "command-demo",
    component: React.lazy(async () => import("@/examples/command-demo")),
    file: "src/examples/command-demo.tsx",
  },
  "container-demo": {
    name: "container-demo",
    component: React.lazy(async () => import("@/examples/container-demo")),
    file: "src/examples/container-demo.tsx",
  },
  "copy-demo": {
    name: "copy-demo",
    component: React.lazy(async () => import("@/examples/copy-demo")),
    file: "src/examples/copy-demo.tsx",
  },
  "copy-custom-display": {
    name: "copy-custom-display",
    component: React.lazy(async () => import("@/examples/copy-custom-display")),
    file: "src/examples/copy-custom-display.tsx",
  },
  "copy-as-child": {
    name: "copy-as-child",
    component: React.lazy(async () => import("@/examples/copy-as-child")),
    file: "src/examples/copy-as-child.tsx",
  },
  "date-picker-demo": {
    name: "date-picker-demo",
    component: React.lazy(async () => import("@/examples/date-picker-demo")),
    file: "src/examples/date-picker-demo.tsx",
  },
  "date-picker-single": {
    name: "date-picker-single",
    component: React.lazy(async () => import("@/examples/date-picker-single")),
    file: "src/examples/date-picker-single.tsx",
  },
  "date-picker-single-time": {
    name: "date-picker-single-time",
    component: React.lazy(
      async () => import("@/examples/date-picker-single-time")
    ),
    file: "src/examples/date-picker-single-time.tsx",
  },
  "date-picker-single-presets": {
    name: "date-picker-single-presets",
    component: React.lazy(
      async () => import("@/examples/date-picker-single-presets")
    ),
    file: "src/examples/date-picker-single-presets.tsx",
  },
  "date-picker-single-presets-time": {
    name: "date-picker-single-presets-time",
    component: React.lazy(
      async () => import("@/examples/date-picker-single-presets-time")
    ),
    file: "src/examples/date-picker-single-presets-time.tsx",
  },
  "date-picker-range": {
    name: "date-picker-range",
    component: React.lazy(async () => import("@/examples/date-picker-range")),
    file: "src/examples/date-picker-range.tsx",
  },
  "date-picker-range-time": {
    name: "date-picker-range-time",
    component: React.lazy(
      async () => import("@/examples/date-picker-range-time")
    ),
    file: "src/examples/date-picker-range-time.tsx",
  },
  "date-picker-range-presets": {
    name: "date-picker-range-presets",
    component: React.lazy(
      async () => import("@/examples/date-picker-range-presets")
    ),
    file: "src/examples/date-picker-range-presets.tsx",
  },
  "date-picker-range-presets-time": {
    name: "date-picker-range-presets-time",
    component: React.lazy(
      async () => import("@/examples/date-picker-range-presets-time")
    ),
    file: "src/examples/date-picker-range-presets-time.tsx",
  },
  "drawer-demo": {
    name: "drawer-demo",
    component: React.lazy(async () => import("@/examples/drawer-demo")),
    file: "src/examples/drawer-demo.tsx",
  },
  "dropdown-menu-demo": {
    name: "dropdown-menu-demo",
    component: React.lazy(async () => import("@/examples/dropdown-menu-demo")),
    file: "src/examples/dropdown-menu-demo.tsx",
  },
  "focus-modal-demo": {
    name: "focus-modal-demo",
    component: React.lazy(async () => import("@/examples/focus-modal-demo")),
    file: "src/examples/focus-modal-demo.tsx",
  },
  "heading-demo": {
    name: "heading-demo",
    component: React.lazy(async () => import("@/examples/heading-demo")),
    file: "src/examples/heading-demo.tsx",
  },
  "input-demo": {
    name: "input-demo",
    component: React.lazy(async () => import("@/examples/input-demo")),
    file: "src/examples/input-demo.tsx",
  },
  "input-password": {
    name: "input-password",
    component: React.lazy(async () => import("@/examples/input-password")),
    file: "src/examples/input-password.tsx",
  },
  "input-search": {
    name: "input-search",
    component: React.lazy(async () => import("@/examples/input-search")),
    file: "src/examples/input-search.tsx",
  },
  "input-disabled": {
    name: "input-disabled",
    component: React.lazy(async () => import("@/examples/input-disabled")),
    file: "src/examples/input-disabled.tsx",
  },
  "input-small": {
    name: "input-small",
    component: React.lazy(async () => import("@/examples/input-small")),
    file: "src/examples/input-small.tsx",
  },
  "input-error": {
    name: "input-error",
    component: React.lazy(async () => import("@/examples/input-error")),
    file: "src/examples/input-error.tsx",
  },
  "kbd-demo": {
    name: "kbd-demo",
    component: React.lazy(async () => import("@/examples/kbd-demo")),
    file: "src/examples/kbd-demo.tsx",
  },
  "label-demo": {
    name: "label-demo",
    component: React.lazy(async () => import("@/examples/label-demo")),
    file: "src/examples/label-demo.tsx",
  },
  "prompt-demo": {
    name: "prompt-demo",
    component: React.lazy(async () => import("@/examples/prompt-demo")),
    file: "src/examples/prompt-demo.tsx",
  },
  "radio-group-demo": {
    name: "radio-group-demo",
    component: React.lazy(async () => import("@/examples/radio-group-demo")),
    file: "src/examples/radio-group-demo.tsx",
  },
  "radio-group-descriptions": {
    name: "radio-group-descriptions",
    component: React.lazy(
      async () => import("@/examples/radio-group-descriptions")
    ),
    file: "src/examples/radio-group-descriptions.tsx",
  },
  "radio-group-disabled": {
    name: "radio-group-disabled",
    component: React.lazy(
      async () => import("@/examples/radio-group-disabled")
    ),
    file: "src/examples/radio-group-disabled.tsx",
  },
  "select-demo": {
    name: "select-demo",
    component: React.lazy(async () => import("@/examples/select-demo")),
    file: "src/examples/select-demo.tsx",
  },
  "switch-demo": {
    name: "switch-demo",
    component: React.lazy(async () => import("@/examples/switch-demo")),
    file: "src/examples/switch-demo.tsx",
  },
  "switch-small": {
    name: "switch-small",
    component: React.lazy(async () => import("@/examples/switch-small")),
    file: "src/examples/switch-small.tsx",
  },
  "switch-disabled": {
    name: "switch-disabled",
    component: React.lazy(async () => import("@/examples/switch-disabled")),
    file: "src/examples/switch-disabled.tsx",
  },
  "switch-checked": {
    name: "switch-checked",
    component: React.lazy(async () => import("@/examples/switch-checked")),
    file: "src/examples/switch-checked.tsx",
  },
  "switch-checked-disabled": {
    name: "switch-checked-disabled",
    component: React.lazy(
      async () => import("@/examples/switch-checked-disabled")
    ),
    file: "src/examples/switch-checked-disabled.tsx",
  },
  "table-demo": {
    name: "table-demo",
    component: React.lazy(async () => import("@/examples/table-demo")),
    file: "src/examples/table-demo.tsx",
  },
  "text-demo": {
    name: "text-demo",
    component: React.lazy(async () => import("@/examples/text-demo")),
    file: "src/examples/text-demo.tsx",
  },
  "text-examples": {
    name: "text-examples",
    component: React.lazy(async () => import("@/examples/text-examples")),
    file: "src/examples/text-examples.tsx",
  },
  "textarea-demo": {
    name: "textarea-demo",
    component: React.lazy(async () => import("@/examples/textarea-demo")),
    file: "src/examples/textarea-demo.tsx",
  },
  "toaster-demo": {
    name: "toaster-demo",
    component: React.lazy(async () => import("@/examples/toaster-demo")),
    file: "src/examples/toaster-demo.tsx",
  },
  "toaster-warning": {
    name: "toaster-warning",
    component: React.lazy(async () => import("@/examples/toaster-warning")),
    file: "src/examples/toaster-warning.tsx",
  },
  "toaster-error": {
    name: "toaster-error",
    component: React.lazy(async () => import("@/examples/toaster-error")),
    file: "src/examples/toaster-error.tsx",
  },
  "toaster-success": {
    name: "toaster-success",
    component: React.lazy(async () => import("@/examples/toaster-success")),
    file: "src/examples/toaster-success.tsx",
  },
  "toaster-loading": {
    name: "toaster-loading",
    component: React.lazy(async () => import("@/examples/toaster-loading")),
    file: "src/examples/toaster-loading.tsx",
  },
  "toaster-with-action": {
    name: "toaster-with-action",
    component: React.lazy(async () => import("@/examples/toaster-with-action")),
    file: "src/examples/toaster-with-action.tsx",
  },
  "tooltip-demo": {
    name: "tooltip-demo",
    component: React.lazy(async () => import("@/examples/tooltip-demo")),
    file: "src/examples/tooltip-demo.tsx",
  },
  "button-primary": {
    name: "button-primary",
    component: React.lazy(async () => import("@/examples/button-primary")),
    file: "src/examples/button-primary.tsx",
  },
  "button-secondary": {
    name: "button-secondary",
    component: React.lazy(async () => import("@/examples/button-secondary")),
    file: "src/examples/button-secondary.tsx",
  },
  "button-transparent": {
    name: "button-transparent",
    component: React.lazy(async () => import("@/examples/button-transparent")),
    file: "src/examples/button-transparent.tsx",
  },
  "button-danger": {
    name: "button-danger",
    component: React.lazy(async () => import("@/examples/button-danger")),
    file: "src/examples/button-danger.tsx",
  },
  "button-disabled": {
    name: "button-disabled",
    component: React.lazy(async () => import("@/examples/button-disabled")),
    file: "src/examples/button-disabled.tsx",
  },
  "button-with-icon": {
    name: "button-with-icon",
    component: React.lazy(async () => import("@/examples/button-with-icon")),
    file: "src/examples/button-with-icon.tsx",
  },
  "button-icon-only": {
    name: "button-icon-only",
    component: React.lazy(async () => import("@/examples/button-icon-only")),
    file: "src/examples/button-icon-only.tsx",
  },
  "button-loading": {
    name: "button-loading",
    component: React.lazy(async () => import("@/examples/button-loading")),
    file: "src/examples/button-loading.tsx",
  },
  "select-small": {
    name: "select-small",
    component: React.lazy(async () => import("@/examples/select-small")),
    file: "src/examples/select-small.tsx",
  },
  "select-disabled": {
    name: "select-disabled",
    component: React.lazy(async () => import("@/examples/select-disabled")),
    file: "src/examples/select-disabled.tsx",
  },
  "select-grouped-items": {
    name: "select-grouped-items",
    component: React.lazy(
      async () => import("@/examples/select-grouped-items")
    ),
    file: "src/examples/select-grouped-items.tsx",
  },
  "select-controlled": {
    name: "select-controlled",
    component: React.lazy(async () => import("@/examples/select-controlled")),
    file: "src/examples/select-controlled.tsx",
  },
  "label-base-regular": {
    name: "label-base-regular",
    component: React.lazy(async () => import("@/examples/label-base-regular")),
    file: "src/examples/label-base-regular.tsx",
  },
  "label-base-plus": {
    name: "label-base-plus",
    component: React.lazy(async () => import("@/examples/label-base-plus")),
    file: "src/examples/label-base-plus.tsx",
  },
  "label-large-regular": {
    name: "label-large-regular",
    component: React.lazy(async () => import("@/examples/label-large-regular")),
    file: "src/examples/label-large-regular.tsx",
  },
  "label-large-plus": {
    name: "label-large-plus",
    component: React.lazy(async () => import("@/examples/label-large-plus")),
    file: "src/examples/label-large-plus.tsx",
  },
  "label-small-regular": {
    name: "label-small-regular",
    component: React.lazy(async () => import("@/examples/label-small-regular")),
    file: "src/examples/label-small-regular.tsx",
  },
  "label-small-plus": {
    name: "label-small-plus",
    component: React.lazy(async () => import("@/examples/label-small-plus")),
    file: "src/examples/label-small-plus.tsx",
  },
  "label-xsmall-regular": {
    name: "label-xsmall-regular",
    component: React.lazy(
      async () => import("@/examples/label-xsmall-regular")
    ),
    file: "src/examples/label-xsmall-regular.tsx",
  },
  "label-xsmall-plus": {
    name: "label-xsmall-regular",
    component: React.lazy(async () => import("@/examples/label-xsmall-plus")),
    file: "src/examples/label-xsmall-plus.tsx",
  },
  "calendar-single": {
    name: "calendar-single",
    component: React.lazy(async () => import("@/examples/calendar-single")),
    file: "src/examples/calendar-single.tsx",
  },
  "calendar-range": {
    name: "calendar-range",
    component: React.lazy(async () => import("@/examples/calendar-range")),
    file: "src/examples/calendar-range.tsx",
  },
  "checkbox-default": {
    name: "checkbox-default",
    component: React.lazy(async () => import("@/examples/checkbox-default")),
    file: "src/examples/checkbox-default.tsx",
  },
  "checkbox-checked": {
    name: "checkbox-checked",
    component: React.lazy(async () => import("@/examples/checkbox-checked")),
    file: "src/examples/checkbox-checked.tsx",
  },
  "checkbox-disabled": {
    name: "checkbox-disabled",
    component: React.lazy(async () => import("@/examples/checkbox-disabled")),
    file: "src/examples/checkbox-disabled.tsx",
  },
  "checkbox-indeterminate": {
    name: "checkbox-indeterminate",
    component: React.lazy(
      async () => import("@/examples/checkbox-indeterminate")
    ),
    file: "src/examples/checkbox-indeterminate.tsx",
  },
  "code-block-single": {
    name: "code-block-single",
    component: React.lazy(async () => import("@/examples/code-block-single")),
    file: "src/examples/code-block-single.tsx",
  },
  "code-block-no-lines": {
    name: "code-block-no-lines",
    component: React.lazy(async () => import("@/examples/code-block-no-lines")),
    file: "src/examples/code-block-no-lines.tsx",
  },
  "code-block-no-header": {
    name: "code-block-no-header",
    component: React.lazy(
      async () => import("@/examples/code-block-no-header")
    ),
    file: "src/examples/code-block-no-header.tsx",
  },
  "container-layout": {
    name: "container-layout",
    component: React.lazy(async () => import("@/examples/container-layout")),
    file: "src/examples/container-layout.tsx",
  },
  "dropdown-menu-sorting": {
    name: "dropdown-menu-sorting",
    component: React.lazy(
      async () => import("@/examples/dropdown-menu-sorting")
    ),
    file: "src/examples/dropdown-menu-sorting.tsx",
  },
  "use-prompt-demo": {
    name: "use-prompt-demo",
    component: React.lazy(async () => import("@/examples/use-prompt-demo")),
    file: "src/examples/use-prompt-demo.tsx",
  },
  "use-prompt-verification": {
    name: "use-prompt-demo",
    component: React.lazy(
      async () => import("@/examples/use-prompt-verification")
    ),
    file: "src/examples/use-prompt-verification.tsx",
  },
  "use-toggle-state-demo": {
    name: "use-toggle-state",
    component: React.lazy(
      async () => import("@/examples/use-toggle-state-demo")
    ),
    file: "src/examples/use-toggle-state-demo.tsx",
  },
}
