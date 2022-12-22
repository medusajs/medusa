import { Region } from "@medusajs/medusa"
import { useAdminDeleteRegion } from "medusa-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import Tooltip from "../../../../../components/atoms/tooltip"
import EditIcon from "../../../../../components/fundamentals/icons/edit-icon"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import Section from "../../../../../components/organisms/section"
import useImperativeDialog from "../../../../../hooks/use-imperative-dialog"
import useNotification from "../../../../../hooks/use-notification"
import useToggleState from "../../../../../hooks/use-toggle-state"
import { currencies } from "../../../../../utils/currencies"
import { getErrorMessage } from "../../../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../../../utils/payment-providers-mapper"
import EditRegionModal from "./edit-region.modal"

type Props = {
  region: Region
}

const GeneralSection = ({ region }: Props) => {
  const { state, toggle, close } = useToggleState()
  const { mutate } = useAdminDeleteRegion(region.id)
  const navigate = useNavigate()
  const notification = useNotification()
  const dialog = useImperativeDialog()

  const handleDelete = async () => {
    const shouldDelete = await dialog({
      heading: "Delete Collection",
      text: "Are you sure you want to delete this collection?",
    })

    if (shouldDelete) {
      mutate(undefined, {
        onSuccess: () => {
          navigate("/a/settings/regions", {
            replace: true,
          })
          notification("Success", "Region has been deleted", "success")
          navigate(`/a/settings/regions`, { replace: true })
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      })
    }
  }

  return (
    <>
      <Section
        title={region.name}
        actions={[
          {
            label: "Edit Region Details",
            onClick: toggle,
            icon: <EditIcon size={20} className="text-grey-50" />,
          },
          {
            label: "Delete Region",
            onClick: handleDelete,
            icon: <TrashIcon size={20} />,
            variant: "danger",
          },
        ]}
      >
        <div className="flex flex-col gap-y-xsmall mt-large">
          <h2 className="inter-large-semibold">Details</h2>
          <div className="flex flex-col gap-y-xsmall">
            <RegionDetail title={"Currency"}>
              <div className="flex items-center gap-x-xsmall">
                <span className="inter-base-semibold text-grey-90">
                  {region.currency_code.toUpperCase()}
                </span>
                <span>
                  {currencies[region.currency_code.toUpperCase()].name}
                </span>
              </div>
            </RegionDetail>
            <RegionDetail title={"Countries"}>
              <div>
                {region.countries && region.countries.length ? (
                  <div className="flex items-center gap-x-xsmall">
                    <p>
                      {region.countries
                        .slice(0, 4)
                        .map((c) => c.display_name)
                        .join(", ")}
                    </p>
                    {region.countries.length > 4 && (
                      <Tooltip
                        side="right"
                        content={
                          <ul>
                            {region.countries.slice(4).map((c) => {
                              return <li key={c.id}>{c.display_name}</li>
                            })}
                          </ul>
                        }
                      >
                        <span className="cursor-default">
                          + {region.countries.length - 4} more
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <p>No countries configured</p>
                )}
              </div>
            </RegionDetail>
            <RegionDetail title={"Payment providers"}>
              <div>
                {region.payment_providers && region.payment_providers.length ? (
                  <div className="flex items-center gap-x-xsmall">
                    <p>
                      {region.payment_providers
                        .slice(0, 4)
                        .map((p) => paymentProvidersMapper(p.id).label)
                        .join(", ")}
                    </p>
                    {region.payment_providers.length > 4 && (
                      <Tooltip
                        side="right"
                        content={
                          <ul>
                            {region.payment_providers.slice(4).map((p) => {
                              return (
                                <li key={p.id}>
                                  {paymentProvidersMapper(p.id)}
                                </li>
                              )
                            })}
                          </ul>
                        }
                      >
                        <span className="cursor-default">
                          + {region.payment_providers.length - 4} more
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <p>No payment providers configured</p>
                )}
              </div>
            </RegionDetail>
            <RegionDetail title={"Fulfillment providers"}>
              <div>
                {region.payment_providers && region.payment_providers.length ? (
                  <div className="flex items-center gap-x-xsmall">
                    <p>
                      {region.fulfillment_providers
                        .slice(0, 4)
                        .map((p) => fulfillmentProvidersMapper(p.id).label)
                        .join(", ")}
                    </p>
                    {region.fulfillment_providers.length > 4 && (
                      <Tooltip
                        side="right"
                        content={
                          <ul>
                            {region.fulfillment_providers.slice(4).map((p) => {
                              return (
                                <li key={p.id}>
                                  {fulfillmentProvidersMapper(p.id)}
                                </li>
                              )
                            })}
                          </ul>
                        }
                      >
                        <span className="cursor-default">
                          + {region.fulfillment_providers.length - 4} more
                        </span>
                      </Tooltip>
                    )}
                  </div>
                ) : (
                  <p>No fulfillment providers configured</p>
                )}
              </div>
            </RegionDetail>
          </div>
        </div>
      </Section>
      <EditRegionModal region={region} onClose={close} open={state} />
    </>
  )
}

type DetailProps = {
  title: string
  children: React.ReactNode
}

const RegionDetail = ({ title, children }: DetailProps) => {
  return (
    <div className="flex items-center justify-between inter-base-regular text-grey-50">
      <p>{title}</p>
      {children}
    </div>
  )
}

export default GeneralSection
