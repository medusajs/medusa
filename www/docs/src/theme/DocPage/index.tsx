import React, { useCallback, useEffect, useState } from "react"
import clsx from "clsx"
import {
  HtmlClassNameProvider,
  ThemeClassNames,
  PageMetadata,
  prefersReducedMotion,
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
import { SidebarContext } from "@site/src/context/sidebar"

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

  const [hiddenSidebar, setHiddenSidebar] = useState(false)
  const [hiddenSidebarContainer, setHiddenSidebarContainer] = useState(false)
  const [floatingSidebar, setFloatingSidebar] = useState(false)
  const toggleSidebar = useCallback(() => {
    if (hiddenSidebar) {
      setHiddenSidebar(false)
    }
    // onTransitionEnd won't fire when sidebar animation is disabled
    // fixes https://github.com/facebook/docusaurus/issues/8918
    if (!hiddenSidebar && prefersReducedMotion()) {
      setHiddenSidebar(true)
    }
    setHiddenSidebarContainer((value) => !value)
  }, [setHiddenSidebarContainer, hiddenSidebar])

  useEffect(() => {
    function isEditingContent(event: KeyboardEvent) {
      const element = event.target as HTMLElement
      const tagName = element.tagName
      return (
        element.isContentEditable ||
        tagName === "INPUT" ||
        tagName === "SELECT" ||
        tagName === "TEXTAREA"
      )
    }

    function sidebarShortcut(e: KeyboardEvent) {
      if (
        (e.metaKey || e.ctrlKey) &&
        e.key.toLowerCase() === "i" &&
        !isEditingContent(e)
      ) {
        e.preventDefault()
        toggleSidebar()
      }
    }

    window.addEventListener("keydown", sidebarShortcut)

    return () => {
      window.removeEventListener("keydown", sidebarShortcut)
    }
  })

  console.log(sidebarName)

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
            <SidebarContext.Provider
              value={{
                hasSidebar: sidebarName !== undefined,
                hiddenSidebar,
                setHiddenSidebar,
                hiddenSidebarContainer,
                setHiddenSidebarContainer,
                floatingSidebar,
                setFloatingSidebar,
                onCollapse: toggleSidebar,
              }}
            >
              <DocPageLayout>{docElement}</DocPageLayout>
            </SidebarContext.Provider>
          </DocsSidebarProvider>
        </DocsVersionProvider>
      </HtmlClassNameProvider>
    </>
  )
}
