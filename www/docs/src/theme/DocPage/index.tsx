import React from "react"
import clsx from "clsx"
import {
  HtmlClassNameProvider,
  ThemeClassNames,
  PageMetadata,
} from "@docusaurus/theme-common"
import {
  docVersionSearchTag,
  DocsSidebarProvider,
  DocsVersionProvider,
  useDocRouteMetadata,
} from "@docusaurus/theme-common/internal"
import DocPageLayout from "@theme/DocPage/Layout"
import NotFound from "@theme/NotFound"
import SearchMetadata from "@theme/SearchMetadata"
import type { Props } from "@theme/DocPage"
import SidebarProvider from "@site/src/providers/Sidebar"

function DocPageMetadata(props: Props): JSX.Element {
  const { versionMetadata } = props
  return (
    <>
      <SearchMetadata
        version={versionMetadata.version}
        tag={docVersionSearchTag(
          versionMetadata.pluginId,
          versionMetadata.version
        )}
      />
      <PageMetadata>
        {versionMetadata.noIndex && (
          <meta name="robots" content="noindex, nofollow" />
        )}
      </PageMetadata>
    </>
  )
}

export default function DocPage(props: Props): JSX.Element {
  const { versionMetadata } = props
  const currentDocRouteMetadata = useDocRouteMetadata(props)
  if (!currentDocRouteMetadata) {
    return <NotFound />
  }
  const { docElement, sidebarName, sidebarItems } = currentDocRouteMetadata

  return (
    <>
      <DocPageMetadata {...props} />
      <HtmlClassNameProvider
        className={clsx(
          // TODO: it should be removed from here
          ThemeClassNames.wrapper.docsPages,
          ThemeClassNames.page.docsDocPage,
          props.versionMetadata.className
          // sidebarName && "doc-has-sidebar"
        )}
      >
        <DocsVersionProvider version={versionMetadata}>
          <DocsSidebarProvider name={sidebarName} items={sidebarItems}>
            <SidebarProvider sidebarName={sidebarName}>
              <DocPageLayout>{docElement}</DocPageLayout>
            </SidebarProvider>
          </DocsSidebarProvider>
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </>
  )
}
