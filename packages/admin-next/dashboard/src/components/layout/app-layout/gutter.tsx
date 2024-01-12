import { PropsWithChildren } from "react";

export const Gutter = ({ children }: PropsWithChildren) => {
  return (
    <div className="w-full max-w-[1200px] flex flex-col gap-y-4">
      {children}
    </div>
  );
};
