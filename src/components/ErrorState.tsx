import type { ReactNode } from "react";

interface ErrorStateProps {
  message: string;
  action?: ReactNode;
}

export default function ErrorState({ message, action }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 py-16 text-center sm:py-20">
      <p className="text-lg font-semibold text-danger sm:text-xl">{message}</p>
      {action ? <div className="mt-1">{action}</div> : null}
    </div>
  );
}
