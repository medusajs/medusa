// import { Customer, CustomerGroup } from "@medusajs/medusa"
// import { Container, Heading } from "@medusajs/ui"
// import { createColumnHelper } from "@tanstack/react-table"
// import { useMemo } from "react"
// import { useTranslation } from "react-i18next"
// import { useCustomerGroups } from "../../../../../hooks/api/customer-groups"

// // TODO: Continue working on this when there is a natural way to get customer groups related to a customer.
// type CustomerGroupSectionProps = {
//   customer: Customer
// }

// export const CustomerGroupSection = ({
//   customer,
// }: CustomerGroupSectionProps) => {
//   const { customer_groups, isLoading, isError, error } = useCustomerGroups({
//     customers: customer.id,
//   })

//   if (isError) {
//     throw error
//   }

//   return (
//     <Container className="p-0 divide-y">
//       <div className="px-6 py-4">
//         <Heading level="h2">Groups</Heading>
//       </div>
//     </Container>
//   )
// }

// const columnHelper = createColumnHelper<CustomerGroup>()

// const useColumns = () => {
//   const { t } = useTranslation()

//   return useMemo(
//     () => [
//       columnHelper.display({
//         id: "select",
//       }),
//       columnHelper.accessor("name", {
//         header: t("fields.name"),
//         cell: ({ getValue }) => getValue(),
//       }),
//     ],
//     [t]
//   )
// }
