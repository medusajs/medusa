import dynamic from "next/dynamic.js"

/**
 * @type {import("types").ExampleRegistry}
 */
export const ExampleRegistry = {
  "alert-demo": {
    name: "alert-demo",
    component: dynamic(() => import("@/specs/examples/alert-demo")),
    file: "specs/examples/alert-demo.tsx",
  },
  "alert-dismissable": {
    name: "alert-dismissable",
    component: dynamic(() => import("@/specs/examples/alert-dismissable")),
    file: "specs/examples/alert-dismissable.tsx",
  },
  "alert-warning": {
    name: "alert-warning",
    component: dynamic(() => import("@/specs/examples/alert-warning")),
    file: "specs/examples/alert-warning.tsx",
  },
  "alert-success": {
    name: "alert-success",
    component: dynamic(() => import("@/specs/examples/alert-success")),
    file: "specs/examples/alert-success.tsx",
  },
  "alert-error": {
    name: "alert-error",
    component: dynamic(() => import("@/specs/examples/alert-error")),
    file: "specs/examples/alert-error.tsx",
  },
  "avatar-demo": {
    name: "avatar-demo",
    component: dynamic(() => import("@/specs/examples/avatar-demo")),
    file: "specs/examples/avatar-demo.tsx",
  },
  "avatar-accessible": {
    name: "avatar-accessible",
    component: dynamic(() => import("@/specs/examples/avatar-accessible")),
    file: "specs/examples/avatar-accessible.tsx",
  },
  "avatar-custom-style": {
    name: "avatar-custom-style",
    component: dynamic(() => import("@/specs/examples/avatar-custom-style")),
    file: "specs/examples/avatar-custom-style.tsx",
  },
  "avatar-fallback": {
    name: "avatar-fallback",
    component: dynamic(() => import("@/specs/examples/avatar-fallback")),
    file: "specs/examples/avatar-fallback.tsx",
  },
  "avatar-sizes": {
    name: "avatar-sizes",
    component: dynamic(() => import("@/specs/examples/avatar-sizes")),
    file: "specs/examples/avatar-sizes.tsx",
  },
  "avatar-variants": {
    name: "avatar-variants",
    component: dynamic(() => import("@/specs/examples/avatar-variants")),
    file: "specs/examples/avatar-variants.tsx",
  },
  "badge-demo": {
    name: "badge-demo",
    component: dynamic(() => import("@/specs/examples/badge-demo")),
    file: "specs/examples/badge-demo.tsx",
  },
  "badge-all-colors": {
    name: "badge-all-colors",
    component: dynamic(() => import("@/specs/examples/badge-all-colors")),
    file: "specs/examples/badge-all-colors.tsx",
  },
  "badge-all-sizes": {
    name: "badge-all-sizes",
    component: dynamic(() => import("@/specs/examples/badge-all-sizes")),
    file: "specs/examples/badge-all-sizes.tsx",
  },
  "badge-all-rounded": {
    name: "badge-all-rounded",
    component: dynamic(() => import("@/specs/examples/badge-all-rounded")),
    file: "specs/examples/badge-all-rounded.tsx",
  },
  "data-table-demo": {
    name: "data-table-demo",
    component: dynamic(() => import("@/specs/examples/data-table-demo")),
    file: "specs/examples/data-table-demo.tsx",
  },
  "data-table-row-click": {
    name: "data-table-row-click",
    component: dynamic(() => import("@/specs/examples/data-table-row-click")),
    file: "specs/examples/data-table-row-click.tsx",
  },
  "data-table-custom-cell": {
    name: "data-table-custom-cell",
    component: dynamic(() => import("@/specs/examples/data-table-custom-cell")),
    file: "specs/examples/data-table-custom-cell.tsx",
  },
  "data-table-search": {
    name: "data-table-search",
    component: dynamic(() => import("@/specs/examples/data-table-search")),
    file: "specs/examples/data-table-search.tsx",
  },
  "data-table-pagination": {
    name: "data-table-pagination",
    component: dynamic(() => import("@/specs/examples/data-table-pagination")),
    file: "specs/examples/data-table-pagination.tsx",
  },
  "data-table-filters": {
    name: "data-table-filters",
    component: dynamic(() => import("@/specs/examples/data-table-filters")),
    file: "specs/examples/data-table-filters.tsx",
  },
  "data-table-filters-date": {
    name: "data-table-filters-date",
    component: dynamic(
      () => import("@/specs/examples/data-table-filters-date")
    ),
    file: "specs/examples/data-table-filters-date.tsx",
  },
  "data-table-filters-initial": {
    name: "data-table-filters-initial",
    component: dynamic(
      () => import("@/specs/examples/data-table-filters-initial")
    ),
    file: "specs/examples/data-table-filters-initial.tsx",
  },
  "data-table-sorting": {
    name: "data-table-sorting",
    component: dynamic(() => import("@/specs/examples/data-table-sorting")),
    file: "specs/examples/data-table-sorting.tsx",
  },
  "data-table-sorting-initial": {
    name: "data-table-sorting-initial",
    component: dynamic(
      () => import("@/specs/examples/data-table-sorting-initial")
    ),
    file: "specs/examples/data-table-sorting-initial.tsx",
  },
  "data-table-commands": {
    name: "data-table-commands",
    component: dynamic(() => import("@/specs/examples/data-table-commands")),
    file: "specs/examples/data-table-commands.tsx",
  },
  "icon-badge-demo": {
    name: "icon-badge-demo",
    component: dynamic(() => import("@/specs/examples/icon-badge-demo")),
    file: "specs/examples/icon-badge-demo.tsx",
  },
  "icon-badge-all-colors": {
    name: "icon-badge-all-colors",
    component: dynamic(() => import("@/specs/examples/icon-badge-all-colors")),
    file: "specs/examples/icon-badge-all-colors.tsx",
  },
  "icon-badge-all-sizes": {
    name: "icon-badge-all-sizes",
    component: dynamic(() => import("@/specs/examples/icon-badge-all-sizes")),
    file: "specs/examples/icon-badge-all-sizes.tsx",
  },
  "inline-tip-demo": {
    name: "inline-tip-demo",
    component: dynamic(() => import("@/specs/examples/inline-tip-demo")),
    file: "specs/examples/inline-tip-demo.tsx",
  },
  "inline-tip-warning": {
    name: "inline-tip-warning",
    component: dynamic(() => import("@/specs/examples/inline-tip-warning")),
    file: "specs/examples/inline-tip-warning.tsx",
  },
  "inline-tip-error": {
    name: "inline-tip-error",
    component: dynamic(() => import("@/specs/examples/inline-tip-error")),
    file: "specs/examples/inline-tip-error.tsx",
  },
  "inline-tip-success": {
    name: "inline-tip-success",
    component: dynamic(() => import("@/specs/examples/inline-tip-success")),
    file: "specs/examples/inline-tip-success.tsx",
  },
  "calendar-demo": {
    name: "calendar-demo",
    component: dynamic(() => import("@/specs/examples/calendar-demo")),
    file: "specs/examples/calendar-demo.tsx",
  },
  "calendar-controlled": {
    name: "calendar-controlled",
    component: dynamic(() => import("@/specs/examples/calendar-controlled")),
    file: "specs/examples/calendar-controlled.tsx",
  },
  "calendar-min-max": {
    name: "calendar-min-max",
    component: dynamic(() => import("@/specs/examples/calendar-min-max")),
    file: "specs/examples/calendar-min-max.tsx",
  },
  "calendar-unavailable": {
    name: "calendar-unavailable",
    component: dynamic(() => import("@/specs/examples/calendar-unavailable")),
    file: "specs/examples/calendar-unavailable.tsx",
  },
  "checkbox-demo": {
    name: "checkbox-demo",
    component: dynamic(() => import("@/specs/examples/checkbox-demo")),
    file: "specs/examples/checkbox-demo.tsx",
  },
  "code-block-demo": {
    name: "code-block-demo",
    component: dynamic(() => import("@/specs/examples/code-block-demo")),
    file: "specs/examples/code-block-demo.tsx",
  },
  "command-demo": {
    name: "command-demo",
    component: dynamic(() => import("@/specs/examples/command-demo")),
    file: "specs/examples/command-demo.tsx",
  },
  "container-demo": {
    name: "container-demo",
    component: dynamic(() => import("@/specs/examples/container-demo")),
    file: "specs/examples/container-demo.tsx",
  },
  "copy-demo": {
    name: "copy-demo",
    component: dynamic(() => import("@/specs/examples/copy-demo")),
    file: "specs/examples/copy-demo.tsx",
  },
  "copy-custom-display": {
    name: "copy-custom-display",
    component: dynamic(() => import("@/specs/examples/copy-custom-display")),
    file: "specs/examples/copy-custom-display.tsx",
  },
  "copy-as-child": {
    name: "copy-as-child",
    component: dynamic(() => import("@/specs/examples/copy-as-child")),
    file: "specs/examples/copy-as-child.tsx",
  },
  "date-picker-demo": {
    name: "date-picker-demo",
    component: dynamic(() => import("@/specs/examples/date-picker-demo")),
    file: "specs/examples/date-picker-demo.tsx",
  },
  "date-picker-controlled": {
    name: "date-picker-controlled",
    component: dynamic(() => import("@/specs/examples/date-picker-controlled")),
    file: "specs/examples/date-picker-controlled.tsx",
  },
  "date-picker-with-time": {
    name: "date-picker-with-time",
    component: dynamic(() => import("@/specs/examples/date-picker-with-time")),
    file: "specs/examples/date-picker-with-time.tsx",
  },
  "date-picker-min-max": {
    name: "date-picker-min-max",
    component: dynamic(() => import("@/specs/examples/date-picker-min-max")),
    file: "specs/examples/date-picker-min-max.tsx",
  },
  "date-picker-business-hours": {
    name: "date-picker-business-hours",
    component: dynamic(
      () => import("@/specs/examples/date-picker-business-hours")
    ),
    file: "specs/examples/date-picker-business-hours.tsx",
  },
  "date-picker-granularity": {
    name: "date-picker-granularity",
    component: dynamic(
      () => import("@/specs/examples/date-picker-granularity")
    ),
    file: "specs/examples/date-picker-granularity.tsx",
  },
  "date-picker-form": {
    name: "date-picker-form",
    component: dynamic(() => import("@/specs/examples/date-picker-form")),
    file: "specs/examples/date-picker-form.tsx",
  },
  "drawer-demo": {
    name: "drawer-demo",
    component: dynamic(() => import("@/specs/examples/drawer-demo")),
    file: "specs/examples/drawer-demo.tsx",
  },
  "drawer-form": {
    name: "drawer-form",
    component: dynamic(() => import("@/specs/examples/drawer-form")),
    file: "specs/examples/drawer-form.tsx",
  },
  "dropdown-menu-demo": {
    name: "dropdown-menu-demo",
    component: dynamic(() => import("@/specs/examples/dropdown-menu-demo")),
    file: "specs/examples/dropdown-menu-demo.tsx",
  },
  "dropdown-menu-submenu": {
    name: "dropdown-menu-submenu",
    component: dynamic(() => import("@/specs/examples/dropdown-menu-submenu")),
    file: "specs/examples/dropdown-menu-submenu.tsx",
  },
  "dropdown-menu-disabled-icons": {
    name: "dropdown-menu-disabled-icons",
    component: dynamic(
      () => import("@/specs/examples/dropdown-menu-disabled-icons")
    ),
    file: "specs/examples/dropdown-menu-disabled-icons.tsx",
  },
  "dropdown-menu-shortcuts": {
    name: "dropdown-menu-shortcuts",
    component: dynamic(
      () => import("@/specs/examples/dropdown-menu-shortcuts")
    ),
    file: "specs/examples/dropdown-menu-shortcuts.tsx",
  },
  "focus-modal-demo": {
    name: "focus-modal-demo",
    component: dynamic(() => import("@/specs/examples/focus-modal-demo")),
    file: "specs/examples/focus-modal-demo.tsx",
  },
  "focus-modal-controlled": {
    name: "focus-modal-controlled",
    component: dynamic(() => import("@/specs/examples/focus-modal-controlled")),
    file: "specs/examples/focus-modal-controlled.tsx",
  },
  "focus-modal-form": {
    name: "focus-modal-form",
    component: dynamic(() => import("@/specs/examples/focus-modal-form")),
    file: "specs/examples/focus-modal-form.tsx",
  },
  "focus-modal-nested": {
    name: "focus-modal-nested",
    component: dynamic(() => import("@/specs/examples/focus-modal-nested")),
    file: "specs/examples/focus-modal-nested.tsx",
  },
  "heading-demo": {
    name: "heading-demo",
    component: dynamic(() => import("@/specs/examples/heading-demo")),
    file: "specs/examples/heading-demo.tsx",
  },
  "input-demo": {
    name: "input-demo",
    component: dynamic(() => import("@/specs/examples/input-demo")),
    file: "specs/examples/input-demo.tsx",
  },
  "input-password": {
    name: "input-password",
    component: dynamic(() => import("@/specs/examples/input-password")),
    file: "specs/examples/input-password.tsx",
  },
  "input-search": {
    name: "input-search",
    component: dynamic(() => import("@/specs/examples/input-search")),
    file: "specs/examples/input-search.tsx",
  },
  "input-controlled": {
    name: "input-controlled",
    component: dynamic(() => import("@/specs/examples/input-controlled")),
    file: "specs/examples/input-controlled.tsx",
  },
  "input-disabled": {
    name: "input-disabled",
    component: dynamic(() => import("@/specs/examples/input-disabled")),
    file: "specs/examples/input-disabled.tsx",
  },
  "input-small": {
    name: "input-small",
    component: dynamic(() => import("@/specs/examples/input-small")),
    file: "specs/examples/input-small.tsx",
  },
  "input-error": {
    name: "input-error",
    component: dynamic(() => import("@/specs/examples/input-error")),
    file: "specs/examples/input-error.tsx",
  },
  "kbd-demo": {
    name: "kbd-demo",
    component: dynamic(() => import("@/specs/examples/kbd-demo")),
    file: "specs/examples/kbd-demo.tsx",
  },
  "label-demo": {
    name: "label-demo",
    component: dynamic(() => import("@/specs/examples/label-demo")),
    file: "specs/examples/label-demo.tsx",
  },
  "label-all-sizes": {
    name: "label-all-sizes",
    component: dynamic(() => import("@/specs/examples/label-all-sizes")),
    file: "specs/examples/label-all-sizes.tsx",
  },
  "label-with-inputs": {
    name: "label-with-inputs",
    component: dynamic(() => import("@/specs/examples/label-with-inputs")),
    file: "specs/examples/label-with-inputs.tsx",
  },
  "otp-input-demo": {
    name: "otp-input-demo",
    component: dynamic(() => import("@/specs/examples/otp-input-demo")),
    file: "specs/examples/otp-input-demo.tsx",
  },
  "otp-input-pin": {
    name: "otp-input-pin",
    component: dynamic(() => import("@/specs/examples/otp-input-pin")),
    file: "specs/examples/otp-input-pin.tsx",
  },
  "otp-input-custom-separator": {
    name: "otp-input-custom-separator",
    component: dynamic(
      () => import("@/specs/examples/otp-input-custom-separator")
    ),
    file: "specs/examples/otp-input-custom-separator.tsx",
  },
  "otp-input-on-complete": {
    name: "otp-input-on-complete",
    component: dynamic(() => import("@/specs/examples/otp-input-on-complete")),
    file: "specs/examples/otp-input-on-complete.tsx",
  },
  "otp-input-group-size": {
    name: "otp-input-group-size",
    component: dynamic(() => import("@/specs/examples/otp-input-group-size")),
    file: "specs/examples/otp-input-group-size.tsx",
  },
  "otp-input-error": {
    name: "otp-input-error",
    component: dynamic(() => import("@/specs/examples/otp-input-error")),
    file: "specs/examples/otp-input-error.tsx",
  },
  "prompt-demo": {
    name: "prompt-demo",
    component: dynamic(() => import("@/specs/examples/prompt-demo")),
    file: "specs/examples/prompt-demo.tsx",
  },
  "prompt-confirmation": {
    name: "prompt-confirmation",
    component: dynamic(() => import("@/specs/examples/prompt-confirmation")),
    file: "specs/examples/prompt-confirmation.tsx",
  },
  "radio-group-demo": {
    name: "radio-group-demo",
    component: dynamic(() => import("@/specs/examples/radio-group-demo")),
    file: "specs/examples/radio-group-demo.tsx",
  },
  "radio-group-descriptions": {
    name: "radio-group-descriptions",
    component: dynamic(
      () => import("@/specs/examples/radio-group-descriptions")
    ),
    file: "specs/examples/radio-group-descriptions.tsx",
  },
  "radio-group-disabled": {
    name: "radio-group-disabled",
    component: dynamic(() => import("@/specs/examples/radio-group-disabled")),
    file: "specs/examples/radio-group-disabled.tsx",
  },
  "radio-group-choicebox": {
    name: "radio-group-choicebox",
    component: dynamic(() => import("@/specs/examples/radio-group-choicebox")),
    file: "specs/examples/radio-group-choicebox.tsx",
  },
  "radio-group-controlled": {
    name: "radio-group-controlled",
    component: dynamic(() => import("@/specs/examples/radio-group-controlled")),
    file: "specs/examples/radio-group-controlled.tsx",
  },
  "select-demo": {
    name: "select-demo",
    component: dynamic(() => import("@/specs/examples/select-demo")),
    file: "specs/examples/select-demo.tsx",
  },
  "switch-demo": {
    name: "switch-demo",
    component: dynamic(() => import("@/specs/examples/switch-demo")),
    file: "specs/examples/switch-demo.tsx",
  },
  "switch-all-sizes": {
    name: "switch-all-sizes",
    component: dynamic(() => import("@/specs/examples/switch-all-sizes")),
    file: "specs/examples/switch-all-sizes.tsx",
  },
  "switch-disabled": {
    name: "switch-disabled",
    component: dynamic(() => import("@/specs/examples/switch-disabled")),
    file: "specs/examples/switch-disabled.tsx",
  },
  "switch-controlled": {
    name: "switch-controlled",
    component: dynamic(() => import("@/specs/examples/switch-controlled")),
    file: "specs/examples/switch-controlled.tsx",
  },
  "table-pagination": {
    name: "table-pagination",
    component: dynamic(() => import("@/specs/examples/table-pagination")),
    file: "specs/examples/table-pagination.tsx",
  },
  "table-demo": {
    name: "table-demo",
    component: dynamic(() => import("@/specs/examples/table-demo")),
    file: "specs/examples/table-demo.tsx",
  },
  "text-demo": {
    name: "text-demo",
    component: dynamic(() => import("@/specs/examples/text-demo")),
    file: "specs/examples/text-demo.tsx",
  },
  "text-sizes": {
    name: "text-sizes",
    component: dynamic(() => import("@/specs/examples/text-sizes")),
    file: "specs/examples/text-sizes.tsx",
  },
  "text-weights": {
    name: "text-weights",
    component: dynamic(() => import("@/specs/examples/text-weights")),
    file: "specs/examples/text-weights.tsx",
  },
  "text-fonts": {
    name: "text-fonts",
    component: dynamic(() => import("@/specs/examples/text-fonts")),
    file: "specs/examples/text-fonts.tsx",
  },
  "text-leading": {
    name: "text-leading",
    component: dynamic(() => import("@/specs/examples/text-leading")),
    file: "specs/examples/text-leading.tsx",
  },
  "textarea-demo": {
    name: "textarea-demo",
    component: dynamic(() => import("@/specs/examples/textarea-demo")),
    file: "specs/examples/textarea-demo.tsx",
  },
  "textarea-controlled": {
    name: "textarea-controlled",
    component: dynamic(() => import("@/specs/examples/textarea-controlled")),
    file: "specs/examples/textarea-controlled.tsx",
  },
  "textarea-disabled": {
    name: "textarea-disabled",
    component: dynamic(() => import("@/specs/examples/textarea-disabled")),
    file: "specs/examples/textarea-disabled.tsx",
  },
  "toaster-demo": {
    name: "toaster-demo",
    component: dynamic(() => import("@/specs/examples/toaster-demo")),
    file: "specs/examples/toaster-demo.tsx",
  },
  "toaster-all-variants": {
    name: "toaster-all-variants",
    component: dynamic(() => import("@/specs/examples/toaster-all-variants")),
    file: "specs/examples/toaster-all-variants.tsx",
  },
  "toaster-dismiss": {
    name: "toaster-dismiss",
    component: dynamic(() => import("@/specs/examples/toaster-dismiss")),
    file: "specs/examples/toaster-dismiss.tsx",
  },
  "toaster-with-action": {
    name: "toaster-with-action",
    component: dynamic(() => import("@/specs/examples/toaster-with-action")),
    file: "specs/examples/toaster-with-action.tsx",
  },
  "tooltip-demo": {
    name: "tooltip-demo",
    component: dynamic(() => import("@/specs/examples/tooltip-demo")),
    file: "specs/examples/tooltip-demo.tsx",
  },
  "tooltip-sides": {
    name: "tooltip-sides",
    component: dynamic(() => import("@/specs/examples/tooltip-sides")),
    file: "specs/examples/tooltip-sides.tsx",
  },
  "tooltip-maxwidth": {
    name: "tooltip-maxwidth",
    component: dynamic(() => import("@/specs/examples/tooltip-maxwidth")),
    file: "specs/examples/tooltip-maxwidth.tsx",
  },
  "button-demo": {
    name: "button-demo",
    component: dynamic(() => import("@/specs/examples/button-demo")),
    file: "specs/examples/button-demo.tsx",
  },
  "button-all-variants": {
    name: "button-all-variants",
    component: dynamic(() => import("@/specs/examples/button-all-variants")),
    file: "specs/examples/button-all-variants.tsx",
  },
  "button-all-sizes": {
    name: "button-all-sizes",
    component: dynamic(() => import("@/specs/examples/button-all-sizes")),
    file: "specs/examples/button-all-sizes.tsx",
  },
  "button-as-link": {
    name: "button-as-link",
    component: dynamic(() => import("@/specs/examples/button-as-link")),
    file: "specs/examples/button-as-link.tsx",
  },
  "button-loading": {
    name: "button-loading",
    component: dynamic(() => import("@/specs/examples/button-loading")),
    file: "specs/examples/button-loading.tsx",
  },
  "button-with-icon": {
    name: "button-with-icon",
    component: dynamic(() => import("@/specs/examples/button-with-icon")),
    file: "specs/examples/button-with-icon.tsx",
  },
  "icon-button-demo": {
    name: "icon-button-demo",
    component: dynamic(() => import("@/specs/examples/icon-button-demo")),
    file: "specs/examples/icon-button-demo.tsx",
  },
  "icon-button-all-variants": {
    name: "icon-button-all-variants",
    component: dynamic(
      () => import("@/specs/examples/icon-button-all-variants")
    ),
    file: "specs/examples/icon-button-all-variants.tsx",
  },
  "icon-button-all-sizes": {
    name: "icon-button-all-sizes",
    component: dynamic(() => import("@/specs/examples/icon-button-all-sizes")),
    file: "specs/examples/icon-button-all-sizes.tsx",
  },
  "icon-button-loading": {
    name: "icon-button-loading",
    component: dynamic(() => import("@/specs/examples/icon-button-loading")),
    file: "specs/examples/icon-button-loading.tsx",
  },
  "icon-button-disabled": {
    name: "icon-button-disabled",
    component: dynamic(() => import("@/specs/examples/icon-button-disabled")),
    file: "specs/examples/icon-button-disabled.tsx",
  },
  "icon-color": {
    name: "icon-color",
    component: dynamic(() => import("@/specs/examples/icon-color")),
    file: "specs/examples/icon-color.tsx",
  },
  "icon-color-classes": {
    name: "icon-color-classes",
    component: dynamic(() => import("@/specs/examples/icon-color-classes")),
    file: "specs/examples/icon-color-classes.tsx",
  },
  "currency-input-demo": {
    name: "currency-input-demo",
    component: dynamic(() => import("@/specs/examples/currency-input-demo")),
    file: "specs/examples/currency-input-demo.tsx",
  },
  "currency-input-controlled": {
    name: "currency-input-controlled",
    component: dynamic(
      () => import("@/specs/examples/currency-input-controlled")
    ),
    file: "specs/examples/currency-input-controlled.tsx",
  },
  "currency-input-disabled": {
    name: "currency-input-disabled",
    component: dynamic(
      () => import("@/specs/examples/currency-input-disabled")
    ),
    file: "specs/examples/currency-input-disabled.tsx",
  },
  "currency-input-error": {
    name: "currency-input-error",
    component: dynamic(() => import("@/specs/examples/currency-input-error")),
    file: "specs/examples/currency-input-error.tsx",
  },
  "currency-input-small": {
    name: "currency-input-small",
    component: dynamic(() => import("@/specs/examples/currency-input-small")),
    file: "specs/examples/currency-input-small.tsx",
  },
  "status-badge-demo": {
    name: "status-badge-demo",
    component: dynamic(() => import("@/specs/examples/status-badge-demo")),
    file: "specs/examples/status-badge-demo.tsx",
  },
  "status-badge-all-colors": {
    name: "status-badge-all-colors",
    component: dynamic(
      () => import("@/specs/examples/status-badge-all-colors")
    ),
    file: "specs/examples/status-badge-all-colors.tsx",
  },
  "command-bar-demo": {
    name: "command-bar-demo",
    component: dynamic(() => import("@/specs/examples/command-bar-demo")),
    file: "specs/examples/command-bar-demo.tsx",
  },
  "progress-accordion-demo": {
    name: "progress-accordion-demo",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-demo")
    ),
    file: "specs/examples/progress-accordion-demo.tsx",
  },
  "progress-accordion-single": {
    name: "progress-accordion-single",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-single")
    ),
    file: "specs/examples/progress-accordion-single.tsx",
  },
  "progress-accordion-multiple": {
    name: "progress-accordion-multiple",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-multiple")
    ),
    file: "specs/examples/progress-accordion-multiple.tsx",
  },
  "progress-accordion-status": {
    name: "progress-accordion-status",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-status")
    ),
    file: "specs/examples/progress-accordion-status.tsx",
  },
  "progress-accordion-controlled": {
    name: "progress-accordion-controlled",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-controlled")
    ),
    file: "specs/examples/progress-accordion-controlled.tsx",
  },
  "progress-accordion-disabled": {
    name: "progress-accordion-disabled",
    component: dynamic(
      () => import("@/specs/examples/progress-accordion-disabled")
    ),
    file: "specs/examples/progress-accordion-disabled.tsx",
  },
  "progress-tabs-demo": {
    name: "progress-tabs-demo",
    component: dynamic(() => import("@/specs/examples/progress-tabs-demo")),
    file: "specs/examples/progress-tabs-demo.tsx",
  },
  "progress-tabs-status": {
    name: "progress-tabs-status",
    component: dynamic(() => import("@/specs/examples/progress-tabs-status")),
    file: "specs/examples/progress-tabs-status.tsx",
  },
  "progress-tabs-controlled": {
    name: "progress-tabs-controlled",
    component: dynamic(
      () => import("@/specs/examples/progress-tabs-controlled")
    ),
    file: "specs/examples/progress-tabs-controlled.tsx",
  },
  "progress-tabs-disabled": {
    name: "progress-tabs-disabled",
    component: dynamic(() => import("@/specs/examples/progress-tabs-disabled")),
    file: "specs/examples/progress-tabs-disabled.tsx",
  },
  "tabs-demo": {
    name: "tabs-demo",
    component: dynamic(() => import("@/specs/examples/tabs-demo")),
    file: "specs/examples/tabs-demo.tsx",
  },
  "tabs-controlled": {
    name: "tabs-controlled",
    component: dynamic(() => import("@/specs/examples/tabs-controlled")),
    file: "specs/examples/tabs-controlled.tsx",
  },
  "tabs-disabled": {
    name: "tabs-disabled",
    component: dynamic(() => import("@/specs/examples/tabs-disabled")),
    file: "specs/examples/tabs-disabled.tsx",
  },
  "tabs-icons": {
    name: "tabs-icons",
    component: dynamic(() => import("@/specs/examples/tabs-icons")),
    file: "specs/examples/tabs-icons.tsx",
  },
  "tabs-vertical": {
    name: "tabs-vertical",
    component: dynamic(() => import("@/specs/examples/tabs-vertical")),
    file: "specs/examples/tabs-vertical.tsx",
  },
  "currency-input-base": {
    name: "currency-input-base",
    component: dynamic(() => import("@/specs/examples/currency-input-base")),
    file: "specs/examples/currency-input-base.tsx",
  },
  "select-item-aligned": {
    name: "select-item-aligned",
    component: dynamic(() => import("@/specs/examples/select-item-aligned")),
    file: "specs/examples/select-item-aligned.tsx",
  },
  "select-small": {
    name: "select-small",
    component: dynamic(() => import("@/specs/examples/select-small")),
    file: "specs/examples/select-small.tsx",
  },
  "select-disabled": {
    name: "select-disabled",
    component: dynamic(() => import("@/specs/examples/select-disabled")),
    file: "specs/examples/select-disabled.tsx",
  },
  "select-grouped-items": {
    name: "select-grouped-items",
    component: dynamic(() => import("@/specs/examples/select-grouped-items")),
    file: "specs/examples/select-grouped-items.tsx",
  },
  "select-controlled": {
    name: "select-controlled",
    component: dynamic(() => import("@/specs/examples/select-controlled")),
    file: "specs/examples/select-controlled.tsx",
  },
  "checkbox-all-states": {
    name: "checkbox-all-states",
    component: dynamic(() => import("@/specs/examples/checkbox-all-states")),
    file: "specs/examples/checkbox-all-states.tsx",
  },
  "checkbox-controlled": {
    name: "checkbox-controlled",
    component: dynamic(() => import("@/specs/examples/checkbox-controlled")),
    file: "specs/examples/checkbox-controlled.tsx",
  },
  "code-block-single": {
    name: "code-block-single",
    component: dynamic(() => import("@/specs/examples/code-block-single")),
    file: "specs/examples/code-block-single.tsx",
  },
  "code-block-no-lines": {
    name: "code-block-no-lines",
    component: dynamic(() => import("@/specs/examples/code-block-no-lines")),
    file: "specs/examples/code-block-no-lines.tsx",
  },
  "code-block-no-header": {
    name: "code-block-no-header",
    component: dynamic(() => import("@/specs/examples/code-block-no-header")),
    file: "specs/examples/code-block-no-header.tsx",
  },
  "code-block-no-copy": {
    name: "code-block-no-copy",
    component: dynamic(() => import("@/specs/examples/code-block-no-copy")),
    file: "specs/examples/code-block-no-copy.tsx",
  },
  "container-layout": {
    name: "container-layout",
    component: dynamic(() => import("@/specs/examples/container-layout")),
    file: "specs/examples/container-layout.tsx",
  },
  "dropdown-menu-sorting": {
    name: "dropdown-menu-sorting",
    component: dynamic(() => import("@/specs/examples/dropdown-menu-sorting")),
    file: "specs/examples/dropdown-menu-sorting.tsx",
  },
  "use-prompt-demo": {
    name: "use-prompt-demo",
    component: dynamic(() => import("@/specs/examples/use-prompt-demo")),
    file: "specs/examples/use-prompt-demo.tsx",
  },
  "use-prompt-verification": {
    name: "use-prompt-demo",
    component: dynamic(
      () => import("@/specs/examples/use-prompt-verification")
    ),
    file: "specs/examples/use-prompt-verification.tsx",
  },
  "use-toggle-state-demo": {
    name: "use-toggle-state",
    component: dynamic(() => import("@/specs/examples/use-toggle-state-demo")),
    file: "specs/examples/use-toggle-state-demo.tsx",
  },
}
