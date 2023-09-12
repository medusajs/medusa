import React, { useContext } from "react"
import clsx from "clsx"

import { ProductCategory } from "@medusajs/medusa"
import { useAdminDeleteProductCategory } from "medusa-react"
import { useTranslation } from "react-i18next"

import { ProductCategoriesContext } from "../pages"
import Tooltip from "../../../components/atoms/tooltip"
import Button from "../../../components/fundamentals/button"
import Actionables from "../../../components/molecules/actionables"
import TooltipIcon from "../../../components/molecules/tooltip-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import FolderOpenIcon from "../../../components/fundamentals/icons/folder-open-icon"
import TagIcon from "../../../components/fundamentals/icons/tag-icon"
import TagDotIcon from "../../../components/fundamentals/icons/tag-dot-icon"
import EyeOffIcon from "../../../components/fundamentals/icons/eye-off-icon"
import MoreHorizontalIcon from "../../../components/fundamentals/icons/more-horizontal-icon"
import useNotification from "../../../hooks/use-notification"

type ProductCategoryListItemDetailsProps = {
  depth: number
  item: ProductCategory
  handler: React.ReactNode
  collapseIcon: React.ReactNode
}

function ProductCategoryListItemDetails(
  props: ProductCategoryListItemDetailsProps
) {
  const { item } = props
  const { t } = useTranslation()
  const notification = useNotification()

  const hasChildren = !!item.category_children?.length

  const productCategoriesPageContext = useContext(ProductCategoriesContext)

  const { mutateAsync: deleteCategory } = useAdminDeleteProductCategory(item.id)

  const actions = [
    {
      label: t("components-edit", "Edit"),
      onClick: () => productCategoriesPageContext.editCategory(item),
      icon: <EditIcon size={20} />,
    },
    {
      label: t("components-delete", "Delete"),
      variant: "danger",
      onClick: async () => {
        try {
          await deleteCategory()
          notification(
            t("components-success", "Success"),
            t("components-category-deleted", "Category deleted"),
            "success"
          )
        } catch (e) {
          notification(
            t("components-error", "Error"),
            t(
              "components-category-deletion-failed",
              "Category deletion failed"
            ),
            "error"
          )
        }
      },
      icon: <TrashIcon size={20} />,
      disabled: !!item.category_children.length,
    },
  ]

  return (
    <div className="bg-white">
      <div
        style={{ marginLeft: props.depth * -8 }}
        className="flex h-[40px] items-center"
      >
        <div className="flex w-[32px] items-center justify-center">
          {props.handler}
        </div>

        <div className="flex w-full items-center justify-between">
          <div className="flex items-center">
            {hasChildren && (
              <div className="absolute flex w-[20px] cursor-pointer items-center justify-center">
                {props.collapseIcon}
              </div>
            )}
            <div className="ml-[20px] flex w-[32px] items-center justify-center">
              {hasChildren && <FolderOpenIcon color="#889096" size={18} />}
              {!hasChildren && <TagIcon color="#889096" size={18} />}
            </div>
            <span
              className={clsx("ml-2 select-none text-xs font-medium", {
                "font-normal text-gray-400": !hasChildren,
              })}
            >
              {item.name}
            </span>

            <div className="flex w-[64px] items-center justify-center">
              {!item.is_active && (
                <TooltipIcon
                  content={t(
                    "components-category-status-is-inactive",
                    "Category status is inactive"
                  )}
                  icon={
                    <TagDotIcon
                      size="32"
                      className="cursor-pointer"
                      outerColor="#FFE5E5"
                    />
                  }
                />
              )}
              {item.is_internal && (
                <TooltipIcon
                  content={t(
                    "components-category-visibility-is-private",
                    "Category visibility is private"
                  )}
                  icon={
                    <EyeOffIcon
                      color="#889096"
                      size={18}
                      className="cursor-pointer"
                    />
                  }
                />
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip
              style={{ zIndex: 1 }}
              content={
                <>
                  {t("components-add-category-item-to", "Add category item to")}{" "}
                  <span className="text-grey-80 font-semibold">
                    {`"${item.name}"`}
                  </span>
                </>
              }
            >
              <Button
                size="small"
                variant="ghost"
                onClick={() =>
                  productCategoriesPageContext.createSubCategory(item)
                }
              >
                <PlusIcon color="#687076" size={18} />
              </Button>
            </Tooltip>
            <Actionables
              forceDropdown
              actions={actions}
              customTrigger={
                <Button
                  size="small"
                  variant="ghost"
                  className="h-xlarge w-xlarge focus-visible:border-violet-60 focus-visible:shadow-input focus:shadow-none focus-visible:outline-none"
                >
                  <MoreHorizontalIcon color="#687076" size={20} />
                </Button>
              }
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductCategoryListItemDetails
