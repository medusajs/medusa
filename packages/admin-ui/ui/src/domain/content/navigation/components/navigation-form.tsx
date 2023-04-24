import { FormProvider, useForm } from "react-hook-form"
import { NavigationItem } from "@medusajs/medusa"
import ActionTable from "../../../../components/organisms/action-table"
import BodyCard from "../../../../components/organisms/body-card"
import { useAdminUpdateNavigationItems } from "../../../../hooks/admin/navigation/mutations"
import useNotification from "../../../../hooks/use-notification"

export interface NavigationFormValues {
  header: NavigationItem[]
  footer: NavigationItem[]
}

const NavigationForm = ({ navItems }) => {
  const notification = useNotification()
  const updateNavigationItems = useAdminUpdateNavigationItems({
    onError: ({ response }) => {
      notification(
        "Error saving navigation items",
        response.data?.message || "",
        "error"
      )
    },
  })

  const headerNavItems = navItems?.filter((item) => item.location === "header")
  const footerNavItems = navItems?.filter((item) => item.location === "footer")

  const defaultValues = {
    header: headerNavItems.map(({ id, ...item }) => item),
    footer: footerNavItems.map(({ id, ...item }) => item),
  }

  const formMethods = useForm({ defaultValues })

  const handleSubmit = async (values: NavigationFormValues) => {
    const updated: string[] = []

    if (values.header) {
      await updateNavigationItems.mutateAsync({
        location: "header",
        items: values.header,
      })
      updated.push("header")
    }

    if (values.footer) {
      await updateNavigationItems.mutateAsync({
        location: "footer",
        items: values.footer,
      })
      updated.push("footer")
    }

    notification(
      "Navigation items saved",
      `Saved ${updated.join(" and ")} navigation items`,
      "success"
    )
  }

  const handleCancel = () => formMethods.reset(defaultValues)

  return (
    <BodyCard
      title="Navigation"
      events={[
        {
          label: "Save",
          type: "button",
          onClick: formMethods.handleSubmit(handleSubmit),
          disabled: updateNavigationItems.isLoading,
        },
        {
          label: "Cancel Changes",
          type: "button",
          onClick: handleCancel,
          disabled: updateNavigationItems.isLoading,
        },
      ]}
    >
      <div className="-mt-4 mb-2 inter-small-regular pt-1.5 text-grey-50 prose">
        <p>Here are some helpful URLs to get you started:</p>
        <ul>
          <li>
            Home{" "}
            <code className="text-orange-500 bg-orange-100 px-1 rounded before:content-none after:content-none">
              /
            </code>
          </li>
          <li>
            Collection List{" "}
            <code className="text-orange-500 bg-orange-100 px-1 rounded before:content-none after:content-none">
              /collections/(collection handle)
            </code>
          </li>
          <li>
            Product List{" "}
            <code className="text-orange-500 bg-orange-100 px-1 rounded before:content-none after:content-none">
              /products
            </code>
          </li>
          <li>
            Product Page{" "}
            <code className="text-orange-500 bg-orange-100 px-1 rounded before:content-none after:content-none">
              /products/(product handle)
            </code>
          </li>
          <li>
            Blog List{" "}
            <code className="text-orange-500 bg-orange-100 px-1 rounded before:content-none after:content-none">
              /blog
            </code>
          </li>
        </ul>
      </div>

      <hr className="border-grey-20 my-6" />

      <FormProvider {...formMethods}>
        <div className="pb-4">
          <ActionTable name="header" label="Header Navigation" />

          <hr className="border-grey-20 my-6" />

          <ActionTable
            name="footer"
            label="Footer Navigation"
            className="mt-6"
          />
        </div>
      </FormProvider>
    </BodyCard>
  )
}

export default NavigationForm
