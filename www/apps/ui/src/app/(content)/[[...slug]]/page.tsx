import { Text } from "@medusajs/ui"
import { allDocs } from "contentlayer/generated"
import { notFound } from "next/navigation"

import { Mdx } from "@/components/mdx-components"
import { siteConfig } from "@/config/site"
import { Metadata } from "next"

interface DocPageProps {
  params: {
    slug: string[]
  }
}

async function getDocFromParams({ params }: DocPageProps) {
  const slug = params.slug?.join("/") || ""

  const doc = allDocs.find((doc) => doc.slugAsParams === slug)

  if (!doc) {
    null
  }

  return doc
}

export async function generateMetadata({
  params,
}: DocPageProps): Promise<Metadata> {
  const doc = await getDocFromParams({ params })

  if (!doc) {
    return {}
  }

  const title = `${doc.title} - ${siteConfig.name}`

  return {
    title: title,
    description: doc.description,
    metadataBase: new URL(
      process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
    ),
  }
}

export async function generateStaticParams(): Promise<
  DocPageProps["params"][]
> {
  return allDocs.map((doc) => ({
    slug: doc.slugAsParams.split("/"),
  }))
}

export default async function DocPage({ params }: DocPageProps) {
  const doc = await getDocFromParams({ params })

  if (!doc) {
    notFound()
  }

  return (
    <div className="flex flex-col">
      <h1 className="h1-docs text-medusa-fg-base mb-2">{doc.title}</h1>
      <Text className="text-medusa-fg-subtle mb-6" size="large">
        {doc.description}
      </Text>
      <div>
        <Mdx code={doc.body.code} />
      </div>
    </div>
  )
}
