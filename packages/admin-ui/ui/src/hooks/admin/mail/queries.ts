import { Response } from "@medusajs/medusa-js"
import { AxiosResponse } from "axios"
import { UseQueryOptionsWrapper } from "medusa-react/dist/types"
import { useQuery } from "react-query"
import { MailTemplate } from "../../../domain/email/types"
import medusaRequest from "../../../services/request"
import { queryKeysFactory } from "../../utils"

const MAIL_TEMPLATE_QUERY_KEY = `mail-template,count` as const

export const mailTemplateKeys = queryKeysFactory(MAIL_TEMPLATE_QUERY_KEY)

type MailTemplateQueryKeys = typeof mailTemplateKeys

export const useGetEmailTemplates = (
  options?: UseQueryOptionsWrapper<
    AxiosResponse<{ templates: MailTemplate[] }>,
    Error,
    ReturnType<MailTemplateQueryKeys["list"]>
  >
) => {
  const path = `/admin/mail/templates`

  const { data, ...rest } = useQuery(
    mailTemplateKeys.list(),
    () => medusaRequest<Response<{ templates: MailTemplate[] }>>("GET", path),
    options
  )

  return { ...data?.data, ...rest }
}
