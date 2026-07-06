import { RouteFocusModal } from "../../../components/modals";
import { useStore } from "../../../hooks/api/store";
import { GiftCardCreateForm } from "../components/gift-card-create-form/gift-card-create-form";

const GiftCardCreate = () => {
  const { store, isLoading } = useStore({});

  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">Create Gift Card</span>
      </RouteFocusModal.Title>

      <RouteFocusModal.Description asChild>
        <span className="sr-only">Create a new gift card</span>
      </RouteFocusModal.Description>

      {!isLoading && <GiftCardCreateForm store={store!} />}
    </RouteFocusModal>
  );
};

export default GiftCardCreate;
