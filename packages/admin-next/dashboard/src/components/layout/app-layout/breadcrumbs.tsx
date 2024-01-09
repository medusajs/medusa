import { TriangleRightMini } from "@medusajs/icons";
import { clx } from "@medusajs/ui";
import { Link, UIMatch, useMatches } from "react-router-dom";

type BreadcrumbProps = React.ComponentPropsWithoutRef<"ol">;

export const Breadcrumbs = ({ className, ...props }: BreadcrumbProps) => {
  const matches = useMatches() as unknown as UIMatch<
    unknown,
    { crumb?: (data?: unknown) => string }
  >[];

  const crumbs = matches
    .filter((match) => Boolean(match.handle?.crumb))
    .map((match) => {
      const handle = match.handle;

      return {
        label: handle.crumb!(match.data),
        path: match.pathname,
      };
    });

  if (crumbs.length < 2) {
    return null;
  }

  return (
    <ol
      className={clx("flex items-center gap-x-1 text-ui-fg-muted", className)}
      {...props}
    >
      {crumbs.map((crumb, index) => {
        const isLast = index === crumbs.length - 1;

        return (
          <li
            key={index}
            className="txt-compact-small-plus flex items-center gap-x-1"
          >
            {!isLast ? (
              <Link to={crumb.path}>{crumb.label}</Link>
            ) : (
              <span key={index}>{crumb.label}</span>
            )}
            {!isLast && <TriangleRightMini />}
          </li>
        );
      })}
    </ol>
  );
};
