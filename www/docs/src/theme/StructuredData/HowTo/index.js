import React from "react"
import Head from '@docusaurus/Head'
import {useLocation} from '@docusaurus/router';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function StructuredDataHowTo ({ toc, title }) {
  const location = useLocation();
  const { siteConfig: { url } } = useDocusaurusContext()
  const mainUrl = `${url}/${location.pathname}`

  return (
    <Head>
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "HowTo",
          name: title,
          step: [
            toc
              .filter((item) => item.level === 2)
              .map((item) => ({
                "@type": "HowToStep",
                text: item.value,
                url: `${mainUrl}#${item.id}`
              }))
          ]
        })}
      </script>
    </Head>
  )
}