import { RegionDTO, StockLocationDTO } from "@medusajs/types"
import { Container, Heading, toast, usePrompt } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useNavigate } from "react-router-dom"
import { ActionMenu } from "../../../../../components/common/action-menu"

type LocationGeneralSectionProps = {
  location: StockLocationDTO
}

export const LocationGeneralSection = ({
  location,
}: LocationGeneralSectionProps) => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{location.name}</Heading>
        {/*<Actions region={region} />*/}
      </div>
    </Container>
  )
}

// const Actions = ({ region }: { region: RegionDTO }) => {
//   const navigate = useNavigate()
//   const { t } = useTranslation()
//   const { mutateAsync } = useDeleteRegion(region.id)
//   const prompt = usePrompt()
//
//   const handleDelete = async () => {
//     const res = await prompt({
//       title: t("general.areYouSure"),
//       description: t("regions.deleteRegionWarning", {
//         name: region.name,
//       }),
//       verificationText: region.name,
//       verificationInstruction: t("general.typeToConfirm"),
//       confirmText: t("actions.delete"),
//       cancelText: t("actions.cancel"),
//     })
//
//     if (!res) {
//       return
//     }
//
//     try {
//       await mutateAsync(undefined)
//       toast.success(t("general.success"), {
//         description: t("regions.toast.delete"),
//         dismissLabel: t("actions.close"),
//       })
//     } catch (e) {
//       toast.error(t("general.error"), {
//         description: e.message,
//         dismissLabel: t("actions.close"),
//       })
//     }
//     navigate("/settings/regions", { replace: true })
//   }
//
//   return (
//     <ActionMenu
//       groups={[
//         {
//           actions: [
//             {
//               icon: <PencilSquare />,
//               label: t("actions.edit"),
//               to: `/settings/regions/${region.id}/edit`,
//             },
//           ],
//         },
//         {
//           actions: [
//             {
//               icon: <Trash />,
//               label: t("actions.delete"),
//               onClick: handleDelete,
//             },
//           ],
//         },
//       ]}
//     />
//   )
// }
