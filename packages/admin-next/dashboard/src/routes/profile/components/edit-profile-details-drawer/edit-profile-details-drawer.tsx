import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Drawer, Heading, Input, Select, Switch } from "@medusajs/ui";
import { useAdminUpdateUser } from "medusa-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import * as zod from "zod";
import { Form } from "../../../../components/common/form";
import { languages } from "../../../../i18n/config";

const EditProfileDetailsSchema = zod.object({
  first_name: zod.string().optional(),
  last_name: zod.string().optional(),
  language: zod.string(),
  user_insights: zod.boolean(),
});

type EditProfileDetailsDrawerProps = {
  id: string;
  firstName?: string;
  lastName?: string;
  userInsights?: boolean;
};

export const EditProfileDetailsDrawer = ({
  id,
  firstName = "",
  lastName = "",
  userInsights = false,
}: EditProfileDetailsDrawerProps) => {
  const [open, setOpen] = useState(false);
  const { mutateAsync } = useAdminUpdateUser(id);

  const { i18n } = useTranslation();

  const changeLanguage = (code: string) => {
    i18n.changeLanguage(code);
  };

  const sortedLanguages = languages.sort((a, b) =>
    a.display_name.localeCompare(b.display_name)
  );

  const form = useForm<zod.infer<typeof EditProfileDetailsSchema>>({
    defaultValues: {
      first_name: firstName,
      last_name: lastName,
      language: i18n.language,
      user_insights: userInsights,
    },
    resolver: zodResolver(EditProfileDetailsSchema),
  });

  const { t } = useTranslation();

  const onOpenChange = (open: boolean) => {
    if (!open) {
      form.reset();
    }

    setOpen(open);
  };

  const onSubmit = form.handleSubmit(async (values) => {
    await mutateAsync({
      first_name: values.first_name,
      last_name: values.last_name,
    });

    changeLanguage(values.language);

    onOpenChange(false);
  });

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <Drawer.Trigger asChild>
        <Button variant="secondary">Edit profile</Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header>
          <Heading>Edit Profile</Heading>
        </Drawer.Header>
        <Drawer.Body>
          <Form {...form}>
            <div className="flex flex-col gap-y-8">
              <div className="grid grid-cols-2 gap-4">
                <Form.Field
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("fields.firstName")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
                <Form.Field
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <Form.Item>
                      <Form.Label>{t("fields.lastName")}</Form.Label>
                      <Form.Control>
                        <Input {...field} />
                      </Form.Control>
                      <Form.ErrorMessage />
                    </Form.Item>
                  )}
                />
              </div>
              <Form.Field
                control={form.control}
                name="language"
                render={({ field }) => (
                  <Form.Item className="gap-y-4">
                    <div>
                      <Form.Label>Language</Form.Label>
                      <Form.Hint>
                        The language you want to use in the admin dashboard.
                        This will not change the language of your store.
                      </Form.Hint>
                    </div>
                    <div>
                      <Form.Control>
                        <Select
                          {...field}
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <Select.Trigger>
                            <Select.Value placeholder="Choose language">
                              {
                                sortedLanguages.find(
                                  (language) => language.code === field.value
                                )?.display_name
                              }
                            </Select.Value>
                          </Select.Trigger>
                          <Select.Content>
                            {languages.map((language) => (
                              <Select.Item
                                key={language.code}
                                value={language.code}
                              >
                                {language.display_name}
                              </Select.Item>
                            ))}
                          </Select.Content>
                        </Select>
                      </Form.Control>
                      <Form.ErrorMessage />
                    </div>
                  </Form.Item>
                )}
              />
              <Form.Field
                control={form.control}
                name="user_insights"
                render={({ field: { value, onChange, ...rest } }) => (
                  <Form.Item>
                    <div className="flex items-center justify-between">
                      <Form.Label>User Insights</Form.Label>
                      <Form.Control>
                        <Switch
                          {...rest}
                          checked={value}
                          onCheckedChange={onChange}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint>
                      <span>
                        Share usage insights and help us improve Medusa. You can
                        read more about what we collect and how we use it in our{" "}
                        <a
                          className="underline text-ui-fg-interactive hover:text-ui-fg-interactive-hover transition-fg"
                          href="https://docs.medusajs.com/usage#admin-analytics"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          documentation
                        </a>
                        .
                      </span>
                    </Form.Hint>
                    <Form.ErrorMessage />
                  </Form.Item>
                )}
              />
            </div>
          </Form>
        </Drawer.Body>
        <Drawer.Footer>
          <div className="flex items-center justify-end gap-x-2">
            <Button variant="secondary" onClick={() => onOpenChange(false)}>
              {t("general.cancel")}
            </Button>
            <Button onClick={onSubmit}>{t("general.save")}</Button>
          </div>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  );
};
