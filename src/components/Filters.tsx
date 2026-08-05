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
      <div className="relative w-full max-w-[300px]">
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
          className="w-full rounded-full border border-input bg-surface py-2.5 pe-10 ps-10 text-sm text-foreground shadow-sm outline-none transition placeholder:text-muted-foreground hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        {pending && (
          <span
            aria-hidden
            className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin rounded-full border-2 border-muted-foreground/30 border-t-primary"
          />
        )}
      </div>

      <div className="relative">
        <label className="sr-only" htmlFor="book-status">
          {tBooks("statusFilter")}
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
            d="M2.628 1.601C5.028 1.206 7.49 1 10 1s4.973.206 7.372.601a.75.75 0 0 1 .628.74v2.288a2.25 2.25 0 0 1-.659 1.591l-4.682 4.683a2.25 2.25 0 0 0-.659 1.59v3.037c0 .684-.31 1.33-.844 1.757l-1.937 1.55A.75.75 0 0 1 8 18.25v-5.757a2.25 2.25 0 0 0-.659-1.591L2.659 6.22A2.25 2.25 0 0 1 2 4.629V2.34a.75.75 0 0 1 .628-.74Z"
            clipRule="evenodd"
          />
        </svg>
        <select
          id="book-status"
          value={status}
          onChange={(event) => handleStatusChange(event.target.value)}
          className="cursor-pointer appearance-none rounded-full border border-input bg-surface py-2.5 ps-10 pe-10 text-sm text-foreground shadow-sm outline-none transition hover:border-primary/40 focus:border-primary focus:ring-2 focus:ring-primary/20"
        >
          <option value="all">{tBooks("allStatuses")}</option>
          <option value="available">{tStatus("available")}</option>
          <option value="checked-out">{tStatus("checkedOut")}</option>
        </select>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </div>
  );
}
