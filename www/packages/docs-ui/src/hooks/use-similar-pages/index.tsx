"use client"

import { usePathname } from "next/navigation"
import { useSearch } from "../../providers/Search"
import { useEffect, useState } from "react"
import { HitType } from "../../components"

type SimilarPage = {
  id: string
  title: string
  url: string
}

export const useSimilarPages = () => {
  const pathname = usePathname()
  const { searchClient, selectedIndex } = useSearch()
  const [similarPages, setSimilarPages] = useState<SimilarPage[]>([])

  useEffect(() => {
    void searchClient
      .search<HitType>({
        requests: [
          {
            query: pathname.split("/").join(" ").trim(),
            indexName: selectedIndex,
            hitsPerPage: 3,
            distinct: true,
          },
        ],
      })
      .then(({ results }) => {
        const hits = "hits" in results[0] ? results[0].hits : []
        const pages = hits.map((hit) => ({
          id: hit.objectID,
          title: hit.hierarchy.lvl1 || hit.hierarchy.lvl0 || "Untitled",
          url: hit.url,
        }))
        setSimilarPages(pages)
      })
      .catch(() => {
        setSimilarPages([])
      })
  }, [pathname, searchClient])

  return similarPages
}
