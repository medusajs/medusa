import { RouteFocusModal } from "../../../components/modals";
import { StoreCreditAccountCreateForm } from "./components/store-credit-account-create-form/store-credit-account-create-form";

const StoreCreditAccountCreate = () => {
  return (
    <RouteFocusModal>
      <RouteFocusModal.Title asChild>
        <span className="sr-only">Create Store Credit Account</span>
      </RouteFocusModal.Title>

      <RouteFocusModal.Description asChild>
        <span className="sr-only">Create a new store credit account</span>
      </RouteFocusModal.Description>

      <StoreCreditAccountCreateForm />
    </RouteFocusModal>
  );
};

export default StoreCreditAccountCreate;
