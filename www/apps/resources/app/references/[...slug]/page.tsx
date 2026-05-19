import { cache } from "react"
import path from "path"
import fs from "fs/promises"
import { ReferenceMDX } from "../../../components/ReferenceMDX"
import { Metadata } from "next"
import { getFrontMatterFromString } from "docs-utils"

type PageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function ReferencesPage(props: PageProps) {
  const params = await props.params
  const { slug } = params

  return <ReferenceMDX slug={slug} />
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const metadata: Metadata = {}

  const fileData = await loadReferencesFile(slug)

  if (!fileData) {
    return metadata
  }

  const pageTitleMatch = /#(?<title>[\w -]+)/.exec(fileData.content)

  if (!pageTitleMatch?.groups?.title) {
    return metadata
  }

  metadata.title = pageTitleMatch.groups.title
  const frontmatter = await getFrontMatterFromString(fileData.content)
  metadata.keywords = (frontmatter.keywords || []) as string[]

  return metadata
}

export type LoadedReferenceFile = {
  content: string
  path: string
}

const loadReferencesFile = cache(
  async (slug: string[]): Promise<LoadedReferenceFile | undefined> => {
    path.join(process.cwd(), "references")
    const monoRepoPath = path.resolve("..", "..", "..")

    const pathname = `/references/${slug.join("/")}`
    const slugChanges = (await import("@/generated/slug-changes.mjs"))
      .slugChanges
    const filesMap = (await import("@/generated/files-map.mjs")).filesMap
    const fileDetails =
      slugChanges.find((f) => f.newSlug === pathname) ||
      filesMap.find((f) => f.pathname === pathname)
    if (!fileDetails) {
      return undefined
    }
    const fullPath = path.join(monoRepoPath, fileDetails.filePath)

    const fileContent = await fs.readFile(fullPath, "utf-8")

    return {
      content: fileContent,
      path: fullPath,
    }
  }
)
