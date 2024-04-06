import { Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useLoaderData } from "react-router-dom"

export function LocationList() {
  const { t } = useTranslation()

  const initialData = useLoaderData() as Awaited<ReturnType<typeof any>>

  console.log(initialData)

  return (
    <div className="grid grid-cols-2 gap-x-6 py-4">
      <Container>
        <Heading className="mb-2">{t("shipping.title")}</Heading>
        <Text className="text-ui-fg-subtle">{t("shipping.description")}</Text>
      </Container>
      <div>// List</div>
    </div>
  )
}
