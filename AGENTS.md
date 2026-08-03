<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

# Library Management System - Project Details

## Stack

- **Next.js 16.2.12** (App Router, Turbopack, React 19)
- **next-intl 4.13.4** (i18n routing: en/ar, default en, localePrefix: always)
- **json-server 1.0.0-beta.15** (mock REST API at port 3000)
- **Tailwind CSS 4** (class-based dark mode, RTL support)
- **TypeScript 5** (strict mode)

## Project Goal

Build a Library Management System frontend using json-server as mock backend. Users can search, filter, sort, paginate books; borrow/return books; view dashboard, users, and borrowing history.

## Commands

```bash
npm run dev         # Next.js on port 3001
npm run server      # json-server on port 3000
npm run dev:all     # Both together (concurrently)
npm run build       # Production build
npm run lint        # ESLint
npm run start       # Production server
```

## JSON-Server API (port 3000)

| Resource   | Endpoints                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Books      | `GET /books?_page=1&_per_page=10`<br>`GET /books?title=contains&author=contains`<br>`GET /books?status=available`<br>`GET /books?category=Programming`<br>`GET /books?_sort=title&_order=asc`<br>`POST /books`<br>`PATCH /books/:id` |
| Users      | `GET /users?_page=1&_per_page=10`<br>`GET /users?_embed=borrowings`                                                                                                                                                                  |
| Borrowings | `GET /borrowings?_page=1&_per_page=10`<br>`POST /borrowings`<br>`PATCH /borrowings/:id`                                                                                                                                              |

## Pages (all under `/[locale]`)

- `/` — Dashboard (stats cards + recent borrowings)
- `/books` — Books catalog (search, filter, sort, pagination, borrow)
- `/books/[id]` — Book details (full info, availability, borrow)
- `/users` — Users list (paginated + borrowed count)
- `/borrowings` — Borrowing history (filter, return button)

## Data Model

```ts
interface Book {
  id: number;
  isbn: string;
  title: string;
  author: string;
  category: string;
  publisher: string;
  publishedYear: number;
  language: string;
  pages: number;
  description: string;
  cover: string;
  totalCopies: number;
  availableCopies: number;
  status: "available" | "checked-out";
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  membershipNumber: string;
  status: "active" | "inactive";
}

interface Borrowing {
  id: number;
  bookId: number;
  userId: number;
  borrowDate: string;
  dueDate: string;
  returnDate: string | null;
  status: "borrowed" | "returned";
}
```

## Borrow Flow

1. User clicks Borrow → opens dialog with member dropdown
2. Verify `availableCopies > 0`
3. `POST /borrowings` {bookId, userId, borrowDate, dueDate, status: "borrowed"}
4. `PATCH /books/:id` {availableCopies: -1, status: "checked-out" if 0}
5. Invalidate cache, refresh UI

## Return Flow

1. User clicks Return → confirm dialog
2. `PATCH /borrowings/:id` {returnDate, status: "returned"}
3. `PATCH /books/:id` {availableCopies: +1, status: "available"}
4. Invalidate cache, refresh UI

## Validation Rules

- **Books**: title, author, ISBN required
- **Borrow**: prevent if `availableCopies === 0`
- **Return**: prevent if already returned

## Error Handling

Display user-friendly toasts for: unavailable book, network error, server error, invalid search, unknown error

---

# Golden Rules (MUST FOLLOW)

1. **SEO-Friendly Always**
   - Localized metadata via `generateMetadata` (title, description, hreflang alternates)
   - Semantic HTML, proper heading hierarchy
   - Open Graph / Twitter cards
   - Clean URLs with locale prefix (`/en/books`, `/ar/books`)

2. **Best Performance Always**
   - Enable `cacheComponents: true` in `next.config.ts` (PPR by default)
   - Use `use cache` + `cacheTag` for data fetching keyed by query params
   - Invalidate with `revalidateTag` / `updateTag` after mutations
   - `reactCompiler: true` for auto-memoization
   - No client JS where server works (Server Components first)
   - Static generation with `generateStaticParams` for all locales
   - Streaming with `<Suspense>` for dynamic content

3. **Split Code Into Small Components**
   - Global components: `src/components/` (Header, Footer, LocaleSwitcher, ThemeToggle, SearchBar, Filters, Pagination, BookCard, BookGrid, Modal, Toast, Spinner, Skeleton, Badge)
   - Route-specific: `app/[locale]/<route>/components/` or co-located
   - Single responsibility, reusable, typed

4. **Cache Components When Needed in Routes**
   - Data functions: `use cache` + `cacheTag('library')` in `src/services/`
   - UI components: wrap in `<Suspense>` if accessing dynamic data
   - Use `cacheLife` profiles for different freshness needs

5. **Global Components in `src/components/`**
   - Shared UI primitives live in `src/components/`
   - Import via `@/components/`
   - All client components marked `'use client'` at top

---

# Next.js 16 Breaking Changes (Reference)

