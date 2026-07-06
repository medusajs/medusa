import { TaxExclusive, TaxInclusive } from "@medusajs/icons";
import { Tooltip } from "@medusajs/ui";

type IncludesTaxTooltipProps = {
  includesTax?: boolean;
};

export const IncludesTaxTooltip = ({
  includesTax,
}: IncludesTaxTooltipProps) => {
  return (
    <Tooltip
      maxWidth={999}
      content={includesTax ? "Includes Tax" : "Excludes Tax"}
    >
      {includesTax ? (
        <TaxInclusive className="text-ui-fg-muted shrink-0" />
      ) : (
        <TaxExclusive className="text-ui-fg-muted shrink-0" />
      )}
    </Tooltip>
  );
};
