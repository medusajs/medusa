import { Container, Heading, RadioGroup, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

import { useDocumentDirection } from "../../../../../hooks/use-document-direction"
import { SelectionTemplate } from "../../utils"

type PermissionsTemplatesProps = {
  /**
   * The applied template, or null when none is (or manual changes were made).
   */
  value: SelectionTemplate | null
  onSelect: (template: SelectionTemplate) => void
}

const TEMPLATES: SelectionTemplate[] = ["full", "readonly"]

export const PermissionsTemplates = ({
  value,
  onSelect,
}: PermissionsTemplatesProps) => {
  const { t } = useTranslation()
  const direction = useDocumentDirection()

  return (
    <Container className="flex flex-col gap-y-4 p-6">
      <div>
        <Heading level="h2">
          {t("roles.permissions.matrix.templates.heading")}
        </Heading>
        <Text size="small" leading="compact" className="text-ui-fg-subtle">
          {t("roles.permissions.matrix.templates.hint")}
        </Text>
      </div>
      <RadioGroup
        dir={direction}
        value={value ?? ""}
        onValueChange={(next) => onSelect(next as SelectionTemplate)}
        className="grid grid-cols-1 gap-4 md:grid-cols-2"
      >
        {TEMPLATES.map((template) => (
          <RadioGroup.ChoiceBox
            key={template}
            value={template}
            label={t(`roles.permissions.matrix.templates.${template}.label`)}
            description={t(
              `roles.permissions.matrix.templates.${template}.description`
            )}
          />
        ))}
      </RadioGroup>
      <Text size="xsmall" leading="compact" className="text-ui-fg-muted">
        {t("roles.permissions.matrix.templates.snapshotNote")}
      </Text>
    </Container>
  )
}
