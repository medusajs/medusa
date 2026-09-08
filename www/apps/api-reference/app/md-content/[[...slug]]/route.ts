import { addExtraToMd } from "docs-utils"
import { unstable_cache } from "next/cache"
import { notFound } from "next/navigation"
import { NextRequest, NextResponse } from "next/server"
import { PostHog } from "posthog-node"
import type { OpenAPI } from "types"
import { getBaseSpecs } from "@/lib"
import getPathsOfTag from "@/utils/get-paths-of-tag"
import getSchemaContent from "@/utils/get-schema-content"
import { getPathForEnv } from "@/utils/get-path-for-env"
import { getIntroSection, getTagBySlug, isArea } from "@/utils/area"
import introToMarkdown from "@/utils/markdown/intro-to-markdown"
import tagToMarkdown from "@/utils/markdown/tag-to-markdown"
import operationToMarkdown from "@/utils/markdown/operation-to-markdown"
import schemaSectionToMarkdown from "@/utils/markdown/schema-section-to-markdown"
import { MarkdownContext } from "@/utils/markdown/shared"

export const dynamic = "force-dynamic"

type Params = {
  params: Promise<{ slug?: string[] }>
}

const HTTP_METHODS: OpenAPI.OpenAPIV3.HttpMethods[] = [
  "get",
  "post",
  "put",
  "patch",
  "delete",
  "head",
  "options",
] as OpenAPI.OpenAPIV3.HttpMethods[]

const SCHEMA_SEGMENT = "schema"

/** Resolve a tag's associated schema (`$ref`) to a dereferenced schema object. */
async function fetchAssociatedSchema(
  ref: string,
  area: OpenAPI.Area
): Promise<OpenAPI.SchemaObject | null> {
  const name = ref
    .replace("#/components/schemas/", "")
    .replaceAll("./components/schemas/", "")

  const r2Base = process.env.SPECS_R2_BASE_URL
  const baseSchemasUrl = getPathForEnv(
    r2Base || process.cwd(),
    "specs",
    area,
    "components",
    "schemas"
  )
  const schemaUrl = getPathForEnv(baseSchemasUrl, name)

  try {
    const { dereferencedDocument, originalSchema } = await getSchemaContent(
      schemaUrl,
      baseSchemasUrl
    )
    return (
      (dereferencedDocument.components?.schemas
        ? (Object.values(
            dereferencedDocument.components.schemas
          )[0] as OpenAPI.SchemaObject)
        : originalSchema) || null
    )
  } catch {
    return null
  }
}

/** Build the Markdown for the requested path, or null when not found. */
async function resolveMarkdown_(
  slug: string[],
  ctx: MarkdownContext
): Promise<string | null> {
  const { area } = ctx

  // /{area}
  if (slug.length === 1) {
    return introToMarkdown(area)
  }

  const [, section] = slug

  // /{area}/{section-or-tag}
  if (slug.length === 2) {
    if (getIntroSection(area, section)) {
      return introToMarkdown(area, section)
    }

    const baseSpecs = await getBaseSpecs(area)
    const tag = getTagBySlug(baseSpecs, section)
    if (!tag) {
      return null
    }
    const doc = await getPathsOfTag(section, area)
    return tagToMarkdown(tag, doc.paths, ctx)
  }

  // /{area}/{tag}/{operation-or-schema}
  if (slug.length === 3) {
    const [, tagSlug, last] = slug

    if (last === SCHEMA_SEGMENT) {
      const baseSpecs = await getBaseSpecs(area)
      const tag = getTagBySlug(baseSpecs, tagSlug) as
        | OpenAPI.TagObject
        | undefined
      const ref = tag?.["x-associatedSchema"]?.$ref
      if (!tag || !ref) {
        return null
      }
      const schema = await fetchAssociatedSchema(ref, area)
      return schema ? schemaSectionToMarkdown(schema, tag.name, ctx) : null
    }

    const [baseSpecs, doc] = await Promise.all([
      getBaseSpecs(area),
      getPathsOfTag(tagSlug, area),
    ])
    for (const [endpointPath, pathItem] of Object.entries(doc.paths)) {
      for (const method of HTTP_METHODS) {
        const operation = pathItem?.[method]
        if (operation && operation["x-slug"] === last) {
          return operationToMarkdown(operation, {
            ...ctx,
            endpointPath,
            method,
            baseSpecs,
          })
        }
      }
    }
    return null
  }

  return null
}

// The inner spec fetches are already individually cached; this
// additionally memoizes the conversion output (including the intro's `getCleanMd`
// pipeline) so repeat requests skip regeneration.
const resolveMarkdown = unstable_cache(
  async (slug: string[], ctx: MarkdownContext) => resolveMarkdown_(slug, ctx),
  ["api-ref-md-content"],
  {
    revalidate: 3600,
  }
)

async function captureAgentRequest(req: NextRequest) {
  const client = new PostHog(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  })

  const urlObj = new URL(req.url)
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || ""}${process.env.NEXT_PUBLIC_BASE_PATH || ""}${urlObj.pathname}`

  client.capture({
    distinctId: "anonymous",
    event: "md_content_requested_agents",
    properties: {
      $current_url: url,
      $raw_user_agent: req.headers.get("user-agent") || undefined,
      $ip:
        req.headers.get("cf-connecting-ip") ||
        req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        undefined,
    },
  })

  await client.shutdown()
}

export async function GET(req: NextRequest, { params }: Params) {
  const { slug: rawSlug } = await params
  const slug = rawSlug?.filter(Boolean) ?? []

  if (slug.length === 0 || !isArea(slug[0])) {
    return notFound()
  }

  const ctx: MarkdownContext = {
    area: slug[0] as OpenAPI.Area,
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL || new URL(req.url).origin,
    basePath: process.env.NEXT_PUBLIC_BASE_PATH || "/api",
  }

  const markdown = await resolveMarkdown(slug, ctx)
  if (!markdown) {
    return notFound()
  }

  const acceptHeader = req.headers.get("accept") || ""
  if (
    acceptHeader.includes("text/plain") ||
    acceptHeader.includes("text/markdown")
  ) {
    await captureAgentRequest(req)
  }

  return new NextResponse(
    addExtraToMd(markdown, {
      baseUrl: process.env.NEXT_PUBLIC_BASE_URL || "",
      basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
    }),
    {
      headers: {
        "Content-Type": "text/markdown",
        "Cache-Control": "public, max-age=3600, must-revalidate",
      },
      status: 200,
    }
  )
}
