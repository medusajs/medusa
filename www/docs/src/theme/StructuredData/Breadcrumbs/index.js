import React from 'react';
import Head from '@docusaurus/Head';
import { useSidebarBreadcrumbs } from '@docusaurus/theme-common/internal'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function StructuredDataBreadcrumbs () {
  const breadcrumbs = useSidebarBreadcrumbs()
  const { siteConfig: { url } } = useDocusaurusContext()

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": breadcrumbs?.map((breadcrumb, index) => {
            if (!breadcrumb.href && breadcrumb.items?.length) {
              //get the link from child items
              breadcrumb.href = (breadcrumb.items.find((item) => item.href?.length > 0))?.href
            }

            return {
              "@type": "ListItem",
              "position": index + 1,
              "name": breadcrumb.label,
              "item": `${url}/${breadcrumb.href}`
            }
          })
        })}
      </script>
    </Head>
  )
}