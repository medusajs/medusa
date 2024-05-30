import { ArrowUpRightOnBox } from "@medusajs/icons"
import { NavbarLinkProps, getNavbarItems, mobileSidebarItems } from "docs-ui"
import { SidebarSectionItemsType } from "types"
import { siteConfig } from "./site"

type DocsConfig = {
  mainNav: NavbarLinkProps[]
  sidebar: SidebarSectionItemsType
}

export const docsConfig: DocsConfig = {
  mainNav: getNavbarItems({
    basePath: siteConfig.baseUrl,
    activePath: process.env.NEXT_PUBLIC_BASE_PATH || "/ui",
  }),
  sidebar: {
    top: [
      {
        title: "Getting Started",
        children: [
          {
            title: "Introduction",
            path: "/",
            loaded: true,
            isPathHref: true,
          },
        ],
      },
      {
        title: "Installation",
        children: [
          {
            title: "Medusa Admin Extension",
            path: "/installation/medusa-admin-extension",
            isPathHref: true,
          },
          {
            title: "Standalone Project",
            path: "/installation/standalone-project",
            isPathHref: true,
          },
          {
            title: "Upgrade Guides",
            path: `${process.env.NEXT_PUBLIC_DOCS_URL}/upgrade-guides/medusa-ui`,
            isPathHref: true,
            additionalElms: <ArrowUpRightOnBox />,
            linkProps: {
              target: "_blank",
              rel: "noreferrer",
            },
          },
        ],
      },
    ],
    bottom: [
      {
        title: "Colors",
        children: [
          {
            title: "Overview",
            path: "/colors/overview",
            isPathHref: true,
          },
        ],
      },
      {
        title: "Icons",
        children: [
          {
            title: "Overview",
            path: "/icons/overview",
            isPathHref: true,
          },
        ],
      },
      {
        title: "Components",
        children: [
          {
            title: "Alert",
            path: "/components/alert",
            isPathHref: true,
          },
          {
            title: "Avatar",
            path: "/components/avatar",
            isPathHref: true,
          },
          {
            title: "Badge",
            path: "/components/badge",
            isPathHref: true,
          },
          {
            title: "Button",
            path: "/components/button",
            isPathHref: true,
          },
          {
            title: "Calendar",
            path: "/components/calendar",
            isPathHref: true,
          },
          {
            title: "Checkbox",
            path: "/components/checkbox",
            isPathHref: true,
          },
          {
            title: "Code Block",
            path: "/components/code-block",
            isPathHref: true,
          },
          {
            title: "Command",
            path: "/components/command",
            isPathHref: true,
          },
          {
            title: "Command Bar",
            path: "/components/command-bar",
            isPathHref: true,
          },
          {
            title: "Container",
            path: "/components/container",
            isPathHref: true,
          },
          {
            title: "Copy",
            path: "/components/copy",
            isPathHref: true,
          },
          {
            title: "Currency Input",
            path: "/components/currency-input",
            isPathHref: true,
          },
          {
            title: "Date Picker",
            path: "/components/date-picker",
            isPathHref: true,
          },
          {
            title: "Drawer",
            path: "/components/drawer",
            isPathHref: true,
          },
          {
            title: "Dropdown Menu",
            path: "/components/dropdown-menu",
            isPathHref: true,
          },
          {
            title: "Focus Modal",
            path: "/components/focus-modal",
            isPathHref: true,
          },
          {
            title: "Heading",
            path: "/components/heading",
            isPathHref: true,
          },
          {
            title: "Icon Badge",
            path: "/components/icon-badge",
            isPathHref: true,
          },
          {
            title: "Icon Button",
            path: "/components/icon-button",
            isPathHref: true,
          },
          {
            title: "Input",
            path: "/components/input",
            isPathHref: true,
          },
          {
            title: "Kbd",
            path: "/components/kbd",
            isPathHref: true,
          },
          {
            title: "Label",
            path: "/components/label",
            isPathHref: true,
          },
          {
            title: "Progress Accordion",
            path: "/components/progress-accordion",
            isPathHref: true,
          },
          {
            title: "Progress Tabs",
            path: "/components/progress-tabs",
            isPathHref: true,
          },
          {
            title: "Prompt",
            path: "/components/prompt",
            isPathHref: true,
          },
          {
            title: "Radio Group",
            path: "/components/radio-group",
            isPathHref: true,
          },
          {
            title: "Select",
            path: "/components/select",
            isPathHref: true,
          },
          {
            title: "Status Badge",
            path: "/components/status-badge",
            isPathHref: true,
          },
          {
            title: "Switch",
            path: "/components/switch",
            isPathHref: true,
          },
          {
            title: "Table",
            path: "/components/table",
            isPathHref: true,
          },
          {
            title: "Tabs",
            path: "/components/tabs",
            isPathHref: true,
          },
          {
            title: "Text",
            path: "/components/text",
            isPathHref: true,
          },
          {
            title: "Textarea",
            path: "/components/textarea",
            isPathHref: true,
          },
          {
            title: "Toast",
            path: "/components/toast",
            isPathHref: true,
          },
          {
            title: "Tooltip",
            path: "/components/tooltip",
            isPathHref: true,
          },
        ],
      },
      {
        title: "Hooks",
        children: [
          {
            title: "usePrompt",
            path: "/hooks/use-prompt",
            isPathHref: true,
          },
          {
            title: "useToast",
            path: "/hooks/use-toast",
            isPathHref: true,
          },
          {
            title: "useToggleState",
            path: "/hooks/use-toggle-state",
            isPathHref: true,
          },
        ],
      },
      {
        title: "Utils",
        children: [
          {
            title: "clx",
            path: "/utils/clx",
            isPathHref: true,
          },
        ],
      },
    ],
    mobile: mobileSidebarItems,
  },
}
