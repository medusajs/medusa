import { useMemo } from "react";
import { Calendar, Trash } from "@medusajs/icons";
import {
  Badge,
  Container,
  Copy,
  Heading,
  StatusBadge,
  Text,
  toast,
  usePrompt,
} from "@medusajs/ui";
import { Link } from "react-router-dom";
import { AdminGiftCard } from "../../../../../types";
import { ActionMenu } from "../../../../components/action-menu";
import { SectionRow } from "../../../../components/section-row";
import { Thumbnail } from "../../../../components/thumbnail";
import { useDeleteGiftCard } from "../../../../hooks/api/gift-cards";
import { getFullDate } from "../../../../utils/date-utils";
import { formatAmount } from "../../../../utils/format-amount";
import { formatDate, getRelativeDate } from "../../../../utils/format-date";

const GiftCardGeneralSection = ({ giftCard }: { giftCard: AdminGiftCard }) => {
  const prompt = usePrompt();

  const { mutateAsync: deleteGiftCard, isPending: isDeleting } =
    useDeleteGiftCard(giftCard.id!);

  const handleDelete = async () => {
    const res = await prompt({
      title: "Delete gift card",
      description: "Are you sure? This cannot be undone.",
      verificationText: giftCard.value.toString(),
      verificationInstruction: "Confirmation",
      confirmText: "Delete",
      cancelText: "Cancel",
    });

    if (!res) {
      return;
    }

    await deleteGiftCard(undefined, {
      onSuccess: () => toast.success("Gift card deleted successfully"),
      onError: (error) => toast.error(error.message),
    });
  };

  const hasGiftCardExpired = useMemo(() => {
    return giftCard.expires_at && new Date(giftCard.expires_at) < new Date();
  }, [giftCard.expires_at]);

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <div>
          <div className="flex items-center gap-x-1">
            <Heading>#{giftCard.code}</Heading>
            <Copy content={`${giftCard.code}`} className="text-ui-fg-muted" />
          </div>

          <Text size="small" className="text-ui-fg-subtle">
            {getFullDate({
              date: giftCard.created_at,
              includeTime: true,
            })}
          </Text>
        </div>

        <div className="flex items-center gap-x-4">
          {hasGiftCardExpired && (
            <StatusBadge color="orange">Expired</StatusBadge>
          )}
          <ActionMenu
            groups={[
              {
                actions: [
                  {
                    icon: <Calendar />,
                    label: "Edit expiration date",
                    to: "expiration",
                  },
                ],
              },
              {
                actions: [
                  {
                    icon: <Trash />,
                    label: "Delete",
                    onClick: handleDelete,
                    disabled: isDeleting || true,
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      {giftCard.line_item?.product && (
        <SectionRow
          title="Gift card product"
          value={
            <Link
              to={`/products/${giftCard.line_item?.product?.id}`}
              className="text-ui-fg-base text-sm"
            >
              <div className="flex h-full w-full max-w-[250px] items-center gap-x-3 overflow-hidden">
                <div className="w-fit flex-shrink-0">
                  <Thumbnail
                    size="small"
                    src={giftCard.line_item?.product?.thumbnail}
                  />
                </div>
                <span
                  title={giftCard.line_item?.product?.title}
                  className="truncate"
                >
                  {giftCard.line_item?.product?.title}
                </span>
              </div>
            </Link>
          }
        />
      )}

      <SectionRow
        title="Currency"
        value={
          <Badge size="xsmall" className="text-ui-fg-base rounded-xl px-2">
            {giftCard.currency_code.toUpperCase()}
          </Badge>
        }
      />

      <SectionRow
        title="Value"
        value={formatAmount(giftCard.value, giftCard.currency_code)}
      />

      <SectionRow
        title="Expiration Date"
        value={formatDate(giftCard.expires_at)}
      />

      <SectionRow
        title="Creation Date"
        value={getRelativeDate(giftCard.created_at)}
      />
    </Container>
  );
};

export default GiftCardGeneralSection;
