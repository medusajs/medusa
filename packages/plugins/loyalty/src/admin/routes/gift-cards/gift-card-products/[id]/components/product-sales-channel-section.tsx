import { HttpTypes } from "@medusajs/types";
import { Container, Heading } from "@medusajs/ui";
import { Link } from "react-router-dom";
import { IconAvatar } from "../../../../../components/icon-avatar";
import { ChannelIcon } from "../../../../../components/icons/channel-icon";
import { Listicle } from "../../../../../components/listicle";
import { useSalesChannels } from "../../../../../hooks/api/sales-channels";

type ProductSalesChannelSectionProps = {
  product: HttpTypes.AdminProduct;
};

// TODO: The fetched sales channel doesn't contain all necessary info
export const ProductSalesChannelSection = ({
  product,
}: ProductSalesChannelSectionProps) => {
  const { count } = useSalesChannels();

  const availableInSalesChannels =
    product.sales_channels?.map((sc) => ({
      id: sc.id,
      name: sc.name,
    })) ?? [];

  return (
    <Container className="flex flex-col p-2">
      <div className="flex items-center justify-between px-3 py-3">
        <Heading level="h2">Sales Channels</Heading>

        <Link
          to={`sales-channels`}
          className="text-ui-fg-muted text-sm  txt-compact-medium-plus"
        >
          Edit
        </Link>
      </div>

      <Listicle
        labelKey={availableInSalesChannels[0]?.name ?? "Not Configured"}
        descriptionKey={`Available in ${availableInSalesChannels.length} out of ${count}`}
        icon={
          <IconAvatar
            size="small"
            className="shadow-borders-base bg-ui-bg-base"
          >
            <ChannelIcon />
          </IconAvatar>
        }
      ></Listicle>
    </Container>
  );
};
