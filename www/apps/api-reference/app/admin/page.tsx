import AreaProvider from "@/providers/area"
import AdminContent from "../_mdx/admin.mdx"
import Tags from "@/components/Tags"
import PageTitleProvider from "@/providers/page-title"
import { H1 } from "docs-ui"
import { getBaseSpecs } from "../../lib"
import BaseSpecsProvider from "../../providers/base-specs"
import clsx from "clsx"

const AdminPage = async () => {
  const data = await getBaseSpecs("admin")

  return (
    <BaseSpecsProvider baseSpecs={data}>
      <AreaProvider area={"admin"}>
        <PageTitleProvider>
          <H1
            className={clsx(
              "!h2-docs lg:pl-4",
              "scroll-m-[184px] lg:scroll-m-[264px]"
            )}
            id="introduction"
          >
            Medusa V2 Admin API Reference
          </H1>
          <AdminContent />
          <Tags tags={data?.tags} />
        </PageTitleProvider>
      </AreaProvider>
    </BaseSpecsProvider>
  )
}

export default AdminPage

export function generateMetadata() {
  return {
    title: `Medusa Admin API Reference`,
    description: `REST API reference for the Medusa v2 admin API, with code snippets and examples.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
