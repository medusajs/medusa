import { Metadata } from "next"
import { apiRefPaths } from "@/utils/api-ref-paths"
import { apiRefMetadataBase, isArea } from "@/utils/area"

export const dynamic = "force-dynamic"

type OperationPageProps = {
  params: Promise<{ area: string; section: string; operation: string }>
}

// The tag (with all its operations) is rendered by the [section] layout, which
// stays mounted across tag <-> operation navigation. Scrolling to the active
// operation is handled client-side (TagOperation reacts to the active path), so
// this page only exists for the route and its metadata.
const OperationPage = () => null

export default OperationPage

export async function generateMetadata({
  params,
}: OperationPageProps): Promise<Metadata> {
  const { area, section, operation } = await params
  if (!isArea(area)) {
    return {}
  }

  const tagEntry = apiRefPaths[area]?.tags?.[section]
  const operationEntry = tagEntry
    ? Object.values(tagEntry.operations).find((op) => op.slug === operation)
    : undefined
  const title = operationEntry?.title

  return {
    title: title ? `${title} - Medusa ${area} API Reference` : undefined,
    metadataBase: apiRefMetadataBase,
  }
}
