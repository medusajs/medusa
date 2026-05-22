import { Badge, Container, Heading, Text } from "@medusajs/ui"
import { useTranslation } from "react-i18next"
import { useRequiredPermissions } from "../../../providers/permissions-provider"
import { useFeatureFlag } from "../../../providers/feature-flag-provider"

/**
 * Reads the permission requirements that descendant components (typically
 * `PermissionGuard`, `RoutePermissionGuard`, or `PermissionsRequirement`)
 * have registered with the nearest `PermissionsRequirementsProvider`, and
 * renders them as a labelled summary. When no requirements are registered,
 * it renders a "no permissions required" state so the panel is informative
 * either way.
 */
export const RequiredPermissionsSection = () => {
  const { t } = useTranslation()
  const isRbacEnabled = useFeatureFlag("rbac")
  const requirements = useRequiredPermissions()

  if (!isRbacEnabled) {
    return null
  }

  if (!requirements.length) {
    return (
      <Container className="flex flex-col gap-y-2 px-6 py-4">
        <Heading level="h2">
          {t("permissions.requiredPermissions.title")}
        </Heading>
        <Text size="small" className="text-ui-fg-subtle">
          {t("permissions.requiredPermissions.none")}
        </Text>
      </Container>
    )
  }

  return (
    <Container className="flex flex-col gap-y-3 px-6 py-4">
      <div className="flex items-center justify-between">
        <Heading level="h2">
          {t("permissions.requiredPermissions.title")}
        </Heading>
        <Badge size="2xsmall" rounded="full">
          {requirements.length}
        </Badge>
      </div>
      <div className="flex flex-col gap-y-3">
        {requirements.map((requirement) => {
          const key = [
            requirement.requireAll ? "all" : "any",
            requirement.permissions.join("|"),
            requirement.source || "",
          ].join("::")

          return (
            <div key={key} className="flex flex-col gap-y-2">
              <Text size="small" className="text-ui-fg-subtle">
                {requirement.requireAll
                  ? t("permissions.requiredPermissions.allOf")
                  : t("permissions.requiredPermissions.anyOf")}
              </Text>
              <div className="flex flex-wrap gap-1.5">
                {requirement.permissions.map((permission) => (
                  <Badge key={permission} size="2xsmall">
                    {permission}
                  </Badge>
                ))}
              </div>
              {requirement.source && (
                <Text size="xsmall" className="text-ui-fg-muted">
                  {t("permissions.requiredPermissions.source", {
                    source: requirement.source,
                  })}
                </Text>
              )}
            </div>
          )
        })}
      </div>
    </Container>
  )
}
