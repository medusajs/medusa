import { infrastructureModulesSidebar } from "./sidebars/infrastructure-modules.mjs"
import { integrationsSidebar } from "./sidebars/integrations.mjs"
import { recipesSidebar } from "./sidebars/recipes.mjs"
import { referencesSidebar } from "./sidebars/references.mjs"
import { toolsSidebar } from "./sidebars/tools.mjs"
import { storefrontDevelopmentSidebar } from "./sidebars/storefront.mjs"
import { troubleshootingSidebar } from "./sidebars/troubleshooting.mjs"
import { howToTutorialsSidebar } from "./sidebars/how-to-tutorials.mjs"
import { commerceModulesSidebar } from "./sidebars/commerce-modules.mjs"
import { enterpriseSidebar } from "./sidebars/enterprise.mjs"

/** @type {import("types").Sidebar.RawSidebar[]} */
export const sidebar = [
  {
    sidebar_id: "recipes",
    title: "Recipes",
    items: recipesSidebar,
  },
  {
    sidebar_id: "how-to-tutorials",
    title: "How-To & Tutorials",
    items: howToTutorialsSidebar,
  },
  {
    sidebar_id: "integrations",
    title: "Integrations",
    items: integrationsSidebar,
  },
  {
    sidebar_id: "storefront-development",
    title: "Storefront Development",
    items: storefrontDevelopmentSidebar,
  },
  {
    sidebar_id: "tools",
    title: "Tools",
    items: toolsSidebar,
  },
  {
    sidebar_id: "references",
    title: "References",
    items: referencesSidebar,
  },
  {
    sidebar_id: "commerce-modules",
    title: "Commerce Modules",
    items: commerceModulesSidebar,
  },
  {
    sidebar_id: "enterprise",
    title: "Enterprise",
    items: enterpriseSidebar,
  },
  {
    sidebar_id: "infrastructure-modules",
    title: "Infrastructure Modules",
    items: infrastructureModulesSidebar,
  },
  {
    sidebar_id: "troubleshooting",
    title: "Troubleshooting",
    items: troubleshootingSidebar,
  },
]
