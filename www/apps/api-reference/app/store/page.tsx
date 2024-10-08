import AreaProvider from "@/providers/area"
import StoreContent from "../_mdx/store.mdx"
import Tags from "@/components/Tags"
import PageTitleProvider from "@/providers/page-title"
import { H1 } from "docs-ui"

const ReferencePage = async () => {
  return (
    <AreaProvider area={"store"}>
      <PageTitleProvider>
        <H1 className="!h2-docs scroll-m-56 lg:pl-4" id="introduction">
          Medusa V2 Store API Reference
        </H1>
        <StoreContent />
        <Tags />
      </PageTitleProvider>
    </AreaProvider>
  )
}

export default ReferencePage

export function generateMetadata() {
  return {
    title: `Medusa Store API Reference`,
    description: `REST API reference for the Medusa v2 store API, with code snippets and examples.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
