import { Container, Heading, Text } from "@medusajs/ui";

import { Spinner } from "@medusajs/icons";
import { useAdminGetSession } from "medusa-react";
import { useTranslation } from "react-i18next";
import { languages } from "../../../../i18n/config";
import { EditProfileDetailsDrawer } from "../../components/edit-profile-details-drawer/edit-profile-details-drawer";

export const Profile = () => {
  const { user, isLoading } = useAdminGetSession();
  const { i18n } = useTranslation();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner className="animate-spin text-ui-fg-interactive" />
      </div>
    );
  }

  return (
    <div>
      <Container className="p-0">
        <div className="px-8 py-6 border-b border-ui-border-base">
          <Heading>Profile</Heading>
          <Text className="text-ui-fg-subtle" size="small">
            Manage your profile
          </Text>
        </div>
        <div className="px-8 py-6 border-b border-ui-border-base grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            Name
          </Text>
          <Text size="small" leading="compact">
            {user.first_name} {user.last_name}
          </Text>
        </div>
        <div className="px-8 py-6 border-b border-ui-border-base grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            Email
          </Text>
          <Text size="small" leading="compact">
            {user.email}
          </Text>
        </div>
        <div className="px-8 py-6 border-b border-ui-border-base grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            Language
          </Text>
          <Text size="small" leading="compact">
            {languages.find((lang) => lang.code === i18n.language)
              ?.display_name || "-"}
          </Text>
        </div>
        <div className="px-8 py-6 grid grid-cols-2">
          <Text size="small" leading="compact" weight="plus">
            Usage insights
          </Text>
        </div>
        <div className="px-8 py-6 border-t border-ui-border-base flex items-center justify-end">
          <EditProfileDetailsDrawer
            id={user.id}
            firstName={user.first_name}
            lastName={user.last_name}
          />
        </div>
      </Container>
    </div>
  );
};
