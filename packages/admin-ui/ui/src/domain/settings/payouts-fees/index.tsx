import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import BreadCrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import { VendorFeesTable } from "../../../components/templates/vendor-table/vendor-fees-table"
import { useAdminUpdateStoreFees } from "../../../hooks/admin/store/store-mutation"
import { useAdminStoreFees } from "../../../hooks/admin/store/store-queries"
import { useGetVendors } from "../../../hooks/admin/vendors"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"

export interface VendorFeesForm {
  default_store_percent_fee: number
  vendors: {
    [x: string]: { percent_fee: number }
  }
}

const PayoutsFeesPage = () => {
  const updateStoreFees = useAdminUpdateStoreFees()
  const notification = useNotification()
  const { store_fees } = useAdminStoreFees()
  const { vendors, isLoading: isVendorsLoading } = useGetVendors({
    offset: 0,
    limit: 50,
    fields: "id,name,store_percent_fee",
  })

  const { register, handleSubmit, reset } = useForm<VendorFeesForm>({})

  useEffect(() => {
    if (!!store_fees && !!vendors)
      reset({
        default_store_percent_fee: store_fees.default_store_percent_fee || 0,
        vendors: {
          ...vendors?.reduce((acc, vendor) => {
            acc[vendor.id] = { percent_fee: vendor.store_percent_fee }
            return acc
          }, {}),
        },
      })
  }, [store_fees, vendors])

  const handleSaveForm = ({ default_store_percent_fee, vendors }) => {
    const fees = {
      default_store_percent_fee,
      vendors: Object.keys(vendors)
        .map((vendorId) => ({
          vendor_id: vendorId,
          percent_fee: vendors[vendorId].percent_fee,
        }))
        .filter(
          (fee) =>
            typeof fee.percent_fee === "number" && !isNaN(fee.percent_fee)
        ),
    }

    updateStoreFees.mutate(fees, {
      onSuccess: () => {
        notification("Success", `Store fees saved successfully.`, "success")
      },
      onError: (err) => notification("Error", getErrorMessage(err), "error"),
    })
  }

  return (
    <div>
      <BreadCrumb
        previousRoute="/admin/settings"
        previousBreadcrumb="Settings"
        currentPage="Payouts & Fees Settings"
      />
      <form>
        <BodyCard
          title="Payouts & Fees Settings"
          events={[
            {
              label: "Save",
              type: "submit",
              onClick: handleSubmit(handleSaveForm),
            },
          ]}
        >
          {(vendors || []).length > 0 && (
            <VendorFeesTable
              isLoading={isVendorsLoading}
              register={register}
              vendors={vendors || []}
            />
          )}
        </BodyCard>
      </form>
    </div>
  )
}

export default PayoutsFeesPage
