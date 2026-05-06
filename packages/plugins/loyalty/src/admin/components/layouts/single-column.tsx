export type SingleColumnLayoutProps = {
  children: React.ReactNode;
};

export const SingleColumnLayout = ({ children }: SingleColumnLayoutProps) => {
  return <div className="flex flex-col gap-y-3">{children}</div>;
};
