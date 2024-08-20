import { useMemo } from "react"

type UseIsExternalLinkProps = {
  href?: string
}

export const useIsExternalLink = ({ href }: UseIsExternalLinkProps) => {
  const isExternal = useMemo(() => {
    return (
      href &&
      !href.startsWith("/") &&
      !href.startsWith("https://docs.medusajs.com") &&
      !href.startsWith("http://localhost:") &&
      !href.startsWith("#")
    )
  }, [href])

  return isExternal
}
