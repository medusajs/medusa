# Admin Customizations Translations

The Medusa Admin dashboard supports multiple languages for its interface. Medusa uses [react-i18next](https://react.i18next.com/) to manage translations in the admin dashboard.

To add translations, create JSON translation files for each language under the `src/admin/i18n/json` directory. For example, create the `src/admin/i18n/json/en.json` file with the following content:

```json
{
  "brands": {
    "title": "Brands",
    "description": "Manage your product brands"
  },
  "done": "Done"
}
```

Then, export the translations in `src/admin/i18n/index.ts`:

```ts
import en from "./json/en.json" with { type: "json" }

export default {
  en: {
    translation: en,
  },
}
```

Finally, use translations in your admin widgets and routes using the `useTranslation` hook:

```tsx
import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { Button, Container, Heading } from "@medusajs/ui"
import { useTranslation } from "react-i18next"

const ProductWidget = () => {
  const { t } = useTranslation()
  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">{t("brands.title")}</Heading>
        <p>{t("brands.description")}</p>
      </div>
      <div className="flex justify-end px-6 py-4">
        <Button variant="primary">{t("done")}</Button>
      </div>
    </Container>
  )
}

export const config = defineWidgetConfig({
  zone: "product.details.before",
})

export default ProductWidget
```

Learn more about translating admin extensions in the [Translate Admin Customizations](https://docs.medusajs.com/learn/fundamentals/admin/translations) documentation.