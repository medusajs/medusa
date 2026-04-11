"use client"

import React, { useEffect, useState } from "react"
import type { TechArticle } from "schema-dts"
import { getJsonLd } from "../../utils"
import { usePathname } from "next/navigation"
import { useSiteConfig } from "../../providers/SiteConfig"
import { useIsBrowser } from "../../providers/BrowserProvider"

export const TechArticleJsonLd = () => {
  const {
    config: { baseUrl, basePath, description: configDescription, titleSuffix },
    frontmatter,
  } = useSiteConfig()
  const pathname = usePathname()
  const { isBrowser } = useIsBrowser()
  const [jsonLdData, setJsonLdData] = useState("{}")

  useEffect(() => {
    if (!isBrowser) {
      return
    }

    const updateJsonLd = () => {
      const baseLink = `${baseUrl}${basePath}`.replace(/\/+$/, "")
      const title = document.title.replace(` - ${titleSuffix}`, "")
      const description =
        document.querySelector("#main p")?.textContent ||
        configDescription ||
        ""

      const data = getJsonLd<TechArticle>({
        "@context": "https://schema.org",
        "@type": "TechArticle",
        headline: title,
        description,
        proficiencyLevel: "Expert",
        author: "Medusa",
        genre: "Documentation",
        keywords:
          frontmatter.keywords?.join(", ") || "medusa, ecommerce, open-source",
        url: `${baseLink}${pathname}`,
      })

      setJsonLdData(data)
    }

    // Update immediately
    updateJsonLd()

    // Also set up a MutationObserver to watch for title changes
    const titleObserver = new MutationObserver(() => {
      updateJsonLd()
    })

    const titleElement = document.querySelector("title")
    if (titleElement) {
      titleObserver.observe(titleElement, {
        childList: true,
        characterData: true,
        subtree: true,
      })
    }

    return () => {
      titleObserver.disconnect()
    }
  }, [isBrowser, pathname, baseUrl, basePath, configDescription, titleSuffix])

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdData }}
    />
  )
}
