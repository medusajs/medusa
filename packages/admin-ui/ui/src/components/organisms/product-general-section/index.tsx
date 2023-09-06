import { useTranslation } from "react-i18next"
import { Product as BaseProduct } from "@medusajs/medusa"
import useEditProductActions from "../../../hooks/use-edit-product-actions"
import useToggleState from "../../../hooks/use-toggle-state"
import {
  FeatureFlag,
  useFeatureFlag,
} from "../../../providers/feature-flag-provider"
import FeatureToggle from "../../fundamentals/feature-toggle"
import ChannelsIcon from "../../fundamentals/icons/channels-icon"
import EditIcon from "../../fundamentals/icons/edit-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"
import DelimitedList from "../../molecules/delimited-list"
import SalesChannelsDisplay from "../../molecules/sales-channels-display"
import StatusSelector from "../../molecules/status-selector"
import Section from "../section"
import ChannelsModal from "./channels-modal"
import GeneralModal from "./general-modal"

type Product = BaseProduct & {
  title_ar: string
  subtitle_ar: string
  handle_ar: string
  description_ar: string | null
  seo_title: string
  seo_description: string
  seo_url: string
}
type Props = {
  product: Product
}

const ProductGeneralSection = ({ product }: Props) => {
  const { t } = useTranslation()
  const { onDelete, onStatusChange } = useEditProductActions(product.id)
  const {
    state: infoState,
    close: closeInfo,
    toggle: toggleInfo,
  } = useToggleState()

  const {
    state: channelsState,
    close: closeChannels,
    toggle: toggleChannels,
  } = useToggleState(false)

  const { isFeatureEnabled } = useFeatureFlag()

  const actions: ActionType[] = [
    {
      label: t("Edit General Information"),
      onClick: toggleInfo,
      icon: <EditIcon size={20} />,
    },
    {
      label: t("Delete"),
      onClick: onDelete,
      variant: "danger",
      icon: <TrashIcon size={20} />,
    },
  ]

  if (isFeatureEnabled("sales_channels")) {
    actions.splice(1, 0, {
      label: t("Edit Sales Channels"),
      onClick: toggleChannels,
      icon: <ChannelsIcon size={20} />,
    })
  }

  return (
    <>
      <Section
        title={product.title}
        actions={actions}
        forceDropdown
        status={
          <StatusSelector
            isDraft={product?.status === "draft"}
            activeState={t("Published")}
            draftState={t("Draft")}
            onChange={() => onStatusChange(product.status)}
          />
        }
      >
        <p
          className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap text-right"
          dangerouslySetInnerHTML={{ __html: product.description_ar as string }}
        ></p>
        <br />
        <p
          className="inter-base-regular text-grey-50 mt-2 whitespace-pre-wrap"
          dangerouslySetInnerHTML={{ __html: product.description as string }}
        ></p>
        <ProductTags product={product} />
        <ProductDetails product={product} />
        <ProductSalesChannels product={product} />
      </Section>

      <GeneralModal product={product} open={infoState} onClose={closeInfo} />

      <FeatureToggle featureFlag="sales_channels">
        <ChannelsModal
          product={product}
          open={channelsState}
          onClose={closeChannels}
        />
      </FeatureToggle>
    </>
  )
}

type DetailProps = {
  title: string
  value?: string[] | string | null
}

const Detail = ({ title, value }: DetailProps) => {
  const DetailValue = () => {
    if (!Array.isArray(value)) {
      return <p>{value ? value : "–"}</p>
    }

    if (value.length) {
      return <DelimitedList list={value} delimit={2} />
    }

    return <p>–</p>
  }

  return (
    <div className="inter-base-regular text-grey-50 flex items-center justify-between">
      <p>{title}</p>
      <DetailValue />
    </div>
  )
}

const ProductDetails = ({ product }: Props) => {
  const { isFeatureEnabled } = useFeatureFlag()
  const { t } = useTranslation()

  return (
    <div className="mt-8 flex flex-col gap-y-3">
<h2 className="inter-base-semibold">{t("Details")}</h2>
      <Detail title={t("Subtitle english")} value={product.subtitle} />
      <Detail title={t("Subtitle arabic")} value={product.subtitle_ar} />
      <Detail title={t("Handle english")} value={product.handle} />
      <Detail title={t("Handle arabic")} value={product.handle_ar} />
      <Detail title={t("Type")} value={product.type?.value} />
      <Detail title={t("Collection")} value={product.collection?.title} />
      <Detail title={t("SEO title")} value={product.seo_title} />
      <Detail title={t("SEO description")} value={product.seo_description} />
      <Detail title={t("SEO URL")} value={product.seo_url} />
      {isFeatureEnabled(FeatureFlag.PRODUCT_CATEGORIES) && (
        <Detail
          title={t("Category")}
          value={product.categories.map((c) => c.name)}
        />
      )}
      <Detail
        title={t("Discountable")}
        value={product.discountable ? t("True") : t("False")}
      />
      <Detail
        title={t("Metadata")}
        value={
          Object.entries(product.metadata || {}).length > 0
            ? t("itemsWithCount", {
                count: Object.keys(product.metadata || {}).length,
              })
            : undefined
        }
      />
    </div>
  )
}

const ProductTags = ({ product }: Props) => {
  if (product.tags?.length === 0) {
    return null
  }

  return (
    <ul className="mt-4 flex flex-wrap items-center gap-1">
      {product.tags.map((t) => (
        <li key={t.id}>
          <div className="text-grey-50 bg-grey-10 inter-small-semibold rounded-rounded px-3 py-[6px]">
            {t.value}
          </div>
        </li>
      ))}
    </ul>
  )
}

const ProductSalesChannels = ({ product }: Props) => {
  const { t } = useTranslation()
  return (
    <FeatureToggle featureFlag="sales_channels">
      <div className="mt-xlarge">
        <h2 className="inter-base-semibold mb-xsmall">{t("Sales channels")}</h2>
        <SalesChannelsDisplay channels={product.sales_channels} />
      </div>
    </FeatureToggle>
  )
}

export default ProductGeneralSection
