import AreaProvider from "@/providers/area"
import AdminDescription from "../_mdx/admin.mdx"
import StoreDescription from "../_mdx/store.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"
import type { Area } from "@/types/openapi"

type ReferencePageProps = {
  params: {
    area: Area
  }
}

const ReferencePage = async ({ params: { area } }: ReferencePageProps) => {
  return (
    <AreaProvider area={area}>
      <div className="mt-3">
        <Section>
          {area.includes("admin") && <AdminDescription />}
          {area.includes("store") && <StoreDescription />}
        </Section>
        <Tags />
      </div>
    </AreaProvider>
  )
}

export default ReferencePage
