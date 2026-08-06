import { getTranslations } from "next-intl/server";
import type { User } from "@/types";
import { Avatar } from "@/components/avatar";

interface ProfileHeroProps {
  user: User;
  currentlyBorrowed: number;
  returnedCount: number;
  totalBorrowed: number;
}

export async function ProfileHero({
  user,
  currentlyBorrowed,
  returnedCount,
  totalBorrowed,
}: ProfileHeroProps) {
  const t = await getTranslations("profile");
  const tStatus = await getTranslations("status");
  const tUsers = await getTranslations("users");

  const isActive = user.status === "active";

  const stats = [
    { label: t("currentlyBorrowed"), value: currentlyBorrowed },
    { label: t("returned"), value: returnedCount },
    { label: t("totalBorrowed"), value: totalBorrowed },
  ];

  return (
    <div className="pb-4">
      <div className="relative h-44 overflow-hidden rounded-3xl bg-[linear-gradient(135deg,#3b82c4_0%,#2397ca_45%,#0b7a8f_100%)] shadow-lg sm:h-56">
        <div
          aria-hidden
          className="absolute inset-0 [background-image:repeating-linear-gradient(90deg,rgba(255,255,255,0.07)_0px,rgba(255,255,255,0.07)_2px,transparent_2px,transparent_16px)]"
        />
        <div
          aria-hidden
          className="absolute inset-0 [background:radial-gradient(1200px_420px_at_50%_-120px,rgba(255,255,255,0.28),transparent_60%)]"
        />
        <div
          aria-hidden
          className="absolute -end-6 -top-6 h-40 w-40 rounded-full bg-primary-foreground/10 blur-2xl"
        />
        <p
          aria-hidden
          className="pointer-events-none absolute -bottom-7 end-4 select-none font-serif text-6xl font-black text-primary-foreground/15 sm:text-8xl"
        >
          {user.membershipNumber.slice(-3)}
        </p>
      </div>

      <div className="-mt-12 flex justify-center">
        <Avatar name={user.fullName} size="lg" />
      </div>

      <div className="mt-3 flex flex-col items-center gap-3 text-center">
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="font-serif text-2xl font-bold leading-tight text-foreground sm:text-3xl">
            {user.fullName}
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider ${
              isActive
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
            }`}
          >
            <span
              aria-hidden
              className={`h-1.5 w-1.5 rounded-full ${isActive ? "animate-pulse bg-success" : "bg-danger"}`}
            />
            {isActive ? tStatus("active") : tStatus("inactive")}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 font-mono text-xs font-semibold text-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-primary"
              aria-hidden
            >
              <path d="M11.983 1.907a.75.75 0 0 0-1.292-.657l-8.5 9.5A.75.75 0 0 0 2.75 12h6.572l-1.305 6.093a.75.75 0 0 0 1.292.657l8.5-9.5A.75.75 0 0 0 17.25 8h-6.572l1.305-6.093Z" />
            </svg>
            {user.membershipNumber}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-primary"
              aria-hidden
            >
              <path d="M3 4a2 2 0 0 0-2 2v1.161l8.441 4.221a1.25 1.25 0 0 0 1.118 0L19 7.162V6a2 2 0 0 0-2-2H3Z" />
              <path d="m19 8.839-7.77 3.885a2.75 2.75 0 0 1-2.46 0L1 8.839V14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V8.839Z" />
            </svg>
            {user.email}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="h-3.5 w-3.5 text-primary"
              aria-hidden
            >
              <path d="M2 3.5A1.5 1.5 0 0 1 3.5 2h1.148a1.5 1.5 0 0 1 1.465 1.175l.716 3.223a1.5 1.5 0 0 1-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 0 0 6.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 0 1 1.767-1.052l3.223.716A1.5 1.5 0 0 1 18 15.352V16.5a1.5 1.5 0 0 1-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 0 1 2.43 8.326 13.019 13.019 0 0 1 2 5V3.5Z" />
            </svg>
            {user.phone}
          </span>
        </div>

        <p className="text-xs uppercase tracking-wide text-muted-foreground/70">
          {tUsers("membershipNumber")}
        </p>
      </div>

      <dl className="mx-auto mt-8 grid w-full max-w-md grid-cols-3 gap-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-border bg-card px-3 py-4 text-center shadow-sm"
          >
            <dd className="font-serif text-2xl font-bold text-primary sm:text-3xl">
              {stat.value}
            </dd>
            <dt className="mt-1 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
              {stat.label}
            </dt>
          </div>
        ))}
      </dl>
    </div>
  );
}
