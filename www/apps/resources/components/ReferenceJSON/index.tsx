"use client"

import React from "react"
import { ReferenceContent } from "docs-ui"
import type { DocPage } from "types"
import { Loading, swrFetcher } from "docs-ui"
import useSWR from "swr"
import { config } from "../../config"
import { notFound } from "next/navigation"
import { Suspense } from "react"

type ReferenceJSONProps = {
  slug: string[]
}

/**
 * Client renderer for references served as the JSON doc-model. Fetches the
 * `DocPage` from the references API and renders it with `ReferenceContent`
 * (no MDX serialization / hydration).
 */
export const ReferenceJSON = ({ slug }: ReferenceJSONProps) => {
  const { data, error, isLoading } = useSWR<
    DocPage | { error: { name: string; message: string } }
  >(`${config.basePath}/api/references/${slug.join("/")}`, swrFetcher)

  if (isLoading || !data) {
    return <Loading />
  }

  if ("error" in data || error) {
    return notFound()
  }

  return (
    <Suspense fallback={<Loading />}>
      <div className="animate animate-fadeIn">
        <ReferenceContent page={data} />
      </div>
    </Suspense>
  )
}
