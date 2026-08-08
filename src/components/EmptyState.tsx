import type { ReactNode } from "react";

interface EmptyStateProps {
  message: string;
  action?: ReactNode;
}

export default function EmptyState({ message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center sm:py-20">
      <p className="text-lg font-semibold text-foreground sm:text-xl">
        {message}
      </p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
