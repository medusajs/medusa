import { Prompt } from "@medusajs/ui";
import { PropsWithChildren } from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import { useBlocker } from "react-router-dom";
import { Form } from "../../form";

type RouteModalFormProps<TFieldValues extends FieldValues> = PropsWithChildren<{
  form: UseFormReturn<TFieldValues>;
  blockSearchParams?: boolean;
  onClose?: (isSubmitSuccessful: boolean) => void;
}>;

export const RouteModalForm = <TFieldValues extends FieldValues = any>({
  form,
  blockSearchParams: blockSearch = false,
  children,
  onClose,
}: RouteModalFormProps<TFieldValues>) => {
  const {
    formState: { isDirty },
  } = form;

  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    const { isSubmitSuccessful } = nextLocation.state || {};

    if (isSubmitSuccessful) {
      onClose?.(true);
      return false;
    }

    const isPathChanged = currentLocation.pathname !== nextLocation.pathname;
    const isSearchChanged = currentLocation.search !== nextLocation.search;

    if (blockSearch) {
      const ret = isDirty && (isPathChanged || isSearchChanged);

      if (!ret) {
        onClose?.(isSubmitSuccessful);
      }

      return ret;
    }

    const ret = isDirty && isPathChanged;

    if (!ret) {
      onClose?.(isSubmitSuccessful);
    }

    return ret;
  });

  const handleCancel = () => {
    blocker?.reset?.();
  };

  const handleContinue = () => {
    blocker?.proceed?.();
    onClose?.(false);
  };

  return (
    <Form {...form}>
      {children}
      <Prompt open={blocker.state === "blocked"} variant="confirmation">
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>Unsaved Changes</Prompt.Title>
            <Prompt.Description>
              You have unsaved changes. Are you sure you want to leave?
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={handleCancel} type="button">
              Cancel
            </Prompt.Cancel>
            <Prompt.Action onClick={handleContinue} type="button">
              Continue
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </Form>
  );
};
