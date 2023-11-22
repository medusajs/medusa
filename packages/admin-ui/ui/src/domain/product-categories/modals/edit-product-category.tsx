import { useEffect } from "react";

import { ProductCategory } from "@medusajs/medusa";
import { useAdminUpdateProductCategory } from "medusa-react";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import Button from "../../../components/fundamentals/button";
import CrossIcon from "../../../components/fundamentals/icons/cross-icon";
import InputField from "../../../components/molecules/input";
import TextArea from "../../../components/molecules/textarea";
import SideModal from "../../../components/molecules/modal/side-modal";
import { NextSelect } from "../../../components/molecules/select/next-select";
import useNotification from "../../../hooks/use-notification";
import { Option } from "../../../types/shared";
import { getErrorMessage } from "../../../utils/error-messages";
import TreeCrumbs from "../components/tree-crumbs";
import MetadataForm, {
  getSubmittableMetadata,
} from "../../../components/forms/general/metadata-form";
import { Controller, useForm } from "react-hook-form";
import { nestedForm } from "../../../utils/nested-form";
import { CategoryFormData } from "./add-product-category";

const visibilityOptions: (t: TFunction) => Option[] = (t) => [
  {
    label: "Public",
    value: "public",
  },
  { label: "Private", value: "private" },
];

const statusOptions: (t: TFunction) => Option[] = (t) => [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
];

type EditProductCategoriesSideModalProps = {
  activeCategory: ProductCategory;
  close: () => void;
  isVisible: boolean;
  categories: ProductCategory[];
};

/**
 * Modal for editing product categories
 */
function EditProductCategoriesSideModal(
  props: EditProductCategoriesSideModalProps
) {
  const { isVisible, close, activeCategory, categories } = props;

  const { t } = useTranslation();
  const notification = useNotification();

  const { mutateAsync: updateCategory } = useAdminUpdateProductCategory(
    activeCategory?.id
  );

  const form = useForm<CategoryFormData>({
    defaultValues: {
      name: activeCategory?.name || "",
      handle: activeCategory?.handle || "",
      description: activeCategory?.description || "",
      metadata: {
        entries: Object.entries(activeCategory?.metadata || {}).map(
          ([key, value]) => ({
            key,
            value: value as string,
            state: "existing",
          })
        ),
      },
      is_active: {
        value: activeCategory?.is_active ? "active" : "inactive",
        label: activeCategory?.is_active
          ? t("modals-active", "Public") || "Public"
          : t("modals-inactive", "Inactive") || "Inactive",
      },
      is_public: {
        value: activeCategory?.is_internal ? "private" : "public",
        label: activeCategory?.is_internal
          ? t("modals-private", "Private") || "Private"
          : t("modals-public", "Public") || "Public",
      },
    },
    mode: "onChange",
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors, isDirty, isValid, isSubmitting },
  } = form;

  useEffect(() => {
    if (activeCategory) {
      reset({
        name: activeCategory.name,
        handle: activeCategory.handle,
        description: activeCategory.description,
        metadata: {
          entries: Object.entries(activeCategory?.metadata || {}).map(
            ([key, value]) => ({
              key,
              value: value as string,
              state: "existing",
            })
          ),
        },
        is_active: {
          value: activeCategory.is_active ? "active" : "inactive",
          label: activeCategory.is_active
            ? t("modals-active", "Public") || "Public"
            : t("modals-inactive", "Inactive") || "Inactive",
        },
        is_public: {
          value: activeCategory.is_internal ? "private" : "public",
          label: activeCategory.is_internal
            ? t("modals-private", "Private") || "Private"
            : t("modals-public", "Public") || "Public",
        },
      });
    }
  }, [activeCategory, reset]);

  const onSave = async (data: CategoryFormData) => {
    console.log(data);
    try {
      await updateCategory({
        name: data.name,
        handle: data.handle,
        description: data.description,
        is_active: data.is_active.value === "active",
        is_internal: data.is_public.value === "private",
        metadata: getSubmittableMetadata(data.metadata),
      });

      notification(
        t("modals-success", "Success"),
        t(
          "modals-successfully-updated-the-category",
          "Successfully updated the category"
        ),
        "success"
      );
      close();
    } catch (e) {
      const errorMessage =
        getErrorMessage(e) ||
        t(
          "modals-failed-to-update-the-category",
          "Failed to update the category"
        );
      notification(t("modals-error", "Error"), errorMessage, "error");
    }
  };

  const onClose = () => {
    close();
  };

  return (
    <SideModal close={onClose} isVisible={!!isVisible}>
      <div className="flex h-full flex-col justify-between overflow-auto">
        {/* === HEADER === */}
        <div className="flex items-center justify-between p-6">
          <Button
            size="small"
            variant="secondary"
            className="h-8 w-8 p-2"
            onClick={props.close}
          >
            <CrossIcon size={20} className="text-grey-50" />
          </Button>
          <div className="gap-x-small flex">
            <Button
              size="small"
              variant="primary"
              disabled={!isDirty || !isValid || isSubmitting}
              onClick={handleSubmit(onSave)}
              className="rounded-rounded"
            >
              {t("modals-save-category", "Save category")}
            </Button>
          </div>
        </div>
        <h3 className="inter-large-semibold flex items-center gap-2 text-xl text-gray-900 px-6">
          {t("modals-edit-product-category", "Edit product category")}
        </h3>
        {/* === DIVIDER === */}
        <div className="block h-[1px] bg-gray-200" />

        {activeCategory && (
          <div className="mt-[25px] px-6">
            <TreeCrumbs nodes={categories} currentNode={activeCategory} />
          </div>
        )}

        <div className="flex-grow px-6">
          <InputField
            required
            label={t("modals-name", "Name") || "Name"}
            type="string"
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-name",
                "Give this category a name"
              ) || "Give this category a name"
            }
            {...register("name", { required: true })}
          />

          <InputField
            label={t("modals-handle", "Handle") || "Handle"}
            className="my-6"
            type="string"
            placeholder={
              t("modals-custom-handle", "Custom handle") || "Custom handle"
            }
            {...register("handle")}
          />

          <TextArea
            label={t("modals-description", "Description")}
            className="my-6"
            placeholder={
              t(
                "modals-give-this-category-a-description",
                "Give this category a description"
              ) || "Give this category a description"
            }
            {...register("description")}
          />

          <Controller
            name={"is_active"}
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  label={t("modals-status", "Status") || "Status"}
                  placeholder="Choose a country"
                  options={statusOptions(t)}
                  value={
                    statusOptions(t)[field.value?.value === "active" ? 0 : 1]
                  }
                />
              );
            }}
          />

          <Controller
            name={"is_public"}
            control={control}
            rules={{ required: true }}
            render={({ field }) => {
              return (
                <NextSelect
                  {...field}
                  className="my-6"
                  label={t("modals-visibility", "Visibility") || "Visibility"}
                  placeholder="Choose a country"
                  options={visibilityOptions(t)}
                  value={
                    visibilityOptions(t)[field.value.value === "public" ? 0 : 1]
                  }
                />
              );
            }}
          />
          <div className="mt-small mb-xlarge">
            <h2 className="inter-base-semibold mb-base">
              {t("collection-modal-metadata", "Metadata")}
            </h2>
            <MetadataForm form={nestedForm(form, "metadata")} />
          </div>
        </div>
      </div>
    </SideModal>
  );
}

export default EditProductCategoriesSideModal;
