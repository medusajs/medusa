import { ReactNode } from "react";
import { Link } from "react-router-dom";

import { TriangleRightMini } from "@medusajs/icons";
import { Text } from "@medusajs/ui";

export interface SidebarLinkProps {
  to: string;
  labelKey: string;
  descriptionKey: string;
  icon: ReactNode;
  children?: ReactNode;
}

export const SidebarLink = ({
  to,
  labelKey,
  descriptionKey,
  icon,
  children,
}: SidebarLinkProps) => {
  return (
    <Link to={to} className="group outline-none">
      <div className="flex flex-col gap-2 px-2 pb-2">
        <div className="shadow-elevation-card-rest bg-ui-bg-component transition-fg hover:bg-ui-bg-component-hover active:bg-ui-bg-component-pressed group-focus-visible:shadow-borders-interactive-with-active rounded-md px-4 py-2">
          <div className="flex items-center gap-4">
            {icon && <div>{icon}</div>}
            <div className="flex flex-1 flex-col">
              <Text size="small" leading="compact" weight="plus">
                {labelKey}
              </Text>
              <Text
                size="small"
                leading="compact"
                className="text-ui-fg-subtle"
              >
                {descriptionKey}
              </Text>
            </div>
            <div className="flex items-center justify-center">
              {children ? (
                children
              ) : (
                <TriangleRightMini className="text-ui-fg-muted" />
              )}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};
