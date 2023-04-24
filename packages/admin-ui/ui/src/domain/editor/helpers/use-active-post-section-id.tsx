import { useParams } from "react-router-dom"

/**
 * A custom hook that returns the active postSectionId from the path segment.
 * We need want to detect the active post section ID outside of the post section context.
 *
 * @returns The active postSectionId from the path segment
 */
export const useActivePostSectionId = (): string | undefined => {
  const params = useParams()
  const path = params["*"] as string
  const pathSegments = path.split("/")

  // Get the active postSectionId from the path segment
  const activePostSectionId = pathSegments.find((segment) =>
    segment.startsWith("postsec_")
  )

  return activePostSectionId
}
