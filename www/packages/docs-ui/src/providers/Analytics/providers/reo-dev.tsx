import { useEffect } from "react"
// @ts-expect-error Doesn't have a types package
import { loadReoScript } from "reodotdev"

type UseReoDevAnalyticsProps = {
  reoDevKey: string | undefined
}

export const useReoDevAnalytics = ({ reoDevKey }: UseReoDevAnalyticsProps) => {
  useEffect(() => {
    if (!reoDevKey) {
      return
    }

    loadReoScript({
      clientID: reoDevKey,
    })
      .then((Reo: unknown) => {
        ;(Reo as { init: (config: { clientID: string }) => void }).init({
          clientID: reoDevKey,
        })
      })
      .catch((e: Error) => {
        console.error(`Could not connect to Reodotdev. Error: ${e}`)
      })
  }, [reoDevKey])
}
