import { toast } from "@medusajs/ui"
import { useQuery } from "@tanstack/react-query"
import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { AdminCloudHintListResponse } from "../../types"
import { getHintForPath, HINT_DELAY_MS } from "../lib/hints"
import { sdk } from "../lib/sdk"
import {
  addShownHintId,
  getLastToastAt,
  getShownHintIds,
  setLastToastAt,
} from "../lib/storage"

export const cloudHintsQueryKey = ["cloud", "hints"]

export const useCloudHints = () => {
  const { pathname } = useLocation()
  const { data } = useQuery({
    queryKey: cloudHintsQueryKey,
    queryFn: async () =>
      sdk.client.fetch<AdminCloudHintListResponse>("/admin/cloud/hints"),
    staleTime: 10 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  })
  const hints = data?.hints

  useEffect(() => {
    if (!hints?.length) {
      return
    }

    const timeout = setTimeout(() => {
      const hint = getHintForPath(pathname, hints, {
        shownIds: getShownHintIds(),
        lastToastAt: getLastToastAt(),
      })

      if (!hint) {
        return
      }

      addShownHintId(hint.id)
      setLastToastAt(Date.now())
      toast.info(hint.title, {
        description: hint.description ?? undefined,
        duration: 15000,
        dismissable: true,
        action: hint.link_url
          ? {
              label: "Learn more",
              altText: `Learn more about: ${hint.title}`,
              onClick: () => {
                window.open(hint.link_url!, "_blank", "noopener,noreferrer")
              },
            }
          : undefined,
      })
    }, HINT_DELAY_MS)

    return () => clearTimeout(timeout)
  }, [pathname, hints])
}
