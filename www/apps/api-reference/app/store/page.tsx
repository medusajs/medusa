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
        <h1 className="!text-h2 scroll-m-56 lg:pl-4" id="introduction">
          Medusa V2 Store API Reference
        </h1>
        <DividedLayout
          mainContent={
            <Section checkActiveOnScroll={true}>
              <StoreContentV2 />
            </Section>
          }
          codeContent={
            <div className="mb-1 lg:mb-0 hidden lg:block">
              <ClientLibrariesV2 />
            </div>
          }
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
