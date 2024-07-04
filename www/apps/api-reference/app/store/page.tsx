import AreaProvider from "@/providers/area"
import StoreContentV2 from "../_mdx/store.mdx"
import ClientLibrariesV2 from "../_mdx/client-libraries.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"
import DividedLayout from "@/layouts/Divided"
import PageTitleProvider from "@/providers/page-title"

const ReferencePage = async () => {
  return (
    <AreaProvider area={"store"}>
      <PageTitleProvider>
        <h1 className="!text-h2 block lg:hidden">
          Medusa V2 Store API Reference
        </h1>
        <DividedLayout
          mainContent={
            <Section>
              <h1 className="!text-h2 hidden lg:block">
                Medusa V2 Store API Reference
              </h1>
              <StoreContentV2 />
            </Section>
          }
          codeContent={<ClientLibrariesV2 />}
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
    title: `Medusa Store API Reference`,
    description: `REST API reference for the Medusa store API. This reference includes code snippets and examples for Medusa JS Client and cURL.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}
