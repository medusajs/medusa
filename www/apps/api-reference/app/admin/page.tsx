import AreaProvider from "@/providers/area"
import AdminContent from "../_mdx/admin.mdx"
import Tags from "@/components/Tags"
import PageTitleProvider from "@/providers/page-title"
import { H1 } from "docs-ui"

const ReferencePage = async () => {
  return (
    <AreaProvider area={"admin"}>
      <PageTitleProvider>
        <H1 className="!h2-docs scroll-m-56 lg:pl-4" id="introduction">
          Medusa V2 Admin API Reference
        </H1>
        <AdminContent />
        <Tags />
      </PageTitleProvider>
    </AreaProvider>
  )
}

export default ReferencePage

export function generateMetadata() {
  return {
    title: `Medusa Admin API Reference`,
    description: `REST API reference for the Medusa v2 admin API, with code snippets and examples.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
