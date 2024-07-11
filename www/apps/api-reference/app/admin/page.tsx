import AreaProvider from "@/providers/area"
import AdminContentV2 from "../_mdx/admin.mdx"
import ClientLibrariesV2 from "../_mdx/client-libraries.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"
import DividedLayout from "@/layouts/Divided"
import PageTitleProvider from "@/providers/page-title"

const ReferencePage = async () => {
  return (
    <AreaProvider area={"admin"}>
      <PageTitleProvider>
        <h1 className="!text-h2 block lg:hidden">
          Medusa V2 Admin API Reference
        </h1>
        <DividedLayout
          mainContent={
            <Section>
              <h1 className="!text-h2 hidden lg:block">
                Medusa V2 Admin API Reference
              </h1>
              <AdminContentV2 />
            </Section>
          }
          codeContent={
            <div className="mb-1 lg:mb-0">
              <ClientLibrariesV2 />
            </div>
          }
          className="flex-col-reverse"
        />
        <Tags />
      </PageTitleProvider>
    </AreaProvider>
  )
}

export default ReferencePage

export function generateMetadata() {
  return {
    title: `Medusa Admin API Reference`,
    description: `REST API reference for the Medusa admin API. This reference includes code snippets and examples for Medusa JS Client and cURL.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
