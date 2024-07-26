import { Button, Heading, Text, toast } from "@medusajs/ui"
import { RouteDrawer, useRouteModal } from "../../../components/modals"
import { useTranslation } from "react-i18next"
import { useState } from "react"
import { useConfirmImportProducts, useImportProducts } from "../../../hooks/api"
import { UploadImport } from "./components/upload-import"
import { ImportSummary } from "./components/import-summary"
import { Trash } from "@medusajs/icons"
import { FilePreview } from "../../../components/common/file-preview"

export const ProductImport = () => {
  const { t } = useTranslation()

  return (
    <RouteDrawer>
      <RouteDrawer.Header>
        <RouteDrawer.Title asChild>
          <Heading>{t("products.import.header")}</Heading>
        </RouteDrawer.Title>
        <RouteDrawer.Description className="sr-only">
          {t("products.import.description")}
        </RouteDrawer.Description>
      </RouteDrawer.Header>
      <ProductImportContent />
    </RouteDrawer>
  )
}

const ProductImportContent = () => {
  const { t } = useTranslation()
  const [filename, setFilename] = useState<string>()

  const { mutateAsync: importProducts, isPending, data } = useImportProducts()
  const { mutateAsync: confirm } = useConfirmImportProducts()
  const { handleSuccess } = useRouteModal()

  const handleUploaded = async (file: File) => {
    setFilename(file.name)
    await importProducts(
      { file },
      {
        onError: (err) => {
          toast.error(err.message)
          setFilename(undefined)
        },
      }
    )
  }

  const handleConfirm = async () => {
    if (!data?.transaction_id) {
      return
    }

    await confirm(data.transaction_id, {
      onSuccess: () => {
        toast.info(t("products.import.success.title"), {
          description: t("products.import.success.description"),
        })
        handleSuccess()
      },
      onError: (err) => {
        toast.error(err.message)
      },
    })
  }

  const uploadedFileActions = [
    {
      actions: [
        {
          label: t("actions.delete"),
          icon: <Trash />,
          onClick: () => setFilename(undefined),
        },
      ],
    },
  ]

  return (
    <>
      <RouteDrawer.Body>
        <Heading level="h2">{t("products.import.upload.title")}</Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("products.import.upload.description")}
        </Text>

        <div className="mt-4">
          {filename ? (
            <FilePreview
              filename={filename}
              loading={isPending}
              activity={t("products.import.upload.preprocessing")}
              actions={uploadedFileActions}
            />
          ) : (
            <UploadImport onUploaded={handleUploaded} />
          )}
        </div>

        {data?.summary && !!filename && (
          <div className="mt-4">
            <ImportSummary summary={data?.summary} />
          </div>
        )}

        <Heading className="mt-6" level="h2">
          {t("products.import.template.title")}
        </Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("products.import.template.description")}
        </Text>
        <div className="mt-4">
          <FilePreview
            filename={"medusa-template-product-list.csv"}
            // TODO: Where would the template file be stored?
            url={"https://example.com"}
          />
        </div>
      </RouteDrawer.Body>
      <RouteDrawer.Footer>
        <div className="flex items-center gap-x-2">
          <RouteDrawer.Close asChild>
            <Button size="small" variant="secondary">
              {t("actions.cancel")}
            </Button>
          </RouteDrawer.Close>
          <Button
            onClick={handleConfirm}
            size="small"
            disabled={!data?.transaction_id || !filename}
          >
            {t("actions.import")}
          </Button>
        </div>
      </RouteDrawer.Footer>
    </>
  )
}
