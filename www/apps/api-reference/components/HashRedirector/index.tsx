"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { apiRefRedirects } from "@/utils/api-ref-paths"
import basePathUrl from "@/utils/base-path-url"

type HashRedirectorProps = {
  area: "store" | "admin"
}

/**
 * Redirects legacy hash-based deep links (e.g. `/api/store#carts_getcartsid`)
 * to the new page paths (e.g. `/api/store/carts/get-a-cart`).
 *
 * Hash fragments are never sent to the server, so this has to run client-side.
 * All legacy links land on the area index (`/api/[area]`), where this is
 * mounted. Hashes that aren't in the redirect map (e.g. in-section sub-anchors)
 * are left untouched so they anchor normally.
 */
const HashRedirector = ({ area }: HashRedirectorProps) => {
  const router = useRouter()

  useEffect(() => {
    const hash = window.location.hash.replace("#", "")
    if (!hash) {
      return
    }

    const target = (apiRefRedirects[area] as Record<string, string>)?.[hash]
    if (target) {
      router.replace(basePathUrl(target))
    }
  }, [area, router])

  return null
}

export default HashRedirector
