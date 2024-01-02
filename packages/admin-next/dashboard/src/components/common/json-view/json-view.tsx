import {
  ArrowsPointingOut,
  CheckCircleMiniSolid,
  SquareTwoStackMini,
  XMarkMini,
} from "@medusajs/icons";
import {
  Badge,
  Container,
  Drawer,
  Heading,
  IconButton,
  Kbd,
} from "@medusajs/ui";
import Primitive from "@uiw/react-json-view";
import { CSSProperties, Suspense } from "react";

type JsonViewProps = {
  data: object;
  root?: string;
};

// TODO: The primitive component is not optimal for our use case, so we should consider rolling our own component
export const JsonView = ({ data, root }: JsonViewProps) => {
  const numberOfKeys = Object.keys(data).length;

  return (
    <Container className="flex items-center justify-between py-6">
      <div className="flex items-center gap-x-4">
        <Heading level="h2">JSON</Heading>
        <Badge>{numberOfKeys} keys</Badge>
      </div>
      <Drawer>
        <Drawer.Trigger asChild>
          <IconButton variant="transparent" className="text-ui-fg-subtle">
            <ArrowsPointingOut />
          </IconButton>
        </Drawer.Trigger>
        <Drawer.Content className="dark overflow-hidden shadow-none border-ui-code-border border max-md:inset-x-2 max-md:max-w-[calc(100%-16px)] bg-ui-code-bg-base text-ui-code-text-base">
          <div className="bg-ui-code-bg-header border-b border-ui-code-border py-6 px-8 flex items-center justify-between">
            <div className="flex items-center gap-x-4">
              <Heading>JSON</Heading>
              <Badge>{numberOfKeys} keys</Badge>
            </div>
            <div className="flex items-center gap-x-2">
              <Kbd>esc</Kbd>
              <Drawer.Close asChild>
                <IconButton variant="transparent" className="text-ui-fg-subtle">
                  <XMarkMini />
                </IconButton>
              </Drawer.Close>
            </div>
          </div>
          <Drawer.Body className="p-4 overflow-auto">
            <Suspense fallback={<div>Loading...</div>}>
              <Primitive
                value={data}
                displayDataTypes={false}
                keyName={root}
                style={
                  {
                    "--w-rjv-font-family": "Roboto Mono, monospace",
                    "--w-rjv-line-color": "#2E3035",
                    "--w-rjv-curlybraces-color": "#ADB1B8",
                    "--w-rjv-key-string": "#A78BFA",
                    "--w-rjv-info-color": "#FBBF24",
                    "--w-rjv-type-string-color": "#34D399",
                    "--w-rjv-quotes-string-color": "#34D399",
                    "--w-rjv-type-boolean-color": "#FBBF24",
                    "--w-rjv-type-int-color": "#60A5FA",
                    "--w-rjv-type-float-color": "#60A5FA",
                    "--w-rjv-type-bigint-color": "#60A5FA",
                    "--w-rjv-key-number": "#60A5FA",
                  } as CSSProperties
                }
                collapsed={1}
              >
                <Primitive.Copied
                  // @ts-expect-error - types are missing the 'data-copied' prop
                  render={({ "data-copied": copied, onClick }) => {
                    if (copied) {
                      return (
                        <CheckCircleMiniSolid className="cursor-pointer align-middle text-ui-fg-subtle" />
                      );
                    }
                    return (
                      <SquareTwoStackMini
                        className="align-middle cursor-pointer text-ui-fg-subtle"
                        onClick={onClick}
                      />
                    );
                  }}
                />
                <Primitive.Quote render={() => " "} />
                <Primitive.Null
                  render={() => (
                    <span className="text-ui-tag-red-text">null</span>
                  )}
                />
                <Primitive.CountInfo
                  render={(_props, { value }) => {
                    return (
                      <span className="text-ui-tag-neutral-text ml-2">
                        {Object.keys(value as object).length} items
                      </span>
                    );
                  }}
                />
              </Primitive>
            </Suspense>
          </Drawer.Body>
        </Drawer.Content>
      </Drawer>
    </Container>
  );
};
