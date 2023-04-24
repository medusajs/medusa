import { useEffect, useState } from "react"
import { Vendor } from "@medusajs/medusa"
import { FormProvider, useForm } from "react-hook-form"
import Medusa from "../../../services/api"
import FileUploadField from "../../../components/atoms/file-upload-field"
import Button from "../../../components/fundamentals/button"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import IconTooltip from "../../../components/molecules/icon-tooltip"
import Input from "../../../components/molecules/input"
import Textarea from "../../../components/molecules/textarea"
import BodyCard from "../../../components/organisms/body-card"
import { useAdminUpdateVendor } from "../../../hooks/admin/vendors/mutations"
import { clearVendorsCache } from "../../../hooks/admin/vendors/queries"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Spinner from "../../../components/atoms/spinner"

interface LogoFile {
  url?: string
  name?: string
  size?: number
  file?: File
}

const VendorDetails = ({ vendor }: { vendor: Vendor }) => {
  const formMethods = useForm()
  const updateVendor = useAdminUpdateVendor(vendor.id)
  const notification = useNotification()
  const initialLogo = vendor.logo ? { url: vendor.logo.url } : undefined
  const [logo, setLogo] = useState<LogoFile | null | undefined>(initialLogo)

  if (!vendor) {
    return <Spinner size="large" variant="secondary" />
  }

  const defaultValues = {
    id: vendor.id,
    name: vendor.name,
    handle: vendor.handle,
    description: vendor.description,
    email: vendor.email,
    logo: vendor.logo,
    return_policy: vendor.return_policy,
    location: vendor.location,
  }

  useEffect(() => {
    formMethods.reset(defaultValues)
    setLogo(initialLogo)
  }, [vendor, formMethods.reset])

  const handleCancel = () => {
    formMethods.reset(defaultValues)
    setLogo(initialLogo)
  }

  const onSubmit = async (data) => {
    let uploadedImg
    const fileToUpload =
      logo && logo.url && logo.url.startsWith("blob:") ? logo.file : null

    if (fileToUpload) {
      uploadedImg = await Medusa.uploads
        .create([fileToUpload])
        .then(({ data }) => {
          return data.uploads[0]
        })
        .catch((err) => {
          notification("Error uploading images", getErrorMessage(err), "error")
          return
        })
    }

    const newData = {
      id: vendor.id,
      ...data,
      logo: uploadedImg?.url || logo?.url || null,
    }

    updateVendor.mutate(newData, {
      onSuccess: () => {
        clearVendorsCache()
        notification("Success", "Successfully updated vendor", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <FormProvider {...formMethods}>
      <BodyCard
        events={[
          {
            label: "Save",
            type: "button",
            onClick: formMethods.handleSubmit(onSubmit),
          },
          { label: "Cancel Changes", type: "button", onClick: handleCancel },
        ]}
        title="Vendor Details"
        subtitle="Manage your business details"
      >
        <h6 className="inter-base-semibold mt-0 mb-base">General</h6>
        <div className="grid-cols-2 grid gap-x-8 gap-y-4">
          <div>
            <Input
              label="Vendor Name"
              placeholder="Enter your vendor name"
              required
              {...formMethods.register("name", {
                required: "Please enter your vendor name.",
              })}
            />
          </div>

          <div>
            <Input
              label="Handle"
              placeholder="vendor-name"
              required
              prefix="/"
              tooltip={
                <IconTooltip content="URL slug for the vendor. Will be auto generated if left blank." />
              }
              {...formMethods.register("handle", {
                required: "Please enter the URL slug for your vendor.",
              })}
            />
          </div>
        </div>

        <h6 className="inter-base-semibold mt-large mb-base">Profile</h6>

        <div className="grid-cols-2 grid gap-x-8 gap-y-4">
          <div className="col-span-1">
            <Input
              label="Contact Email"
              type="email"
              required
              {...formMethods.register("email", {
                required: "Please enter your contact email.",
              })}
            />
          </div>
          <div className="col-span-1">
            <Input label="Location" {...formMethods.register("location")} />
          </div>
          <div className="col-span-1">
            <Textarea
              label="Description"
              rows={8}
              required
              {...formMethods.register("description", {
                required: "Please enter a short description.",
              })}
            />
          </div>
          <div className="col-span-1">
            <Textarea
              label="Return &amp; refund policy"
              rows={8}
              {...formMethods.register("return_policy")}
            />
          </div>
        </div>

        <h6 className="inter-base-semibold mt-large mb-base">Logo</h6>

        <div className="grid-cols-2 grid gap-x-8 gap-y-4">
          <div className="col-span-1">
            {logo && (
              <Button
                onClick={() => setLogo(null)}
                variant="ghost"
                className="w-full group flex border-2 border-dashed border-gray-200 hover:border-dashed hover:border-violet-60 p-base mb-base cursor-pointer"
              >
                <div className="relative max-w-full">
                  <img
                    src={logo.url}
                    alt="Vendor logo"
                    className="max-w-full h-40 object-cover"
                  />
                  <div className="hidden group-hover:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-violet-60 text-white p-2 rounded-full">
                    <TrashIcon />
                  </div>
                </div>
              </Button>
            )}

            {!logo && (
              <div>
                <FileUploadField
                  onFileChosen={(files) => {
                    const file = files[0]
                    const url = URL.createObjectURL(file)

                    setLogo({
                      url,
                      name: file.name,
                      size: file.size,
                      file,
                    })
                  }}
                  placeholder="1000 x 1000 (1:1) recommended, up to 10MB each"
                  filetypes={[
                    "image/gif",
                    "image/jpeg",
                    "image/png",
                    "image/webp",
                  ]}
                  className="py-large"
                />
              </div>
            )}
          </div>
        </div>
      </BodyCard>
    </FormProvider>
  )
}

export default VendorDetails
