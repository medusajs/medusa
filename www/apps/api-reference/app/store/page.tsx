import AreaProvider from "@/providers/area"
import StoreContent from "../_mdx/store.mdx"
import Tags from "@/components/Tags"
import PageTitleProvider from "@/providers/page-title"
import { H1 } from "docs-ui"
import { getBaseSpecs } from "../../lib"
import BaseSpecsProvider from "../../providers/base-specs"
import clsx from "clsx"

const StorePage = async () => {
  const data = await getBaseSpecs("store")

  return (
    <BaseSpecsProvider baseSpecs={data}>
      <AreaProvider area={"store"}>
        <PageTitleProvider>
          <H1
            className={clsx(
              "!h2-docs lg:pl-4",
              "scroll-m-[184px] lg:scroll-m-[264px]"
            )}
            id="introduction"
          >
            Medusa V2 Store API Reference
          </H1>
          <StoreContent />
          <Tags tags={data?.tags} />
        </PageTitleProvider>
      </AreaProvider>
    </BaseSpecsProvider>
  )
}

export default StorePage

export function generateMetadata() {
  return {
    title: `Medusa Store API Reference`,
    description: `REST API reference for the Medusa v2 store API, with code snippets and examples.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
