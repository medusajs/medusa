import { MagnifyingGlass, XMarkMini } from "@medusajs/icons";
import { IconButton } from "@medusajs/ui";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";

export const Search = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        setOpen((prev) => !prev);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <IconButton variant="transparent" className="text-ui-fg-muted">
          <MagnifyingGlass />
        </IconButton>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="bg-ui-bg-overlay fixed inset-0" />
        <Dialog.Content className="fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] bg-ui-bg-base shadow-elevation-modal rounded-xl overflow-hidden max-w-[640px] max-h-[480px] w-full h-full">
          <div className="flex items-center gap-x-4 px-4 py-[18px] border-b border-ui-border-base">
            <div className="flex items-center gap-x-3 flex-1">
              <MagnifyingGlass className="text-ui-fg-muted" />
              <input
                type="text"
                className="flex-1 txt-compact-medium"
                placeholder="Search"
              />
            </div>
            <IconButton variant="transparent" className="lg:hidden">
              <XMarkMini />
            </IconButton>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
