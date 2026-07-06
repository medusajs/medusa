import { changelogSidebar } from "./sidebars/changelog.mjs"
import { developersSidebar } from "./sidebars/developers.mjs"
import { featuresSidebar } from "./sidebars/features.mjs"
import { gettingStartedSidebar } from "./sidebars/getting-started.mjs"
import { promptingSidebar } from "./sidebars/prompting.mjs"

/** @type {import('types').Sidebar.RawSidebar[]} */
export const sidebar = [
  ...gettingStartedSidebar,
  ...featuresSidebar,
  ...promptingSidebar,
  ...developersSidebar,
  ...changelogSidebar,
]
