import copy from "copy-to-clipboard";
import { useState } from "react";

import { clx, toast, Tooltip } from "@medusajs/ui";

type DisplayIdProps = {
  id: string;
  className?: string;
};

function DisplayId({ id, className }: DisplayIdProps) {
  const [open, setOpen] = useState(false);

  const onClick = () => {
    copy(id);
    toast.success("Copied to clipboard");
  };

  return (
    <Tooltip maxWidth={260} content={id} open={open} onOpenChange={setOpen}>
      <span onClick={onClick} className={clx("cursor-pointer", className)}>
        #{id.slice(-7)}
      </span>
    </Tooltip>
  );
}

export default DisplayId;
