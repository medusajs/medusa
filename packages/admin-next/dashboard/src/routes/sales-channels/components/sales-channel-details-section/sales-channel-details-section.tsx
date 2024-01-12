import { zodResolver } from "@hookform/resolvers/zod"
import { EllipsisHorizontal, PencilSquare, Trash } from "@medusajs/icons"
import { SalesChannel } from "@medusajs/medusa"
import {
  Button,
  Container,
  Drawer,
  DropdownMenu,
  Heading,
  IconButton,
  Input,
  StatusBadge,
  Switch,
  Text,
  Textarea,
} from "@medusajs/ui"
import { useAdminUpdateSalesChannel } from "medusa-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import { useTranslation } from "react-i18next"
import * as zod from "zod"

import { Form } from "../../../../components/common/form"

type Props = {
  salesChannel: SalesChannel
}

export const SalesChannelDetailsSection = ({ salesChannel }: Props) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { t } = useTranslation()

  return (
    <div>
      <Container className="p-0">
        <div className="flex items-center justify-between px-8 py-6">
          <div>
            <Heading>{salesChannel.name}</Heading>
            <Text size="small" className="text-ui-fg-subtle">
              {salesChannel.description}
            </Text>
          </div>
          <div className="flex items-center gap-x-2">
            <StatusBadge color={salesChannel.is_disabled ? "red" : "green"}>
              {t(
                `general.${salesChannel.is_disabled ? "disabled" : "enabled"}`
              )}
            </StatusBadge>
            <DropdownMenu>
              <DropdownMenu.Trigger asChild>
                <IconButton variant="transparent">
                  <EllipsisHorizontal />
                </IconButton>
              </DropdownMenu.Trigger>
              <DropdownMenu.Content>
                <DropdownMenu.Item
                  className="gap-x-2"
                  onClick={() => setDrawerOpen(!drawerOpen)}
                >
                  <PencilSquare className="text-ui-fg-subtle" />
                  <span>{t("general.edit")}</span>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item className="gap-x-2">
                  <Trash className="text-ui-fg-subtle" />
                  <span>{t("general.delete")}</span>
                </DropdownMenu.Item>
              </DropdownMenu.Content>
            </DropdownMenu>
          </div>
        </div>
      </Container>
      <EditSalesChannelDetailsDrawer
        salesChannel={salesChannel}
        open={drawerOpen}
        setOpen={setDrawerOpen}
      />
    </div>
  )
}

const EditSalesChannelDetailsSchema = zod.object({
  name: zod.string().min(1),
  description: zod.string().optional(),
  is_active: zod.boolean(),
})

type DrawerProps = {
  salesChannel: SalesChannel
  open: boolean
  setOpen: (open: boolean) => void
}

const EditSalesChannelDetailsDrawer = ({
  salesChannel,
  open,
  setOpen,
}: DrawerProps) => {
  const form = useForm<zod.infer<typeof EditSalesChannelDetailsSchema>>({
    defaultValues: {
      name: salesChannel.name,
      description: salesChannel.description ?? "",
      is_active: !salesChannel.is_disabled,
    },
    resolver: zodResolver(EditSalesChannelDetailsSchema),
  })
  const { mutateAsync, isLoading } = useAdminUpdateSalesChannel(salesChannel.id)
  const { t } = useTranslation()

  const onSubmit = form.handleSubmit(async (values) => {
    await mutateAsync(
      {
        name: values.name,
        description: values.description ?? undefined,
        is_disabled: !values.is_active,
      },
      {
        onSuccess: () => {
          setOpen(false)
        },
      }
    )
  })

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <Form {...form}>
        <Drawer.Content>
          <Drawer.Header>
            <Heading>{t("salesChannels.editSalesChannel")}</Heading>
          </Drawer.Header>
          <Drawer.Body className="flex flex-col gap-y-8">
            <Form.Field
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label>{t("fields.name")}</Form.Label>
                    <Form.Control>
                      <Input {...field} size="small" />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="description"
              render={({ field }) => {
                return (
                  <Form.Item>
                    <Form.Label optional>{t("fields.description")}</Form.Label>
                    <Form.Control>
                      <Textarea {...field} />
                    </Form.Control>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
            <Form.Field
              control={form.control}
              name="is_active"
              render={({ field: { onChange, value, ...field } }) => {
                return (
                  <Form.Item>
                    <div className="flex items-center justify-between">
                      <Form.Label>{t("general.enabled")}</Form.Label>
                      <Form.Control>
                        <Switch
                          onCheckedChange={onChange}
                          checked={value}
                          {...field}
                        />
                      </Form.Control>
                    </div>
                    <Form.Hint>{t("salesChannels.isEnabledHint")}</Form.Hint>
                    <Form.ErrorMessage />
                  </Form.Item>
                )
              }}
            />
          </Drawer.Body>
          <Drawer.Footer>
            <div className="flex items-center justify-end gap-x-2">
              <Drawer.Close asChild>
                <Button variant="secondary">{t("general.cancel")}</Button>
              </Drawer.Close>
              <Button onClick={onSubmit} isLoading={isLoading}>
                {t("general.save")}
              </Button>
            </div>
          </Drawer.Footer>
        </Drawer.Content>
      </Form>
    </Drawer>
  )
}
