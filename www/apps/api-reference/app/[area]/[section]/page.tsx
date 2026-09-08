import { Metadata } from "next"
import { getBaseSpecs } from "../../../lib"
import {
  apiRefMetadataBase,
  getIntroSection,
  getTagBySlug,
  isArea,
} from "@/utils/area"

export const dynamic = "force-dynamic"

type SectionPageProps = {
  params: Promise<{ area: string; section: string }>
}

// The section content (intro section or tag) is rendered by the layout so that
// tag <-> operation navigation only swaps this page segment. This page exists
// for the route and its metadata.
const SectionPage = () => null

export default SectionPage

export async function generateMetadata({
  params,
}: SectionPageProps): Promise<Metadata> {
  const { area, section } = await params
  if (!isArea(area)) {
    return {}
  }

  const introSection = getIntroSection(area, section)
  const data = await getBaseSpecs(area)
  const tag = introSection ? undefined : getTagBySlug(data, section)
  const title = introSection?.title || tag?.name

  return {
    title: title ? `${title} - Medusa ${area} API Reference` : undefined,
    metadataBase: apiRefMetadataBase,
  }
}