| Change                       | Details                                                                      |
| ---------------------------- | ---------------------------------------------------------------------------- |
| `middleware.ts` → `proxy.ts` | File renamed, runs on Node runtime only                                      |
| `params` / `searchParams`    | Are **Promises** — must `await`                                              |
| `fetch` caching              | **NOT cached by default** — use `use cache` / `cache: 'force-cache'`         |
| Cache Components             | `cacheComponents: true` enables PPR + `use cache` / `cacheLife` / `cacheTag` |
| Route segment config         | `dynamic`, `revalidate`, `fetchCache` removed when cacheComponents on        |
| Revalidation                 | `revalidateTag(tag, 'max')` requires 2nd arg; `updateTag(tag)` for instant   |
| `serverComponentsHmrCache`   | Set `false` in dev to avoid stale reads after mutations                      |
| React Compiler               | `reactCompiler: true` requires `babel-plugin-react-compiler`                 |

---

# Folder Structure

```
src/
├── app/
│   └── [locale]/
│       ├── layout.tsx          # Root layout (html, NextIntlClientProvider, Header, Footer)
│       ├── page.tsx            # Dashboard
│       ├── books/
│       │   ├── page.tsx        # Books catalog
│       │   └── [id]/page.tsx   # Book details
│       ├── users/page.tsx
│       └── borrowings/page.tsx
├── components/                  # Global shared components
│   ├── header.tsx
│   ├── footer.tsx
│   ├── locale-switcher.tsx
│   ├── theme-toggle.tsx
│   ├── search-bar.tsx
│   ├── filter-select.tsx
│   ├── sort-select.tsx
│   ├── pagination.tsx
│   ├── book-card.tsx
│   ├── book-grid.tsx
│   ├── availability-badge.tsx
│   ├── borrow-dialog.tsx
│   ├── return-dialog.tsx
│   ├── modal.tsx
│   ├── toast.tsx
│   ├── spinner.tsx
│   ├── skeleton.tsx
│   ├── empty-state.tsx
│   └── error-state.tsx
├── i18n/
│   ├── routing.ts              # defineRouting({locales, defaultLocale, localePrefix})
│   ├── request.ts              # getRequestConfig with requestLocale
│   ├── navigation.ts           # createNavigation(routing) → Link, useRouter, usePathname
│   ├── global.d.ts             # AppConfig augmentation for type-safe messages
│   └── theme.ts                # Theme store (useSyncExternalStore)
├── api/                        # json-server fetch wrappers
│   ├── books.api.ts
│   ├── users.api.ts
│   └── borrowings.api.ts
├── services/                   # Business logic + caching
│   ├── book.service.ts
│   ├── user.service.ts
│   └── borrowing.service.ts
├── lib/
│   └── theme.ts                # Theme store (alternative location)
├── types/
│   └── index.ts                # Book, User, Borrowing, PaginatedList
├── constants/
│   └── index.ts                # Page sizes, categories, statuses, due days
├── utils/
│   └── index.ts                # formatDate, cn(), etc.
└── messages/
    ├── en.json
    └── ar.json
```

---

# Key Implementation Notes

## next-intl v4 Routing Setup

```ts
// src/i18n/routing.ts
export const routing = defineRouting({
  locales: ['en', 'ar'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

// proxy.ts (project root)
export default createMiddleware(routing);
export const config = { matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)' };

// src/i18n/request.ts
export default getRequestConfig(async ({requestLocale}) => {
  const locale = routing.locales.includes(requested as Locale) ? requested : routing.defaultLocale;
  return { locale, messages: (await import(`../messages/${locale}.json`)).default };
});

// app/[locale]/layout.tsx
export function generateStaticParams() { return routing.locales.map(l => ({locale: l})); }
export default async function LocaleLayout({children, params}) {
  const {locale} = await params;
  setRequestLocale(locale as Locale);
  return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}><NextIntlClientProvider>{children}</NextIntlClientProvider></html>;
}
```

## json-server Search/Filter Syntax (v1 beta)

- **Search**: `title=contains`, `author=contains`, `isbn=contains` (case-insensitive)
- **Filter**: `status=available`, `category=Programming` (exact match)
- **Sort**: `_sort=title`, `_sort=-publishedYear` (descending)
- **Pagination**: `_page=1&_per_page=10` → returns `{first, prev, next, last, pages, items, data}`

## Type-Safe Messages

```ts
// src/i18n/global.d.ts
import type { routing } from "./routing";
declare module "next-intl" {
  interface AppConfig {
    Locale: (typeof routing.locales)[number];
    Messages: typeof import("../messages/en.json");
  }
}
```

## Theme (Light/Dark)

- `next/script` with `strategy="beforeInteractive"` for FOUC-free theme init
- `useSyncExternalStore` in `ThemeToggle` for React 19 compatible state
- CSS variables in `globals.css` with `@custom-variant dark (&:where(.dark, .dark *))`
- Tailwind logical properties for RTL support

---

# Verification Checklist

- [ ] `npm run lint` passes
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run build` succeeds (both locales static)
- [ ] `/en` and `/ar` render correctly
- [ ] RTL layout works for Arabic
- [ ] Locale switcher persists URL path
- [ ] Theme toggle works (no FOUC)
- [ ] Proxy redirects `/` → `/en`
- [ ] json-server runs on port 3000
