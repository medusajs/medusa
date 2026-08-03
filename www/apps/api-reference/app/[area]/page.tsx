/* eslint-disable @typescript-eslint/ban-ts-comment */
import AreaProvider from "@/providers/area"
import StoreContent from "@/markdown/store.mdx"
import AdminContent from "@/markdown/admin.mdx"
import PageTitleProvider from "@/providers/page-title"
import { getBaseSpecs } from "../../lib"
import BaseSpecsProvider from "../../providers/base-specs"
import HashRedirector from "@/components/HashRedirector"
import ScrollToTop from "@/components/ScrollToTop"
import { notFound } from "next/navigation"
import { Metadata } from "next"
import { apiRefMetadataBase, isArea } from "@/utils/area"

export const dynamic = "force-dynamic"

type AreaPageProps = {
  params: Promise<{ area: string }>
}

const AreaPage = async ({ params }: AreaPageProps) => {
  const { area } = await params
  if (!isArea(area)) {
    notFound()
  }

  const data = await getBaseSpecs(area)
  const Content = area === "store" ? StoreContent : AdminContent

  return (
    <BaseSpecsProvider baseSpecs={data}>
      <AreaProvider area={area}>
        <PageTitleProvider>
          <HashRedirector area={area} />
          <ScrollToTop />
          {/* @ts-ignore React v19 doesn't see MDX as valid component */}
          <Content />
        </PageTitleProvider>
      </AreaProvider>
    </BaseSpecsProvider>
  )
}

export default AreaPage

export async function generateMetadata({
  params,
}: AreaPageProps): Promise<Metadata> {
  const { area } = await params
  const title =
    area === "admin"
      ? "Medusa Admin API Reference"
      : "Medusa Store API Reference"

  return {
    title,
    description: `REST API reference for the Medusa v2 ${area} API, with code snippets and examples.`,
    metadataBase: apiRefMetadataBase,
  }
}
