import AreaProvider from "@/providers/area"
import AdminContentV1 from "../../_mdx/v1/admin.mdx"
import StoreContentV1 from "../../_mdx/v1/store.mdx"
import ClientLibrariesV1 from "../../_mdx/v1/client-libraries.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"
import type { Area } from "@/types/openapi"
import DividedLayout from "@/layouts/Divided"
import { capitalize } from "docs-ui"
import PageTitleProvider from "../../../providers/page-title"
import PageHeading from "../../../components/PageHeading"

type ReferencePageProps = {
  params: {
    area: Area
  }
}

const ReferencePage = async ({ params: { area } }: ReferencePageProps) => {
  return (
    <AreaProvider area={area}>
      <PageTitleProvider>
        <PageHeading className="!text-h2 block lg:hidden" />
        <DividedLayout
          mainContent={
            <Section>
              <PageHeading className="!text-h2 hidden lg:block" />
              {area.includes("admin") && <AdminContentV1 />}
              {area.includes("store") && <StoreContentV1 />}
            </Section>
          }
          codeContent={<ClientLibrariesV1 />}
          className="flex-col-reverse"
        />
        <Tags />
      </PageTitleProvider>
    </AreaProvider>
  )
}

export default ReferencePage

export function generateMetadata({ params: { area } }: ReferencePageProps) {
  return {
    title: `Medusa ${capitalize(area)} API Reference`,
    description: `REST API reference for the Medusa ${area} API. This reference includes code snippets and examples for Medusa JS Client and cURL.`,
    metadataBase: process.env.NEXT_PUBLIC_BASE_URL,
  }
}

export const dynamicParams = false

export async function generateStaticParams() {
  return [
    {
      area: "admin",
    },
    {
      area: "store",
    },
  ]
}
