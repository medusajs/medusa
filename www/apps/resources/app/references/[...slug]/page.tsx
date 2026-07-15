import { cache } from "react"
import { ReferenceJSON } from "../../../components/ReferenceJSON"
import { Metadata } from "next"
import { workerCompatibleFetch } from "docs-utils"
import path from "path"

type PageProps = {
  params: Promise<{
    slug: string[]
  }>
}

export default async function ReferencesPage(props: PageProps) {
  const params = await props.params
  const { slug } = params

  return <ReferenceJSON slug={slug} />
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const slug = (await params).slug
  const metadata: Metadata = {}

  const content = await loadReferencesFile(slug)

  if (!content) {
    return metadata
  }

  // The DocPage carries its title / keywords directly.
  try {
    const docPage = JSON.parse(content)
    metadata.title = docPage.title
    metadata.keywords = (docPage.frontmatter?.keywords || []) as string[]
  } catch {
    // ignore malformed JSON
  }

  return metadata
}

const loadReferencesFile = cache(
  async (slug: string[]): Promise<string | undefined> => {
    const monoRepoPath = path.resolve("..", "..", "..")

    const pathname = `/references/${slug.join("/")}`
    const filesMap = (await import("@/generated/files-map.mjs")).filesMap
    const fileDetails = filesMap.find((f) => f.pathname === pathname)
    if (!fileDetails) {
      return undefined
    }

    const r2Base = process.env.NEXT_PUBLIC_REFERENCES_R2_BASE_URL
    const content = await workerCompatibleFetch<string | null>({
      url: `${r2Base}/references/${fileDetails.filePath.replace(
        /^.*\/references\//,
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

    return content ?? undefined
  }
)
