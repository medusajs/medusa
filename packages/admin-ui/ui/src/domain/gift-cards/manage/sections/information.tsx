import { Product } from "@medusajs/medusa"
import {
  useAdminDeleteProduct,
  useAdminProductTypes,
  useAdminUpdateProduct,
} from "medusa-react"
import React from "react"
import { Controller } from "react-hook-form"
import { useNavigate } from "react-router-dom"
import TrashIcon from "../../../../components/fundamentals/icons/trash-icon"
import UnpublishIcon from "../../../../components/fundamentals/icons/unpublish-icon"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import StatusSelector from "../../../../components/molecules/status-selector"
import TagInput from "../../../../components/molecules/tag-input"
import TextArea from "../../../../components/molecules/textarea"
import BodyCard from "../../../../components/organisms/body-card"
import DetailsCollapsible from "../../../../components/organisms/details-collapsible"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import FormValidator from "../../../../utils/form-validator"
import { useGiftCardForm } from "../form/gift-card-form-context"

type InformationProps = {
  giftCard: Omit<Product, "beforeInsert">
}

const Information: React.FC<InformationProps> = ({ giftCard }) => {
  const {
    form: {
      register,
      setValue,
      control,
      formState: { errors },
    },
  } = useGiftCardForm()
  const navigate = useNavigate()
  const notification = useNotification()
  const { product_types } = useAdminProductTypes(undefined, {
    cacheTime: 0,
  })

  const typeOptions =
    product_types?.map((tag) => ({ label: tag.value, value: tag.id })) || []

  const updateGiftCard = useAdminUpdateProduct(giftCard.id)
  const deleteGiftCard = useAdminDeleteProduct(giftCard.id)

  const setNewType = (value: string) => {
    const newType = {
      label: value,
      value,
    }

    typeOptions.push(newType)
    setValue("type", newType)

    return newType
  }

  const onUpdate = () => {
    updateGiftCard.mutate(
      {
        // @ts-ignore
        status: giftCard.status === "draft" ? "published" : "draft",
      },
      {
        onSuccess: () => {
          notification("Success", "Gift card updated successfully", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const onDelete = () => {
    deleteGiftCard.mutate(undefined, {
      onSuccess: () => {
        navigate("/a/gift-cards")
        notification("Success", "Gift card updated successfully", "success")
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <BodyCard
      title="Product information"
      subtitle="Manage the settings for your Gift Card"
      className={"h-auto w-full"}
      status={
        <GiftCardStatusSelector
          currentStatus={giftCard.status}
          onUpdate={onUpdate}
        />
      }
      actionables={[
        {
          label:
            giftCard?.status !== "published"
              ? "Publish Gift Card"
              : "Unpublish Gift Card",
          onClick: onUpdate,
          icon: <UnpublishIcon size="16" />,
        },
        {
          label: "Delete Gift Card",
          onClick: onDelete,
          variant: "danger",
          icon: <TrashIcon size="16" />,
        },
      ]}
    >
      <div className="flex flex-col space-y-6">
        <div className="grid grid-cols-2 gap-large">
          <Input
            label="Name"
            placeholder="Add name"
            required
            defaultValue={giftCard?.title}
            {...register("title", {
              required: FormValidator.required("Name"),
              pattern: FormValidator.whiteSpaceRule("Name"),
              minLength: FormValidator.minOneCharRule("Name"),
            })}
            errors={errors}
          />
          <Input
            label="Subtitle"
            placeholder="Add a subtitle"
            {...register("subtitle", {
              pattern: FormValidator.whiteSpaceRule("Subtitle"),
              minLength: FormValidator.minOneCharRule("Subtitle"),
            })}
            errors={errors}
          />
          <TextArea
            label="Description"
            placeholder="Add a description"
            {...register("description", {
              pattern: FormValidator.whiteSpaceRule("Description"),
              minLength: FormValidator.minOneCharRule("Description"),
            })}
            errors={errors}
          />
        </div>
        <DetailsCollapsible
          triggerProps={{ className: "ml-2" }}
          contentProps={{
            forceMount: true,
          }}
        >
          <div className="grid grid-cols-2 gap-large">
            <Input
              label="Handle"
              placeholder="Product handle"
              {...register("handle", {
                pattern: FormValidator.whiteSpaceRule("Handle"),
                minLength: FormValidator.minOneCharRule("Handle"),
              })}
              tooltipContent="URL of the product"
              errors={errors}
            />
            <Controller
              control={control}
              name="type"
              render={({ field: { value, onChange } }) => {
                return (
                  <Select
                    label="Type"
                    placeholder="Select type..."
                    options={typeOptions}
                    onChange={onChange}
                    value={value}
                    isCreatable
                    onCreateOption={(value) => {
                      return setNewType(value)
                    }}
                    clearSelected
                  />
                )
              }}
            />
            <Controller
              name="tags"
              render={({ field: { onChange, value } }) => {
                return (
                  <TagInput
                    label="Tags (separated by comma)"
                    className="w-full"
                    placeholder="Spring, Summer..."
                    onChange={onChange}
                    values={value || []}
                  />
                )
              }}
              control={control}
            />
          </div>
        </DetailsCollapsible>
      </div>
    </BodyCard>
  )
}

const GiftCardStatusSelector = ({
  currentStatus,
  onUpdate,
}: {
  currentStatus: "draft" | "proposed" | "published" | "rejected"
  onUpdate: () => void
}) => {
  return (
    <StatusSelector
      activeState="Published"
      draftState="Draft"
      isDraft={currentStatus === "draft"}
      onChange={onUpdate}
    />
  )
}

export default Information
