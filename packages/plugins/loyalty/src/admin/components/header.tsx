import { InformationCircleSolid } from "@medusajs/icons";
import { Button, Heading, Text, Tooltip } from "@medusajs/ui";
import React from "react";
import { Link, LinkProps } from "react-router-dom";
import { ActionMenu, ActionMenuProps } from "./action-menu";

export type HeadingProps = {
  title: string;
  subtitle?: string;
  tooltip?: React.ReactNode;
  actions?: (
    | {
        type: "button";
        props: React.ComponentProps<typeof Button>;
        link?: LinkProps;
      }
    | {
        type: "action-menu";
        props: ActionMenuProps;
      }
    | {
        type: "custom";
        children: React.ReactNode;
      }
  )[];
};

export const Header = ({
  title,
  subtitle,
  actions = [],
  tooltip,
}: HeadingProps) => {
  return (
    <div className="flex px-6 py-4">
      <div className="flex justify-between w-full">
        <div className="flex flex-col">
          <Heading level="h2">{title}</Heading>
          {subtitle && (
            <Text className="text-ui-fg-subtle" size="small">
              {subtitle}
            </Text>
          )}
        </div>

        {tooltip && (
          <Tooltip content={tooltip}>
            <InformationCircleSolid className="text-ui-fg-muted" />
          </Tooltip>
        )}
      </div>
      {actions.length > 0 && (
        <div className="flex items-center justify-center gap-x-2">
          {actions.map((action, index) => (
            <>
              {action.type === "button" && (
                <Button
                  {...action.props}
                  size={action.props.size || "small"}
                  key={index}
                >
                  <>
                    {action.props.children}
                    {action.link && <Link {...action.link} />}
                  </>
                </Button>
              )}
              {action.type === "action-menu" && (
                <ActionMenu {...action.props} />
              )}
              {action.type === "custom" && action.children}
            </>
          ))}
        </div>
      )}
    </div>
  );
};
