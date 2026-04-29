import { ExclamationCircle, PlusMini } from "@medusajs/icons";
import { Button, clx, Text } from "@medusajs/ui";
import { Link } from "react-router-dom";

type ActionProps = {
  action?: {
    to: string;
    label: string;
  };
};

type NoRecordsProps = {
  title?: string;
  message?: string;
  className?: string;
  buttonVariant?: string;
  icon?: React.ReactNode;
} & ActionProps;

const DefaultButton = ({ action }: ActionProps) =>
  action && (
    <Link to={action.to}>
      <Button variant="secondary" size="small">
        {action.label}
      </Button>
    </Link>
  );

const TransparentIconLeftButton = ({ action }: ActionProps) =>
  action && (
    <Link to={action.to}>
      <Button variant="transparent" className="text-ui-fg-interactive">
        <PlusMini /> {action.label}
      </Button>
    </Link>
  );

export const NoRecords = ({
  title,
  message,
  action,
  className,
  buttonVariant = "default",
  icon = <ExclamationCircle className="text-ui-fg-subtle" />,
}: NoRecordsProps) => {
  return (
    <div
      className={clx(
        "flex h-[100px] w-full flex-col items-center justify-center gap-y-4",
        className
      )}
    >
      <div className="flex flex-col items-center gap-y-3">
        {icon}

        <div className="flex flex-col items-center gap-y-1">
          <Text size="small" leading="compact" weight="plus">
            {title ?? "No records"}
          </Text>

          <Text size="small" className="text-ui-fg-muted text-center">
            {message ?? "There are no records to show"}
          </Text>
        </div>
      </div>

      {buttonVariant === "default" && <DefaultButton action={action} />}
      {buttonVariant === "transparentIconLeft" && (
        <TransparentIconLeftButton action={action} />
      )}
    </div>
  );
};
