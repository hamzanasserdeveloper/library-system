import { BrandPanel } from "./brand-panel";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto grid w-full max-w-5xl gap-6 lg:grid-cols-2 lg:items-stretch">
      <BrandPanel />
      <div className="flex flex-col justify-center">{children}</div>
    </div>
  );
}
