import React from "react"
import slugify from "slugify"
import { Badge, H2, Hr, MDXComponents, MarkdownContent } from "docs-ui"

type Changelog = {
  id: string
  title: string
  description: string
  image_url?: string
  publish_date: string
}

const Img = MDXComponents.img

export default async function ChangelogPage() {
  if (
    process.env.NEXT_PUBLIC_ENV === "CI" ||
    process.env.NEXT_PUBLIC_VERCEL_ENV === "preview"
  ) {
    return (
      <div>
        Changelog page is not available in the CI / Preview environment.
      </div>
    )
  }

  const changelogs = await loadChangelogData()

  return (
    <>
      {changelogs.map((changelog, index) => {
        const displayDate = new Date(changelog.publish_date).toLocaleDateString(
          undefined,
          {
            year: "numeric",
            month: "long",
            day: "numeric",
          }
        )
        return (
          <React.Fragment key={changelog.id}>
            <section className="flex md:flex-row md:gap-1.5">
              <h2
                id={slugify(displayDate, { lower: true })}
                className="shrink-0"
              >
                <Badge variant="purple">{displayDate}</Badge>
              </h2>
              <div className="flex flex-col">
                <H2 className="!mt-0">{changelog.title}</H2>
                {changelog.image_url && (
                  // @ts-expect-error this is a React component
                  <Img
                    src={changelog.image_url}
                    alt={changelog.title}
                    className="mb-1"
                  />
                )}
                <MarkdownContent>{changelog.description}</MarkdownContent>
              </div>
            </section>
            {index !== changelogs.length - 1 && <Hr />}
          </React.Fragment>
        )
      })}
    </>
  )
}

const loadChangelogData = async (): Promise<Changelog[]> => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BLOOM_API_URL}/v1/changelogs?order=-publish_date&limit=50`,
    {
      next: {
        revalidate: 3600, // Revalidate every hour
        tags: ["changelog"],
      },
    }
  )

  if (!response.ok) {
    throw new Error("Failed to fetch changelog data")
  }

  const data = await response.json()

  return data.changelogs
}
