import { cache } from "react"
import { ReferenceMDX } from "../../../components/ReferenceMDX"
import { ReferenceJSON } from "../../../components/ReferenceJSON"
import { Metadata } from "next"
import { getFrontMatterFromString, workerCompatibleFetch } from "docs-utils"
import path from "path"

type PageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function ReferencesPage(props: PageProps) {
  const params = await props.params
  const { slug } = params

  const fileDetails = await getReferenceFileDetails(slug)

  if (fileDetails?.format === "json") {
    return <ReferenceJSON slug={slug} />
  }

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

  // JSON doc-model pages carry title / keywords in the DocPage itself.
  if (fileData.format === "json") {
    try {
      const docPage = JSON.parse(fileData.content)
      metadata.title = docPage.title
      metadata.keywords = (docPage.frontmatter?.keywords || []) as string[]
    } catch {
      // ignore malformed JSON
    }
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

type ReferenceFileDetails = {
  filePath: string
  pathname: string
  format?: string
}

const getReferenceFileDetails = cache(
  async (slug: string[]): Promise<ReferenceFileDetails | undefined> => {
    const pathname = `/references/${slug.join("/")}`
    const slugChanges = (await import("@/generated/slug-changes.mjs"))
      .slugChanges
    const filesMap = (await import("@/generated/files-map.mjs")).filesMap
    return (filesMap.find(
      (f) =>
        (f as { format?: string }).format === "json" && f.pathname === pathname
    ) ||
      slugChanges.find((f) => f.newSlug === pathname) ||
      filesMap.find((f) => f.pathname === pathname)) as
      | ReferenceFileDetails
      | undefined
  }
)

export type LoadedReferenceFile = {
  content: string
  format?: string
}

const loadReferencesFile = cache(
  async (slug: string[]): Promise<LoadedReferenceFile | undefined> => {
    const monoRepoPath = path.resolve("..", "..", "..")

    const fileDetails = await getReferenceFileDetails(slug)
    if (!fileDetails) {
      return undefined
    }

    const dir = fileDetails.format === "json" ? "references-json" : "references"
    const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
    const fileContent = await workerCompatibleFetch<string | null>({
      url: `${r2Base}/${dir}/${fileDetails.filePath.replace(
        new RegExp(`^.*/${dir}/`),
        ""
      )}`,
      responseTransformer: async (res) => {
        return res.ok ? res.text() : null
      },
      fallbackAction: async () => {
        try {
          const { promises: fs } = await import("fs")
          const fullPath = path.join(monoRepoPath, fileDetails.filePath)
          return await fs.readFile(fullPath, "utf-8")
        } catch {
          return null
        }
      },
      useRemote: !!r2Base,
    })

    if (!fileContent) {
      return undefined
    }

    return {
      content: fileContent,
      format: fileDetails.format,
    }
  }
)
