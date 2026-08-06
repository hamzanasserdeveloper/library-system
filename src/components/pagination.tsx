import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

interface PaginationProps {
  currentPage: number;
  pages: number;
  buildHref: (page: number) => string;
  label?: string;
}

export default async function Pagination({
  currentPage,
  pages,
  buildHref,
  label,
}: PaginationProps) {
  const t = await getTranslations("common");
  const pageNumbers = Array.from({ length: pages }, (_, index) => index + 1);
  const isFirst = currentPage === 1;
  const isLast = currentPage === pages;

  return (
    <nav
      aria-label={label ?? t("page")}
      className="flex items-center justify-center gap-2"
    >
      <Link
        href={buildHref(Math.max(1, currentPage - 1))}
        aria-disabled={isFirst}
        aria-label={t("previous")}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/50 hover:text-primary ${
          isFirst ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 rtl:rotate-180"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 0 1-.02 1.06L8.832 10l3.938 3.71a.75.75 0 1 1-1.04 1.08l-4.5-4.25a.75.75 0 0 1 0-1.08l4.5-4.25a.75.75 0 0 1 1.06.02Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>

      {pageNumbers.map((number) => {
        const isActive = number === currentPage;
        return (
          <Link
            key={number}
            href={buildHref(number)}
            aria-current={isActive ? "page" : undefined}
            className={`flex h-9 min-w-9 items-center justify-center rounded-full px-2 text-sm font-semibold transition ${
              isActive
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/25"
                : "border border-border bg-card text-foreground hover:border-primary/50 hover:text-primary"
            }`}
          >
            {number}
          </Link>
        );
      })}

      <Link
        href={buildHref(Math.min(pages, currentPage + 1))}
        aria-disabled={isLast}
        aria-label={t("next")}
        className={`flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/50 hover:text-primary ${
          isLast ? "pointer-events-none opacity-40" : ""
        }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="h-4 w-4 rtl:rotate-180"
          aria-hidden
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 0 1 .02-1.06L11.168 10 7.23 6.29a.75.75 0 1 1 1.04-1.08l4.5 4.25a.75.75 0 0 1 0 1.08l-4.5 4.25a.75.75 0 0 1-1.06-.02Z"
            clipRule="evenodd"
          />
        </svg>
      </Link>
    </nav>
  );
}
