import { CustomerGroup } from "@medusajs/medusa"
import { useForm } from "react-hook-form"
import { CustomerGroupsFormType } from "../../forms/customer-groups/customer-groups-form"
import Section from "../section"

type CustomerGroupsGeneralSectionProps = {
  customerGroup: CustomerGroup
}

type CustomerGroupsGeneralSectionFormType = {
  general: CustomerGroupsFormType
}

const CustomerGroupsGeneralSection = ({
  customerGroup,
}: CustomerGroupsGeneralSectionProps) => {
  const form = useForm<CustomerGroupsGeneralSectionFormType>({})

  return <Section title={customerGroup.name}></Section>
}

export default CustomerGroupsGeneralSection
