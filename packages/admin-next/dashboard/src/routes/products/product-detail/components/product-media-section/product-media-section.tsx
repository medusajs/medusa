import { ArrowsPointingOut, PencilSquare } from "@medusajs/icons"
import { Product } from "@medusajs/medusa"
import {
  Badge,
  Checkbox,
  CommandBar,
  Container,
  Heading,
  clx,
} from "@medusajs/ui"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ActionMenu } from "../../../../../components/common/action-menu"

type ProductMedisaSectionProps = {
  product: Product
}

export const ProductMediaSection = ({ product }: ProductMedisaSectionProps) => {
  const [selection, setSelection] = useState<Record<string, boolean>>({})
  const { t } = useTranslation()

  const handleSelection = (id: string) => {
    setSelection((prev) => {
      if (prev[id]) {
        const { [id]: _, ...rest } = prev
        return rest
      } else {
        return { ...prev, [id]: true }
      }
    })
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Media</Heading>
        <ActionMenu
          groups={[
            {
              actions: [
                {
                  label: t("general.edit"),
                  icon: <PencilSquare />,
                  to: "media",
                },
              ],
            },
          ]}
        />
      </div>
      <div className="px-6 py-4">
        {product.images?.length > 0 && (
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((i) => {
              const isThumbnail = i.url === product.thumbnail

              return (
                <div
                  className={clx(
                    "group relative flex aspect-square w-full cursor-pointer items-center justify-center overflow-hidden rounded-md"
                  )}
                  key={i.id}
                >
                  <div className="bg-ui-bg-overlay transition-fg invisible absolute inset-0 flex items-center justify-center rounded-md opacity-0 group-hover:visible group-hover:opacity-100">
                    <ArrowsPointingOut className="text-ui-fg-on-color" />
                  </div>
                  {isThumbnail && (
                    <Badge
                      rounded="full"
                      size="2xsmall"
                      color="blue"
                      className="absolute left-2 top-2"
                    >
                      Thumbnail
                    </Badge>
                  )}
                  <div
                    className={clx(
                      "transition-fg invisible absolute right-2 top-2 opacity-0 group-hover:visible group-hover:opacity-100",
                      {
                        "visible opacity-100":
                          Object.keys(selection).length > 0,
                      }
                    )}
                  >
                    <Checkbox
                      checked={selection[i.id] || false}
                      onCheckedChange={() => handleSelection(i.id)}
                    />
                  </div>
                  <img
                    src={i.url}
                    alt={`${product.title} image`}
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
      <CommandBar open={!!Object.keys(selection).length}>
        <CommandBar.Bar>
          <CommandBar.Value>
            {t("general.countSelected", {
              count: Object.keys(selection).length,
            })}
          </CommandBar.Value>
          <CommandBar.Seperator />
          <CommandBar.Command
            action={() => {}}
            label={t("general.delete")}
            shortcut="d"
          />
        </CommandBar.Bar>
      </CommandBar>
    </Container>
  )
}
