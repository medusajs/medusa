import { XMark } from "@medusajs/icons";
import {
  Button,
  clx,
  Heading,
  IconButton,
  Input,
  Kbd,
  Text,
} from "@medusajs/ui";
import { Dialog as RadixDialog } from "radix-ui";
import { useMemo, useState } from "react";

const useDataGridShortcuts = () => {
  const shortcuts = useMemo(
    () => [
      {
        label: "Undo",
        keys: {
          Mac: ["⌘", "Z"],
          Windows: ["Ctrl", "Z"],
        },
      },
      {
        label: "Redo",
        keys: {
          Mac: ["⇧", "⌘", "Z"],
          Windows: ["Shift", "Ctrl", "Z"],
        },
      },
      {
        label: "Copy",
        keys: {
          Mac: ["⌘", "C"],
          Windows: ["Ctrl", "C"],
        },
      },
      {
        label: "Paste",
        keys: {
          Mac: ["⌘", "V"],
          Windows: ["Ctrl", "V"],
        },
      },
      {
        label: "Edit",
        keys: {
          Mac: ["↵"],
          Windows: ["Enter"],
        },
      },
      {
        label: "Delete",
        keys: {
          Mac: ["⌫"],
          Windows: ["Backspace"],
        },
      },
      {
        label: "Clear",
        keys: {
          Mac: ["Space"],
          Windows: ["Space"],
        },
      },
      {
        label: "Move Up",
        keys: {
          Mac: ["↑"],
          Windows: ["↑"],
        },
      },
      {
        label: "Move Down",
        keys: {
          Mac: ["↓"],
          Windows: ["↓"],
        },
      },
      {
        label: "Move Left",
        keys: {
          Mac: ["←"],
          Windows: ["←"],
        },
      },
      {
        label: "Move Right",
        keys: {
          Mac: ["→"],
          Windows: ["→"],
        },
      },
      {
        label: "Move Top",
        keys: {
          Mac: ["⌘", "↑"],
          Windows: ["Ctrl", "↑"],
        },
      },
      {
        label: "Move Bottom",
        keys: {
          Mac: ["⌘", "↓"],
          Windows: ["Ctrl", "↓"],
        },
      },
      {
        label: "Select Down",
        keys: {
          Mac: ["⇧", "↓"],
          Windows: ["Shift", "↓"],
        },
      },
      {
        label: "Select Up",
        keys: {
          Mac: ["⇧", "↑"],
          Windows: ["Shift", "↑"],
        },
      },
      {
        label: "Select Column Down",
        keys: {
          Mac: ["⇧", "⌘", "↓"],
          Windows: ["Shift", "Ctrl", "↓"],
        },
      },
      {
        label: "Select Column Up",
        keys: {
          Mac: ["⇧", "⌘", "↑"],
          Windows: ["Shift", "Ctrl", "↑"],
        },
      },
      {
        label: "Focus Toolbar",
        keys: {
          Mac: ["⌃", "⌥", ","],
          Windows: ["Ctrl", "Alt", ","],
        },
      },
      {
        label: "Focus Cancel",
        keys: {
          Mac: ["⌃", "⌥", "."],
          Windows: ["Ctrl", "Alt", "."],
        },
      },
    ],
    []
  );

  return shortcuts;
};

type DataGridKeyboardShortcutModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export const DataGridKeyboardShortcutModal = ({
  open,
  onOpenChange,
}: DataGridKeyboardShortcutModalProps) => {
  const [searchValue, onSearchValueChange] = useState("");
  const shortcuts = useDataGridShortcuts();

  const searchResults = useMemo(() => {
    return shortcuts.filter((shortcut) =>
      shortcut.label.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue, shortcuts]);

  return (
    <RadixDialog.Root open={open} onOpenChange={onOpenChange}>
      <RadixDialog.Trigger asChild>
        <Button size="small" variant="secondary">
          Shortcuts
        </Button>
      </RadixDialog.Trigger>
      <RadixDialog.Portal>
        <RadixDialog.Overlay
          className={clx(
            "bg-ui-bg-overlay fixed inset-0",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
          )}
        />
        <RadixDialog.Content className="bg-ui-bg-subtle shadow-elevation-modal fixed left-[50%] top-[50%] flex h-full max-h-[612px] w-full max-w-[560px] translate-x-[-50%] translate-y-[-50%] flex-col divide-y overflow-hidden rounded-lg outline-none">
          <div className="flex flex-col gap-y-3 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <RadixDialog.Title asChild>
                  <Heading>Shortcuts</Heading>
                </RadixDialog.Title>
                <RadixDialog.Description className="sr-only"></RadixDialog.Description>
              </div>
              <div className="flex items-center gap-x-2">
                <Kbd>esc</Kbd>
                <RadixDialog.Close asChild>
                  <IconButton variant="transparent" size="small">
                    <XMark />
                  </IconButton>
                </RadixDialog.Close>
              </div>
            </div>
            <div>
              <Input
                type="search"
                value={searchValue}
                autoFocus
                onChange={(e) => onSearchValueChange(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col divide-y overflow-y-auto">
            {searchResults.map((shortcut, index) => {
              return (
                <div
                  key={index}
                  className="text-ui-fg-subtle flex items-center justify-between px-6 py-3"
                >
                  <Text size="small">{shortcut.label}</Text>
                  <div className="flex items-center gap-x-1">
                    {shortcut.keys.Mac?.map((key, index) => {
                      return (
                        <div className="flex items-center gap-x-1" key={index}>
                          <Kbd>{key}</Kbd>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </RadixDialog.Content>
      </RadixDialog.Portal>
    </RadixDialog.Root>
  );
};
