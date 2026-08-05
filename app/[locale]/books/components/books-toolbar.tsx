"use client";

import { useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/i18n/navigation";
import { Filters, type FiltersState } from "@/components/Filters";

export function BooksToolbar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const initialSearch = searchParams.get("q") ?? "";
  const initialStatus = searchParams.get("status") ?? "all";

  const handleChange = (state: FiltersState) => {
    startTransition(() => {
      const params = new URLSearchParams();
      if (state.search) params.set("q", state.search);
      if (state.status && state.status !== "all") {
        params.set("status", state.status);
      }
      params.set("page", "1");

      const query = params.toString();
      router.replace(query ? `${pathname}?${query}` : pathname);
    });
  };

  return (
    <Filters
      initialSearch={initialSearch}
      initialStatus={initialStatus}
      onChange={handleChange}
      pending={isPending}
    />
  );
}
