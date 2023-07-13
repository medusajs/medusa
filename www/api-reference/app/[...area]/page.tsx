import AdminDescription from "../_mdx/admin.mdx"
import StoreDescription from "../_mdx/store.mdx"
import Section from "@/components/Section"
import Tags from "@/components/Tags"

type ReferencePageProps = {
  params: {
    area: string
  }
}

const ReferencePage = async ({ params: { area } }: ReferencePageProps) => {
  return (
    <div className="mt-3">
      <Section>
        {area.includes("admin") && <AdminDescription />}
        {area.includes("store") && <StoreDescription />}
      </Section>
      <Tags area={area} />
    </div>
  )
}

export default ReferencePage
