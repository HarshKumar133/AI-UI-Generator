import * as React from "react";
import { GripVertical } from "lucide-react";

import { cn } from "@/lib/utils";

type ResizablePanelGroupProps = React.HTMLAttributes<HTMLDivElement> & {
  direction?: "horizontal" | "vertical";
};

const ResizablePanelGroup: React.FC<ResizablePanelGroupProps> = ({
  className,
  direction,
  ...props
}) => (
  <div
    data-panel-group-direction={direction}
    className={cn(
      "flex h-full w-full data-[panel-group-direction=vertical]:flex-col",
      className,
    )}
    {...props}
  />
);

const ResizablePanel: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => (
  <div
    className={cn("flex-1 min-w-0 min-h-0", className)}
    {...props}
  />
);

type ResizableHandleProps = React.HTMLAttributes<HTMLDivElement> & {
  withHandle?: boolean;
};

const ResizableHandle: React.FC<ResizableHandleProps> = ({
  withHandle,
  className,
  ...props
}) => (
  <div
    className={cn(
      "relative flex w-px items-center justify-center bg-border data-[panel-group-direction=vertical]:h-px data-[panel-group-direction=vertical]:w-full",
      className,
    )}
    {...props}
  >
    {withHandle && (
      <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
        <GripVertical className="h-2.5 w-2.5" />
      </div>
    )}
  </div>
);

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
