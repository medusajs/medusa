/* eslint-disable @typescript-eslint/ban-ts-comment */
import React from "react"
import AreaProvider from "@/providers/area"
import StoreContent from "@/markdown/store.mdx"
import AdminContent from "@/markdown/admin.mdx"
import Tags from "@/components/Tags"
import PageTitleProvider from "@/providers/page-title"
import { getBaseSpecs } from "../../../lib"
import BaseSpecsProvider from "../../../providers/base-specs"
import ScrollToSection from "@/components/ScrollToSection"
import { notFound } from "next/navigation"
import { getIntroSection, getTagBySlug, isArea } from "@/utils/area"

export const dynamic = "force-dynamic"

type SectionLayoutProps = {
  children: React.ReactNode
  params: Promise<{ area: string; section: string }>
}

/**
 * Renders the section content (an intro section or a tag with all its
 * operations) as a layout so that navigating between a tag and its operation
 * pages only swaps the (empty) page segment — the tag content stays mounted and
 * the browser just scrolls, instead of reloading the whole tag.
 */
const SectionLayout = async ({ children, params }: SectionLayoutProps) => {
  const { area, section } = await params
  if (!isArea(area)) {
    notFound()
  }

  const data = await getBaseSpecs(area)
  const introSection = getIntroSection(area, section)
  const tag = introSection ? undefined : getTagBySlug(data, section)

  if (!introSection && !tag) {
    notFound()
  }

  const Content = area === "store" ? StoreContent : AdminContent

  return (
    <BaseSpecsProvider baseSpecs={data}>
      <AreaProvider area={area}>
        <PageTitleProvider>
          {introSection ? (
            <>
              <ScrollToSection slug={introSection.slug} />
              {/* @ts-ignore React v19 doesn't see MDX as valid component */}
              <Content />
            </>
          ) : (
            <Tags tags={tag ? [tag] : []} />
          )}
          {children}
        </PageTitleProvider>
      </AreaProvider>
    </BaseSpecsProvider>
  )
}

export default SectionLayout
