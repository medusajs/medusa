import React, { FC, useEffect, useMemo, useState } from "react"
import clsx from "clsx"
import { FormProvider, useForm } from "react-hook-form"
import {
  useAdminGetMailPreview,
  useAdminSendMailPreview,
} from "../../hooks/admin/mail"
import { useGetEmailTemplates } from "../../hooks/admin/mail/queries"
import Button from "../../components/fundamentals/button"
import ArrowLeftIcon from "../../components/fundamentals/icons/arrow-left-icon"
import CrossIcon from "../../components/fundamentals/icons/cross-icon"
import GearIcon from "../../components/fundamentals/icons/gear-icon"
import Input from "../../components/molecules/input"
import useNotification from "../../hooks/use-notification"
import InfoIcon from "../../components/fundamentals/icons/info-icon"
import Select from "../../components/molecules/select/next-select/select"
import { MailMessage } from "./types"
import { getErrorMessage } from "../../utils/error-messages"
import { useLocation, useNavigate } from "react-router-dom"

export interface EmailPreviewProps {}

export const EmailPreview: FC<{ preview?: MailMessage | null }> = ({
  preview,
}) => {
  const { html, text } = preview || {}

  return (
    <div className="h-full">
      {!preview && (
        <div className="flex justify-center h-full">
          <div className="text-center mt-32">
            <h2 className="inter-xlarge-semibold mb-2">No preview available</h2>
            <p className="text-grey-50">Please select a template to preview.</p>
          </div>
        </div>
      )}

      {html && (
        <iframe
          title="Email preview"
          srcDoc={html}
          width="100%"
          height="100%"
        />
      )}

      {!html && text && (
        <div className="py-12 px-6">
          <div className="whitespace-pre-wrap mx-auto max-w-[584px]">
            {text}
          </div>
        </div>
      )}
    </div>
  )
}

const EmailPreviewPage: FC<EmailPreviewProps> = (props) => {
  const navigate = useNavigate()
  const [preview, setPreview] = useState<any>(null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const { templates } = useGetEmailTemplates()
  const getMailPreview = useAdminGetMailPreview()
  const sendMailPreview = useAdminSendMailPreview()
  const formMethods = useForm()
  const notification = useNotification({ position: "bottom-left" })
  const location = useLocation()
  const queryParams = useMemo(
    () => new URLSearchParams(location.search),
    [location.search]
  )

  const fetchPreview = async (id) => {
    if (!id) {
      return setPreview(null)
    }

    const { data } = await getMailPreview.mutateAsync({ template_id: id })

    return setPreview(data.preview)
  }

  const sendPreview = async (values) => {
    try {
      const { data } = await sendMailPreview.mutateAsync({
        template_id: preview.id,
        ...values,
      })

      if (data.success) {
        notification(
          "Email sent",
          "The preview email was sent successfully",
          "success"
        )
      }
    } catch (error) {
      notification("Email not sent", getErrorMessage(error), "error")
    }
  }

  const handleBackClick = () => navigate(-1)

  const handleTemplateChange = async ({ value }: any) => {
    const template = templates?.find((t) => t.id === value)
    if (!template) return
    queryParams.set("templateName", encodeURIComponent(template.title))
    navigate(
      {
        search: queryParams.toString(),
      },
      {
        replace: true,
      }
    )
  }

  useEffect(() => {
    const templateName = queryParams.get("templateName")
    if (!templateName) return

    const selectedTemplate = templates?.find(
      (template) =>
        template.title === decodeURIComponent(templateName as string)
    )
    if (selectedTemplate) fetchPreview(selectedTemplate.id)
  }, [queryParams, templates])

  const templateOptions =
    templates?.map((template) => ({
      value: template.id,
      label: template.title,
    })) || []

  return (
    <div className="flex flex-col h-screen overflow-hidden inter-base-regular">
      <div className="max-h-[76px]">
        <div className="sticky top-0 flex gap-2 justify-between border border-b-grey-20 bg-white px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="flex-shrink-0">
              <Button
                variant="secondary"
                size="medium"
                onClick={handleBackClick}
              >
                <ArrowLeftIcon />
                <span>Back</span>
              </Button>
            </div>

            {!isSidebarOpen && (
              <Select
                name="template"
                placeholder="Select a template"
                options={templateOptions}
                className="min-w-[280px]"
                onChange={handleTemplateChange}
                value={templateOptions.find(
                  (option) => option.value === preview?.id
                )}
              />
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="medium"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className={clsx("px-[7px]", {
                "text-violet-70 border-violet-70": isSidebarOpen,
              })}
            >
              <span>
                {!isSidebarOpen && <GearIcon size={24} />}
                {isSidebarOpen && <CrossIcon size={24} />}
              </span>
            </Button>
          </div>
        </div>
      </div>

      <div className="flex">
        <div className="h-[calc(100vh_-_76px)] grow shrink overflow-y-auto">
          <EmailPreview preview={preview} />
        </div>

        <div className="h-[calc(100vh_-_76px)] grow-0 shrink-0 overflow-y-auto border-l border-grey-20 bg-white">
          <div
            className={clsx("px-8 py-8 w-[400px]", { hidden: !isSidebarOpen })}
          >
            <div className="flex items-start justify-between gap-4 mb-4">
              <h2 className="inter-xlarge-semibold mt-0">Preview options</h2>

              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="text-grey-50 cursor-pointer"
              >
                <CrossIcon size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-4">
              <Select
                name="template"
                label="Template"
                placeholder="Select a template"
                options={templateOptions}
                className="min-w-[280px] mb-2"
                onChange={handleTemplateChange}
                value={templateOptions.find(
                  (option) => option.value === preview?.id
                )}
              />

              <h3 className="inter-large-semibold text-grey-90">
                Send a test email
              </h3>

              {!preview && (
                <div className="flex gap-3 items-start inter-base-regular bg-grey-10 text-grey-90 rounded-lg pl-4 pr-5 py-3">
                  <div>
                    <InfoIcon className="text-grey-40 mt-1" size={16} />
                  </div>
                  <div>
                    You must select an email template before you can send a test
                    email.
                  </div>
                </div>
              )}

              {preview && (
                <FormProvider {...formMethods}>
                  <fieldset
                    className="flex flex-col gap-4"
                    disabled={!preview || formMethods.formState.isSubmitting}
                  >
                    <Input
                      {...formMethods.register("to", {
                        required: "Please enter an email address",
                      })}
                      label="Recipient"
                      prefix="To:"
                      placeholder="test@email.com"
                    />
                    <Button
                      variant="primary"
                      size="medium"
                      onClick={formMethods.handleSubmit(sendPreview)}
                    >
                      Send
                    </Button>
                  </fieldset>
                </FormProvider>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmailPreviewPage
