import { useEffect } from "react"
import { useActivePostSectionId } from "./use-active-post-section-id"

export const useActivePostSectionChange = (
  onActivePostSectionChange: (postSectionId?: string) => void
) => {
  const activePostSectionId = useActivePostSectionId()

  useEffect(() => {
    onActivePostSectionChange(activePostSectionId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activePostSectionId])
}
