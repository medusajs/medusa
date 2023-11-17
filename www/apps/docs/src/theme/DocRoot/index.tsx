import React from "react"
import clsx from "clsx"
import {
  HtmlClassNameProvider,
  ThemeClassNames,
} from "@docusaurus/theme-common"
import {
  DocsSidebarProvider,
  useDocRootMetadata,
} from "@docusaurus/theme-common/internal"
import DocRootLayout from "@theme/DocRoot/Layout"
import NotFoundContent from "@theme/NotFound/Content"
import type { Props } from "@theme/DocRoot"
import SidebarProvider from "../../providers/Sidebar"

export default function DocRoot(props: Props): JSX.Element {
  const currentDocRouteMetadata = useDocRootMetadata(props)
  if (!currentDocRouteMetadata) {
    // We only render the not found content to avoid a double layout
    // see https://github.com/facebook/docusaurus/pull/7966#pullrequestreview-1077276692
    return <NotFoundContent />
  }
  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata
  return (
    <HtmlClassNameProvider className={clsx(ThemeClassNames.page.docsDocPage)}>
      <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
        <SidebarProvider sidebarName={sidebarName}>
          <DocRootLayout>{docElement}</DocRootLayout>
        </SidebarProvider>
      </DocsSidebarProvider>
    </HtmlClassNameProvider>
  )
}
