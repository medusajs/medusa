/** @type {import('types').Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "ui",
    title: "Medusa UI",
    items: [
      {
        type: "link",
        title: "Introduction",
        path: "/",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Installation",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Medusa Admin Extension",
            path: "/installation/medusa-admin-extension",
          },
          {
            type: "link",
            title: "Standalone Project",
            path: "/installation/standalone-project",
          },
        ],
      },
      {
        type: "link",
        title: "Icons",
        path: "/icons/overview",
      },
      {
        type: "link",
        title: "Colors",
        path: "/colors/overview",
      },
      {
        type: "separator",
      },
      {
        type: "category",
        title: "Components",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "Alert",
            path: "/components/alert",
          },
          {
            type: "link",
            title: "Avatar",
            path: "/components/avatar",
          },
          {
            type: "link",
            title: "Badge",
            path: "/components/badge",
          },
          {
            type: "link",
            title: "Button",
            path: "/components/button",
          },
          {
            type: "link",
            title: "Calendar",
            path: "/components/calendar",
          },
          {
            type: "link",
            title: "Checkbox",
            path: "/components/checkbox",
          },
          {
            type: "link",
            title: "Code Block",
            path: "/components/code-block",
          },
          {
            type: "link",
            title: "Command",
            path: "/components/command",
          },
          {
            type: "link",
            title: "Command Bar",
            path: "/components/command-bar",
          },
          {
            type: "link",
            title: "Container",
            path: "/components/container",
          },
          {
            type: "link",
            title: "Copy",
            path: "/components/copy",
          },
          {
            type: "link",
            title: "Currency Input",
            path: "/components/currency-input",
          },
          {
            type: "link",
            title: "Data Table",
            path: "/components/data-table",
          },
          {
            type: "link",
            title: "Date Picker",
            path: "/components/date-picker",
          },
          {
            type: "link",
            title: "Drawer",
            path: "/components/drawer",
          },
          {
            type: "link",
            title: "Dropdown Menu",
            path: "/components/dropdown-menu",
          },
          {
            type: "link",
            title: "Focus Modal",
            path: "/components/focus-modal",
          },
          {
            type: "link",
            title: "Heading",
            path: "/components/heading",
          },
          {
            type: "link",
            title: "Icon Badge",
            path: "/components/icon-badge",
          },
          {
            type: "link",
            title: "Icon Button",
            path: "/components/icon-button",
          },
          {
            type: "link",
            title: "Inline Tip",
            path: "/components/inline-tip",
          },
          {
            type: "link",
            title: "Input",
            path: "/components/input",
          },
          {
            type: "link",
            title: "Kbd",
            path: "/components/kbd",
          },
          {
            type: "link",
            title: "Label",
            path: "/components/label",
          },
          {
            type: "link",
            title: "OTP Input",
            path: "/components/otp-input",
          },
          {
            type: "link",
            title: "Progress Accordion",
            path: "/components/progress-accordion",
          },
          {
            type: "link",
            title: "Progress Tabs",
            path: "/components/progress-tabs",
          },
          {
            type: "link",
            title: "Prompt",
            path: "/components/prompt",
          },
          {
            type: "link",
            title: "Radio Group",
            path: "/components/radio-group",
          },
          {
            type: "link",
            title: "Select",
            path: "/components/select",
          },
          {
            type: "link",
            title: "Status Badge",
            path: "/components/status-badge",
          },
          {
            type: "link",
            title: "Switch",
            path: "/components/switch",
          },
          {
            type: "link",
            title: "Table",
            path: "/components/table",
          },
          {
            type: "link",
            title: "Tabs",
            path: "/components/tabs",
          },
          {
            type: "link",
            title: "Text",
            path: "/components/text",
          },
          {
            type: "link",
            title: "Textarea",
            path: "/components/textarea",
          },
          {
            type: "link",
            title: "Toast",
            path: "/components/toast",
          },
          {
            type: "link",
            title: "Tooltip",
            path: "/components/tooltip",
          },
        ],
      },
      {
        type: "category",
        title: "Hooks",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "usePrompt",
            path: "/hooks/use-prompt",
          },
          {
            type: "link",
            title: "useToggleState",
            path: "/hooks/use-toggle-state",
          },
        ],
      },
      {
        type: "category",
        title: "Utils",
        initialOpen: true,
        children: [
          {
            type: "link",
            title: "clx",
            path: "/utils/clx",
          },
        ],
      },
    ],
  },
]
