import AreaProvider from "@/providers/area"
import AdminDescription from "../_mdx/admin.mdx"
import StoreDescription from "../_mdx/store.mdx"
import ClientLibraries from "../_mdx/client-libraries.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"
import type { Area } from "@/types/openapi"
import DividedLayout from "@/layouts/Divided"

type ReferencePageProps = {
  params: {
    area: Area
  }
}

const ReferencePage = async ({ params: { area } }: ReferencePageProps) => {
  return (
    <AreaProvider area={area}>
      <div className="mt-3">
        <DividedLayout
          mainContent={
            <Section>
              {area.includes("admin") && <AdminDescription />}
              {area.includes("store") && <StoreDescription />}
            </Section>
          }
          codeContent={<ClientLibraries />}
        />
        <Tags />
      </div>
    </AreaProvider>
  )
}

export default ReferencePage
