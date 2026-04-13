import { Container, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";
import { AdminGiftCard } from "../../../../../types";
import { Header } from "../../../../components/header";

const GiftCardNoteSection = ({ giftCard }: { giftCard: AdminGiftCard }) => {
  if (!giftCard) {
    return;
  }

  return (
    <Container className="p-0">
      <div className="flex items-center justify-between">
        <Header title="Note" />

        <Link to="note" className="text-ui-fg-muted text-sm px-6">
          Edit note
        </Link>
      </div>

      {giftCard.note && (
        <div className="flex flex-col gap-2 px-2 pb-2">
          <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg hover:bg-ui-bg-component-hover active:bg-ui-bg-component-pressed group-focus-visible:shadow-borders-interactive-with-active rounded-md px-4 py-2">
            <div className="flex items-center gap-4">
              <div className="flex flex-1 flex-col">
                <Text
                  size="small"
                  leading="compact"
                  className="text-ui-fg-subtle"
                >
                  {giftCard.note ?? ""}
                </Text>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default GiftCardNoteSection;
