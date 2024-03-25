import { Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

export const CategoryTree = () => {
  const { t } = useTranslation()

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading>{t("categories.domain")}</Heading>
      </div>
    </Container>
  )
}
