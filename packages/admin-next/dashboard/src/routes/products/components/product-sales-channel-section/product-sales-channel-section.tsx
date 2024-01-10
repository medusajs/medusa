import { Channels } from "@medusajs/icons";
import { Product } from "@medusajs/medusa";
import { Container, Heading, Text } from "@medusajs/ui";
import { useAdminSalesChannels } from "medusa-react";
import { Trans, useTranslation } from "react-i18next";

type ProductSalesChannelSectionProps = {
  product: Product;
};

export const ProductSalesChannelSection = ({
  product,
}: ProductSalesChannelSectionProps) => {
  const { count } = useAdminSalesChannels();
  const { t } = useTranslation();

  const availableInSalesChannels =
    product.sales_channels?.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })) ?? [];

  return (
    <div>
      <Container className="flex flex-col gap-y-4">
        <div>
          <Heading level="h2">{t("fields.sales_channels")}</Heading>
        </div>
        <div>
          <div className="w-10 h-10 rounded-[8px] bg-ui-bg-base shadow-borders-base flex items-center justify-center">
            <div className="h-8 w-8 rounded-[4px] bg-ui-bg-component flex items-center justify-center">
              <Channels className="text-ui-fg-subtle" />
            </div>
          </div>
        </div>
        <div>
          <Text className="text-ui-fg-subtle">
            <Trans
              i18nKey="products.availableInSalesChannels"
              values={{
                x: availableInSalesChannels.length,
                y: count ?? 0,
              }}
              components={[
                <span className="text-ui-fg-base txt-compact-medium-plus" />,
                <span className="text-ui-fg-base txt-compact-medium-plus" />,
              ]}
            />
          </Text>
        </div>
      </Container>
    </div>
  );
};
