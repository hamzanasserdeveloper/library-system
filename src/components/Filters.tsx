"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

export interface FiltersState {
  search: string;
  status: string;
}

interface FiltersProps {
  initialSearch: string;
  initialStatus: string;
  onChange: (state: FiltersState) => void;
  pending?: boolean;
}

const SEARCH_DEBOUNCE_MS = 300;

export function Filters({
  initialSearch,
  initialStatus,
  onChange,
  pending = false,
}: FiltersProps) {
  const tBooks = useTranslations("books");
  const tStatus = useTranslations("status");

  const [search, setSearch] = useState(initialSearch);
  const [status, setStatus] = useState(initialStatus || "all");
  const [prevInitial, setPrevInitial] = useState({
    search: initialSearch,
    status: initialStatus || "all",
  });

  if (
    prevInitial.search !== initialSearch ||
    prevInitial.status !== (initialStatus || "all")
  ) {
    setPrevInitial({ search: initialSearch, status: initialStatus || "all" });
    setSearch(initialSearch);
    setStatus(initialStatus || "all");
  }

  const onChangeRef = useRef(onChange);
  const searchRef = useRef(search);
  const statusRef = useRef(status);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    statusRef.current = status;
  }, [status]);

  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const handleSearchChange = (value: string) => {
    setSearch(value);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChangeRef.current({
        search: value.trim(),
        status: statusRef.current,
      });
    }, SEARCH_DEBOUNCE_MS);
  };

  const handleStatusChange = (value: string) => {
    setStatus(value);
    onChangeRef.current({
      search: searchRef.current.trim(),
      status: value,
    });
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="relative min-w-[220px] flex-1">
        <label className="sr-only" htmlFor="book-search">
          {tBooks("searchPlaceholder")}
        </label>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
            clipRule="evenodd"
          />
        </svg>
        <input
          id="book-search"
          type="search"
          value={search}
          onChange={(event) => handleSearchChange(event.target.value)}
          placeholder={tBooks("searchPlaceholder")}
          className="w-full rounded-full border border-input bg-card py-2.5 pe-4 ps-10 text-sm text-foreground placeholder:text-muted-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div className="relative">
        <label className="sr-only" htmlFor="book-status">
          {tBooks("statusFilter")}
        </label>
        <select
          id="book-status"
          value={status}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="rounded-full border border-input bg-card px-4 py-2.5 text-sm text-foreground transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">{tBooks("allStatuses")}</option>
          <option value="available">{tStatus("available")}</option>
          <option value="checked-out">{tStatus("checkedOut")}</option>
        </select>
      </div>

      {pending && (
        <span
          aria-hidden
          className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
        />
      )}
    </div>
  );
}
