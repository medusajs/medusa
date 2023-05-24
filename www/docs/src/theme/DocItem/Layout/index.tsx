import React, { useContext } from "react"
import clsx from "clsx"
import { useWindowSize } from "@docusaurus/theme-common"
import { useDoc } from "@docusaurus/theme-common/internal"
import DocItemPaginator from "@theme/DocItem/Paginator"
import DocVersionBanner from "@theme/DocVersionBanner"
import DocVersionBadge from "@theme/DocVersionBadge"
import DocItemFooter from "@theme/DocItem/Footer"
import DocItemTOCMobile from "@theme/DocItem/TOC/Mobile"
import DocItemTOCDesktop from "@theme/DocItem/TOC/Desktop"
import DocItemContent from "@theme/DocItem/Content"
import DocBreadcrumbs from "@theme/DocBreadcrumbs"
import type { Props } from "@theme/DocItem/Layout"
import Footer from "@theme/Footer"
import { SidebarContext } from "@site/src/context/sidebar"

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()

  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0

  const mobile = canRender ? <DocItemTOCMobile /> : undefined

  const desktop =
    canRender && (windowSize === "desktop" || windowSize === "ssr") ? (
      <DocItemTOCDesktop />
    ) : undefined

  return {
    hidden,
    mobile,
    desktop,
  }
}

export default function DocItemLayout({ children }: Props): JSX.Element {
  const docTOC = useDocTOC()
  const sidebarContext = useContext(SidebarContext)
  return (
    <div className="row tw-m-0">
      <div
        className={clsx(
          "col",
          "tw-my-0 tw-mx-auto tw-max-w-main-content tw-w-full tw-ml-auto lg:tw-py-0 tw-py-0 tw-px-1",
          !docTOC.hidden && "tw-w-9/12",
          !sidebarContext?.hiddenSidebarContainer && "!tw-max-w-[720px]"
        )}
      >
        <DocVersionBanner />
        <div>
          <article className={clsx("[&>*:first-child]:tw-mt-0")}>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
          <Footer />
        </div>
      </div>
      {docTOC.desktop && (
        <div className="col toc-wrapper">{docTOC.desktop}</div>
      )}
    </div>
  )
}
