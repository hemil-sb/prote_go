# Shop payments, admin-editable prices and lead capture: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the website's `mailto:` placeholders with a working first version: Razorpay checkout for priced packs, prices read from a Supabase database the future admin dashboard will edit, and website forms that store leads in that database.

**Architecture:** The front-facing site stays a Next.js 16 App Router app. It gains a server-only data layer over a Supabase Postgres database (run locally in Docker during development), four tables (`products`, `leads`, `orders` + `order_items`, `webhook_events`), two server-action files (orders, leads) and two route handlers (Razorpay webhook, cache revalidation). The browser never talks to Supabase or holds a secret: it calls server actions, and the only client-side third party is Razorpay's hosted checkout. Marketing copy for products stays in `content/products.ts`; the database holds only what the admin will edit (price, active flag, order). The admin dashboard is a separate later service on a subdomain; its only contract with this site is the shared database plus a `POST /api/revalidate` call when a price changes.

**Tech Stack:** Next.js 16.3.6 (App Router, server actions, `unstable_cache`), React 19.2, TypeScript, Tailwind v4, `@supabase/supabase-js` 2.117.x (server only), Supabase CLI 2.119 via `npx` with Docker Desktop, Razorpay Orders API + Standard Checkout (`checkout.js`) + webhooks, Node 24 built-in test runner (`node --test`, importing `.ts` directly as the existing `tests/design-b` tests do).

**Spec:** `../../../docs/platform-build-plan.md` (the Stackbinary proposal extracted into modules), narrowed by the client decisions of 1 Oct 2026:
1. Payments: Razorpay replaces the placeholder checkout.
2. Prices are editable from the admin dashboard, so they live in the database, not in code.
3. Photo and video placeholders stay for now and are replaced later.
4. Build an initial version with the information available today (3 packs, only the 500 ml kit priced at ₹1,049).
5. The admin dashboard is a separate service on a subdomain and is out of scope here. Only the front-facing site is in scope.
6. Supabase runs in local Docker for development.

## Global Constraints

- Next.js **16.3.6**: read `node_modules/next/dist/docs/` before using any API. Cache Components are **not** enabled; use the "previous model" (`unstable_cache` with `tags`, the two-argument `revalidateTag(tag, { expire: 0 })`, route segment `revalidate`); the one-argument `revalidateTag(tag)` is deprecated. Keep `data-scroll-behavior="smooth"` on `<html>`.
- Money is stored and computed as **integer paise** (₹1,049 = `104900`). Never a float. Razorpay also takes paise.
- Secrets (`SUPABASE_SECRET_KEY`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `REVALIDATE_SECRET`) are read only in files that import `"server-only"` or in route handlers. Only `NEXT_PUBLIC_RAZORPAY_KEY_ID` is public.
- Every migration that creates a table in `public` enables RLS **and** grants access in the same file (`anon` gets `select` on active products only; `service_role` gets all; `leads`, `orders`, `order_items`, `webhook_events` get no `anon`/`authenticated` grants).
- Pure modules under `lib/` that are unit-tested must not import `server-only`, `next/*`, `@supabase/*` or use the `@/` alias (Node's test runner resolves relative paths only). They use relative imports and only erasable TypeScript syntax (no `enum`, no parameter properties).
- Brand and copy rules from `../../../CLAUDE.md` §4–5 apply to every new string: Manrope, approved palette only, sentence-case headlines ending in a full stop, UK/Indian spelling, "complements, not replaces", no efficacy numbers.
- Product naming: "ProteGo Surface Protectant" and "DIY Protection Kit". Never "Surface Shield".
- Commits: short message, author Hemil <hemil@stackbinary.io>, **no co-author trailer**, only when the task says to commit.
- Do not start or restart the dev server. Verify with `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`.

## Review Focus

Inputs the spec implies but a careless build will break. Each line names the owning task and that task contains the pinning test.

1. **A client tampers with cart prices or quantities.** The server must price every line from the database and reject unknown, inactive, unpriced or out-of-range lines (`qty` 0, 100, 1.5, negative). Task 4 `priceCart` tests.
2. **The Razorpay handler is called with a forged or mismatched signature.** `confirmPayment` must refuse unless the HMAC over `order_id|payment_id` matches, using a constant-time compare, and must never mark an order paid from an unverified source. Task 6 signature tests.
3. **The same webhook is delivered twice or arrives before the browser handler.** Marking paid must be idempotent (second delivery is a no-op) and a `payment.failed` must not overwrite a `paid` order. Task 7 `applyWebhookEvent` tests.
4. **The database is unreachable when a page renders.** The catalogue must degrade to "price on request" rather than crash the whole site, and the build must still succeed. Task 3 `mergeCatalog` tests and the manual check in Task 3 step 9.
5. **Spam and malformed lead submissions.** A filled honeypot is silently accepted without storing; an Indian phone number is normalised; a missing name or phone returns field errors instead of a 500. Task 8 `parseLead` and `normalisePhone` tests.

---

## File structure

| Path | Responsibility |
|---|---|
| `supabase/config.toml`, `supabase/migrations/20261001090000_shop_and_leads.sql`, `supabase/seed.sql` | Local Docker stack, schema, grants, RLS, seed products |
| `.env.example`, `.gitignore` | Documented env vars; keep the example file tracked |
| `lib/env.ts` | Reads server env vars by name and fails with a clear message |
| `lib/money.ts` | `formatPrice(paise)`, `rupeesToPaise` (pure, tested) |
| `content/products.ts` | Marketing copy per pack, **no prices** |
| `lib/catalog-merge.ts` | `mergeCatalog(content, rows)` (pure, tested) |
| `lib/catalog.ts` | `getCatalog()` server-only, cached under tag `products` |
| `lib/supabase/server.ts`, `lib/supabase/types.ts` | Service-role client (server-only) and generated DB types |
| `lib/orders/pricing.ts` | `priceCart(catalog, lines)` (pure, tested) |
| `lib/orders/orderNumber.ts` | `makeOrderNumber(date, randomBytes)` (pure, tested) |
| `lib/validate.ts` | `parseCustomer`, `parseLead`, `normalisePhone` (pure, tested) |
| `lib/razorpay/api.ts` | `createRazorpayOrder` over the REST API with injected `fetch` (tested) |
| `lib/razorpay/signature.ts` | `verifyPaymentSignature`, `verifyWebhookSignature` (pure, tested) |
| `lib/razorpay/webhook.ts` | `applyWebhookEvent(event, db)` with an injected DB interface (tested) |
| `lib/razorpay/checkout.ts` | Browser-side loader for `checkout.js` and the `Razorpay` window type |
| `lib/db/orders.ts`, `lib/db/leads.ts` | Thin Supabase queries, server-only |
| `app/actions/orders.ts`, `app/actions/leads.ts` | Server actions: `createOrder`, `confirmPayment`, `submitLead` |
| `app/api/razorpay/webhook/route.ts` | Verifies and applies Razorpay webhooks |
| `app/api/revalidate/route.ts` | Admin hook: `revalidateTag('products')` behind a secret |
| `components/cart/CartProvider.tsx`, `CartView.tsx`, `CheckoutForm.tsx`, `AddToCart.tsx` | Cart fed by the server catalogue; Razorpay checkout |
| `app/checkout/success/page.tsx` | Order confirmation page |
| `components/products/RequestQuoteForm.tsx` | Bulk / unpriced pack enquiry → lead |
| `components/sections/Contact.tsx` | Assessment form → lead |
| `app/layout.tsx`, `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `components/sections/Products.tsx` | Read the catalogue instead of hard-coded prices |
| `content/privacy.ts`, `README.md` | Copy and setup docs updated for the new flows |
| `scripts/sign-webhook.mjs` | Signs a sample webhook body for local testing |
| `tests/shop/*.test.mjs` | Unit tests for every pure module |

---

### Task 1: Local Supabase, schema, seed and environment

**Files:**
- Create: `supabase/config.toml` (generated), `supabase/migrations/20261001090000_shop_and_leads.sql`, `supabase/seed.sql`, `.env.example`, `.env.local` (untracked)
- Modify: `package.json` (scripts, devDependencies), `.gitignore`

**Interfaces:**
- Produces: tables `public.products`, `public.leads`, `public.orders`, `public.order_items`, `public.webhook_events` with the exact columns below; env var names `SUPABASE_URL`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET`, `RAZORPAY_WEBHOOK_SECRET`, `REVALIDATE_SECRET`, `NEXT_PUBLIC_SITE_URL`; npm scripts `db:start`, `db:stop`, `db:reset`, `db:types`, `test`.

- [ ] **Step 1: Install the CLI and supabase-js, pinned**

Run in `website/`:
```bash
npm install --save-exact @supabase/supabase-js@2.117.2
npm install --save-dev --save-exact supabase@2.119.0
```

- [ ] **Step 2: Add scripts to `package.json`**

Replace the `scripts` block with:
```json
"scripts": {
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "eslint",
  "test": "node --test \"tests/**/*.test.mjs\"",
  "db:start": "supabase start",
  "db:stop": "supabase stop",
  "db:reset": "supabase db reset",
  "db:types": "supabase gen types typescript --local --schema public > lib/supabase/types.ts"
}
```

- [ ] **Step 3: Initialise the Supabase project folder**

Run: `npx supabase init` (answer no to any IDE settings prompts). Expected: `supabase/config.toml` created. Open it and confirm `[api] port = 54321`, `[db] port = 54322`, `[studio] port = 54323`.

- [ ] **Step 4: Write the migration**

Run: `npx supabase migration new shop_and_leads`. It creates `supabase/migrations/<timestamp>_shop_and_leads.sql`. Put this in it (keep the generated timestamp in the filename):

```sql
-- Shop and lead capture for protegohygiene.com.
-- Marketing copy for products lives in content/products.ts; this table holds what the admin edits.

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- products ----------
create table public.products (
  slug text primary key,
  name text not null,
  size text not null,
  price_paise integer check (price_paise is null or price_paise > 0),
  is_active boolean not null default true,
  sort_order integer not null default 0,
  updated_at timestamptz not null default now()
);
comment on column public.products.price_paise is 'MRP inclusive of taxes, in paise. NULL = price on request.';
create trigger products_set_updated_at before update on public.products
  for each row execute function public.set_updated_at();

alter table public.products enable row level security;
create policy "public reads active products" on public.products
  for select to anon, authenticated using (is_active);
grant select on public.products to anon, authenticated;
grant all on public.products to service_role;

-- ---------- leads ----------
create table public.leads (
  id bigint generated always as identity primary key,
  kind text not null check (kind in ('assessment', 'bulk_request')),
  name text not null,
  phone text not null,
  organisation text,
  email text,
  sector text,
  product_slug text references public.products (slug),
  quantity integer check (quantity is null or quantity > 0),
  message text,
  page text,
  source text not null default 'website',
  status text not null default 'new' check (status in ('new', 'contacted', 'assessment_booked', 'won', 'lost')),
  created_at timestamptz not null default now()
);
create index leads_created_at_idx on public.leads (created_at desc);
create index leads_product_slug_idx on public.leads (product_slug);

alter table public.leads enable row level security;
grant all on public.leads to service_role;

-- ---------- orders ----------
create table public.orders (
  id bigint generated always as identity primary key,
  public_id uuid not null unique default gen_random_uuid(),
  order_number text not null unique,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed')),
  customer_name text not null,
  customer_phone text not null,
  customer_email text not null,
  company text,
  gstin text,
  address_line text not null,
  city text not null,
  pincode text not null,
  notes text,
  subtotal_paise integer not null check (subtotal_paise > 0),
  razorpay_order_id text unique,
  razorpay_payment_id text,
  paid_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index orders_status_created_idx on public.orders (status, created_at desc);
create trigger orders_set_updated_at before update on public.orders
  for each row execute function public.set_updated_at();

alter table public.orders enable row level security;
grant all on public.orders to service_role;

create table public.order_items (
  id bigint generated always as identity primary key,
  order_id bigint not null references public.orders (id) on delete cascade,
  product_slug text not null references public.products (slug),
  name text not null,
  size text not null,
  unit_price_paise integer not null check (unit_price_paise > 0),
  quantity integer not null check (quantity > 0 and quantity <= 99)
);
create index order_items_order_id_idx on public.order_items (order_id);
create index order_items_product_slug_idx on public.order_items (product_slug);

alter table public.order_items enable row level security;
grant all on public.order_items to service_role;

-- ---------- webhook_events (idempotency) ----------
create table public.webhook_events (
  id text primary key,
  event text not null,
  received_at timestamptz not null default now()
);
alter table public.webhook_events enable row level security;
grant all on public.webhook_events to service_role;
```

- [ ] **Step 5: Write the seed**

`supabase/seed.sql`:
```sql
insert into public.products (slug, name, size, price_paise, is_active, sort_order) values
  ('surface-protectant-100ml', 'ProteGo Surface Protectant', '100 ml', null,   true, 10),
  ('diy-protection-kit-500ml', 'DIY Protection Kit',         '500 ml', 104900, true, 20),
  ('surface-protectant-20l',   'ProteGo Surface Protectant', '20 L',   null,   true, 30)
on conflict (slug) do update
  set name = excluded.name, size = excluded.size, sort_order = excluded.sort_order;
```

- [ ] **Step 6: Start the stack and apply**

Run: `npm run db:start` (first run downloads images; allow several minutes), then `npm run db:reset`.
Expected: reset ends with `Seeding data from supabase/seed.sql...` and `Finished supabase db reset`.

- [ ] **Step 7: Verify the schema and grants from the API**

Run: `npx supabase status -o env` and note `API_URL`, `ANON_KEY` and `SERVICE_ROLE_KEY` (newer CLIs may also print `PUBLISHABLE_KEY`/`SECRET_KEY`; either pair works locally).

```bash
curl -s "http://127.0.0.1:54321/rest/v1/products?select=slug,price_paise&order=sort_order" -H "apikey: <ANON_KEY>"
curl -s -o /dev/null -w "%{http_code}\n" "http://127.0.0.1:54321/rest/v1/leads?select=id" -H "apikey: <ANON_KEY>"
```
Expected: the first prints the three products with `104900` on the 500 ml; the second prints `401` or `403` (anon cannot read leads).

- [ ] **Step 8: Environment files**

`.env.example` (tracked):
```bash
# Supabase (local: values from `npx supabase status -o env`)
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_SECRET_KEY=            # SERVICE_ROLE_KEY (or SECRET_KEY) from status. Server only. Never NEXT_PUBLIC_.

# Razorpay (test mode keys from dashboard.razorpay.com → Settings → API keys)
NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_xxxxxxxxxxxxxx
RAZORPAY_KEY_SECRET=
RAZORPAY_WEBHOOK_SECRET=        # set when creating the webhook in the Razorpay dashboard

# Admin dashboard calls POST /api/revalidate with this value in x-revalidate-secret
REVALIDATE_SECRET=change-me

NEXT_PUBLIC_SITE_URL=http://localhost:3000
```
Copy it to `.env.local` and fill the real local values. In `.gitignore`, directly under the `.env*` line add:
```
!.env.example
```

- [ ] **Step 9: Generate database types**

Create the folder and run: `mkdir lib\supabase` then `npm run db:types`. Expected: `lib/supabase/types.ts` exists and contains `products: { Row: { slug: string; ... price_paise: number | null`.

- [ ] **Step 10: Commit**

```bash
git add package.json package-lock.json supabase .env.example .gitignore lib/supabase/types.ts
git commit -m "local supabase: shop and leads schema"
```

---

### Task 2: Money helpers and prices out of content

**Files:**
- Create: `lib/money.ts`, `tests/shop/money.test.mjs`
- Modify: `content/products.ts`

**Interfaces:**
- Produces: `formatPrice(paise: number): string`, `rupeesToPaise(rupees: number): number`; `Product` type without `price`.
- Note: after this task the site does **not** compile until Task 3 rewires the pages. Tasks 2 and 3 are committed together at the end of Task 3.

- [ ] **Step 1: Write the failing test**

`tests/shop/money.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { formatPrice, rupeesToPaise } from "../../lib/money.ts";

test("formatPrice shows whole rupees with Indian grouping", () => {
  assert.equal(formatPrice(104900), "₹1,049");
  assert.equal(formatPrice(3259900), "₹32,599");
  assert.equal(formatPrice(0), "₹0");
});

test("formatPrice keeps paise only when present", () => {
  assert.equal(formatPrice(99950), "₹999.50");
});

test("rupeesToPaise rounds to the nearest paisa", () => {
  assert.equal(rupeesToPaise(1049), 104900);
  assert.equal(rupeesToPaise(10.005), 1001);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, `Cannot find module '.../lib/money.ts'`.

- [ ] **Step 3: Implement `lib/money.ts`**

```ts
// Money is integer paise everywhere (₹1,049 = 104900). Razorpay uses the same unit.

export function formatPrice(paise: number): string {
  const rupees = Math.round(paise) / 100;
  const whole = Number.isInteger(rupees);
  return `₹${rupees.toLocaleString("en-IN", {
    minimumFractionDigits: whole ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

export function rupeesToPaise(rupees: number): number {
  return Math.round(rupees * 100);
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: the 3 money tests PASS (the existing design-b tests still pass).

- [ ] **Step 5: Remove prices from `content/products.ts`**

Edit the file:
- Delete the `price` field from the `Product` type and from each of the three entries.
- Delete the `formatPrice` function at the bottom.
- Replace the header comment with:
```ts
// ProteGo Surface Protectant packs (docs/knowledge-base/03-offerings/surface-protectant.md, diy-protection-kit.md).
// Marketing copy only. Prices come from the database (public.products.price_paise) via lib/catalog.ts,
// so the admin dashboard can change them without a deploy.
```

- [ ] **Step 6: Confirm the type change**

Run: `npx tsc --noEmit`
Expected: errors only in files that read `.price` or import `formatPrice` from content (`app/products/page.tsx`, `app/products/[slug]/page.tsx`, `components/sections/Products.tsx`, `components/cart/*`). Task 3 fixes them. Do not commit yet.

---

### Task 3: Server catalogue, cached and wired into pages and cart

**Files:**
- Create: `lib/catalog-merge.ts`, `lib/catalog.ts`, `lib/env.ts`, `lib/supabase/server.ts`, `tests/shop/catalog.test.mjs`
- Modify: `app/layout.tsx`, `app/products/page.tsx`, `app/products/[slug]/page.tsx`, `components/sections/Products.tsx`, `components/cart/CartProvider.tsx`, `components/cart/CartView.tsx`, `components/cart/CheckoutForm.tsx`, `app/page.tsx` (only if it renders `Products` with props)

**Interfaces:**
- Consumes: `Product` from `content/products.ts`, `formatPrice` from `lib/money.ts`, `Database` from `lib/supabase/types.ts`.
- Produces:
  - `type PriceRow = { slug: string; price_paise: number | null; is_active: boolean; sort_order: number }`
  - `type PricedProduct = Product & { pricePaise: number | null }`
  - `mergeCatalog(content: readonly Product[], rows: readonly PriceRow[]): PricedProduct[]`
  - `getCatalog(): Promise<PricedProduct[]>` (server-only, cached, tag `products`)
  - `productBySlug(catalog: PricedProduct[], slug: string): PricedProduct | undefined`
  - `serverEnv(name: "SUPABASE_URL" | "SUPABASE_SECRET_KEY" | "RAZORPAY_KEY_SECRET" | "RAZORPAY_WEBHOOK_SECRET" | "REVALIDATE_SECRET"): string`
  - `createServiceClient(): SupabaseClient<Database>`
  - `CartProvider` prop `catalog: PricedProduct[]`; `CartLine = { slug; qty; product: PricedProduct }`; cart `subtotalPaise: number`; `add()` ignores slugs whose `pricePaise` is `null`.

- [ ] **Step 1: Write the failing merge test**

`tests/shop/catalog.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { mergeCatalog } from "../../lib/catalog-merge.ts";

const content = [
  { slug: "a", name: "A", size: "100 ml", coverage: "", bestFor: "", image: { src: "", alt: "" }, summary: "", idealFor: [], inTheBox: [] },
  { slug: "b", name: "B", size: "500 ml", coverage: "", bestFor: "", image: { src: "", alt: "" }, summary: "", idealFor: [], inTheBox: [] },
  { slug: "c", name: "C", size: "20 L", coverage: "", bestFor: "", image: { src: "", alt: "" }, summary: "", idealFor: [], inTheBox: [] },
];

test("prices come from rows and rows order the catalogue", () => {
  const rows = [
    { slug: "b", price_paise: 104900, is_active: true, sort_order: 20 },
    { slug: "a", price_paise: null, is_active: true, sort_order: 10 },
  ];
  const out = mergeCatalog(content, rows);
  assert.deepEqual(out.map((p) => [p.slug, p.pricePaise]), [["a", null], ["b", 104900], ["c", null]]);
});

test("a product without a row is shown as price on request (degrades, never disappears)", () => {
  const out = mergeCatalog(content, []);
  assert.equal(out.length, 3);
  assert.ok(out.every((p) => p.pricePaise === null));
});

test("an inactive row hides the product; unknown rows are ignored", () => {
  const rows = [
    { slug: "a", price_paise: 1, is_active: false, sort_order: 1 },
    { slug: "zzz", price_paise: 1, is_active: true, sort_order: 1 },
  ];
  assert.deepEqual(mergeCatalog(content, rows).map((p) => p.slug), ["b", "c"]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, cannot find `lib/catalog-merge.ts`.

- [ ] **Step 3: Implement `lib/catalog-merge.ts`**

```ts
import type { Product } from "../content/products";

export type PriceRow = { slug: string; price_paise: number | null; is_active: boolean; sort_order: number };
export type PricedProduct = Product & { pricePaise: number | null };

/*
  Content (copy, images) comes from code; price, visibility and order come from the database.
  A product with no row is still shown, as "price on request", so a database outage degrades
  instead of emptying the shop. An inactive row hides the product.
*/
export function mergeCatalog(content: readonly Product[], rows: readonly PriceRow[]): PricedProduct[] {
  const bySlug = new Map(rows.map((r) => [r.slug, r]));
  return content
    .map((p, i) => ({ p, row: bySlug.get(p.slug), i }))
    .filter(({ row }) => !row || row.is_active)
    .sort((x, y) => (x.row?.sort_order ?? 1e9) - (y.row?.sort_order ?? 1e9) || x.i - y.i)
    .map(({ p, row }) => ({ ...p, pricePaise: row?.price_paise ?? null }));
}

export function productBySlug(catalog: readonly PricedProduct[], slug: string) {
  return catalog.find((p) => p.slug === slug);
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`
Expected: catalog tests PASS.

- [ ] **Step 5: Env and Supabase client (server-only)**

`lib/env.ts`:
```ts
import "server-only";

type ServerVar = "SUPABASE_URL" | "SUPABASE_SECRET_KEY" | "RAZORPAY_KEY_SECRET" | "RAZORPAY_WEBHOOK_SECRET" | "REVALIDATE_SECRET";

export function serverEnv(name: ServerVar): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing environment variable ${name}. See .env.example.`);
  return v;
}
```

`lib/supabase/server.ts`:
```ts
import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./types";
import { serverEnv } from "../env";

export type Db = SupabaseClient<Database>;

/* Service-role client: bypasses RLS, so it is only ever created on the server. */
export function createServiceClient(): Db {
  return createClient<Database>(serverEnv("SUPABASE_URL"), serverEnv("SUPABASE_SECRET_KEY"), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
```

Install the guard package: `npm install --save-exact server-only@0.0.1`.

- [ ] **Step 6: Cached catalogue `lib/catalog.ts`**

```ts
import "server-only";
import { unstable_cache } from "next/cache";
import { PRODUCTS } from "@/content/products";
import { mergeCatalog, type PriceRow, type PricedProduct } from "./catalog-merge";
import { createServiceClient } from "./supabase/server";

export type { PricedProduct } from "./catalog-merge";
export { productBySlug } from "./catalog-merge";

export const PRODUCTS_TAG = "products";

async function loadRows(): Promise<PriceRow[]> {
  try {
    const { data, error } = await createServiceClient()
      .from("products")
      .select("slug, price_paise, is_active, sort_order");
    if (error) throw error;
    return data;
  } catch (e) {
    console.error("catalog: database unavailable, showing prices on request", e);
    return [];
  }
}

/* Cached for 60 s; the admin dashboard calls POST /api/revalidate to refresh at once. */
export const getCatalog = unstable_cache(
  async (): Promise<PricedProduct[]> => mergeCatalog(PRODUCTS, await loadRows()),
  ["catalog"],
  { tags: [PRODUCTS_TAG], revalidate: 60 },
);
```

- [ ] **Step 7: Feed the cart from the layout**

In `app/layout.tsx`:
- Add `import { getCatalog } from "@/lib/catalog";`
- Add `export const revalidate = 60;` after the `viewport` export (routes re-render at most every minute, so a price change shows within a minute even without the admin hook).
- Make the component `async`, add `const catalog = await getCatalog();` and render `<CartProvider catalog={catalog}>`.

In `components/cart/CartProvider.tsx`:
- Replace `import { PRODUCTS, type Product } from "@/content/products";` with `import type { PricedProduct } from "@/lib/catalog-merge";`
- `export type CartLine = Line & { product: PricedProduct };`
- Replace `subtotal` and `hasUnpriced` in the `Cart` type with `subtotalPaise: number;`
- `read(catalog: PricedProduct[])` filters with `catalog.some((p) => p.slug === l?.slug && p.pricePaise !== null)`.
- `CartProvider({ catalog, children }: { catalog: PricedProduct[]; children: React.ReactNode })`, pass `catalog` into `read` and add it to the effect deps.
- `add` returns `prev` unchanged when `catalog.find((p) => p.slug === slug)?.pricePaise == null`.
- In the memo: `subtotalPaise: lines.reduce((n, l) => n + (l.product.pricePaise ?? 0) * l.qty, 0)` and drop `hasUnpriced`. Lines whose product is missing from the catalogue or unpriced are dropped.
- Update the header comment: "Cart lines live in localStorage; prices always come from the server catalogue passed in by the layout. Checkout takes payment with Razorpay."

- [ ] **Step 8: Rewire the pages**

`components/cart/CartView.tsx`: import `formatPrice` from `@/lib/money`; use `subtotalPaise`; line price `formatPrice(l.product.pricePaise! * l.qty)`; remove the "on request" branches; summary line text `{l.product.name}, {l.product.size} × {l.qty}`.

`components/cart/CheckoutForm.tsx`: for now only make it compile: import `formatPrice` from `@/lib/money`, use `subtotalPaise`, and `l.product.pricePaise`. Task 6 replaces the whole flow.

`components/sections/Products.tsx`: change to `export default function Products({ catalog }: { catalog: PricedProduct[] })`, import `PricedProduct` from `@/lib/catalog-merge` and `formatPrice` from `@/lib/money`, iterate `catalog`, and show `{p.pricePaise ? \`DIY kit · ${formatPrice(p.pricePaise)}\` : p.bestFor}`. In `app/page.tsx` make the page `async`, `const catalog = await getCatalog();` and render `<Products catalog={catalog} />`.

`app/products/page.tsx`: make it `async`, `const catalog = await getCatalog();`, map over `catalog`, price cell `{p.pricePaise ? \`${formatPrice(p.pricePaise)} MRP\` : "On request"}`; import `formatPrice` from `@/lib/money` and drop it from the content import.

`app/products/[slug]/page.tsx`: keep `generateStaticParams` on `PRODUCTS`; in `generateMetadata` and the page, `const p = productBySlug(await getCatalog(), slug)`; `others = catalog.filter(...)`; price block:
```tsx
<p className="mt-6 text-headline font-normal text-sherpa-deep">{p.pricePaise ? formatPrice(p.pricePaise) : "Price on request"}</p>
<p className="mt-1 text-sm text-ink/55">{p.pricePaise ? "MRP, inclusive of all taxes." : "Tell us how much you need and we'll quote within one working day."}</p>
<div className="mt-7">{p.pricePaise ? <AddToCart slug={p.slug} name={`${p.name}, ${p.size}`} /> : <Link href="/contact" className="btn inline-block rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa">Request a quote</Link>}</div>
```
(Task 8 swaps the link for the real quote form.) The "Other packs" list uses `o.pricePaise`.

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`
Expected: all pass; the build log lists `/products/[slug]` as static with three params.

Then stop Docker's Supabase (`npm run db:stop`) and run `npm run build` again. Expected: the build still succeeds and logs `catalog: database unavailable`. Start it again with `npm run db:start`.

With the user's dev server running, open `http://localhost:3000/products`. Expected: 500 ml shows ₹1,049 MRP; 100 ml and 20 L show "On request" and no Add to cart button on their detail pages.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "prices from supabase catalogue; cart fed by server"
```

---

### Task 4: Server-side cart pricing and customer validation

**Files:**
- Create: `lib/orders/pricing.ts`, `lib/validate.ts`, `tests/shop/pricing.test.mjs`, `tests/shop/validate.test.mjs`

**Interfaces:**
- Consumes: `PricedProduct` from `lib/catalog-merge.ts`.
- Produces:
  - `type CartLineInput = { slug: string; qty: number }`
  - `type PricedLine = { slug: string; name: string; size: string; unitPricePaise: number; qty: number; linePaise: number }`
  - `type PricingResult = { ok: true; lines: PricedLine[]; subtotalPaise: number } | { ok: false; error: "empty" | "unknown_product" | "unpriced_product" | "bad_quantity"; slug?: string }`
  - `priceCart(catalog: readonly PricedProduct[], lines: readonly CartLineInput[]): PricingResult`; `MAX_QTY = 99`
  - `type FieldErrors = Record<string, string>`
  - `type CustomerDetails = { name: string; phone: string; email: string; company: string | null; gstin: string | null; addressLine: string; city: string; pincode: string; notes: string | null }`
  - `parseCustomer(input: Record<string, unknown>): { ok: true; value: CustomerDetails } | { ok: false; errors: FieldErrors }`
  - `normalisePhone(raw: unknown): string | null` (returns `+91XXXXXXXXXX` or `null`)
  - `isEmail(s: string): boolean`, `isGstin(s: string): boolean`

- [ ] **Step 1: Write the failing pricing test**

`tests/shop/pricing.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { priceCart } from "../../lib/orders/pricing.ts";

const base = { coverage: "", bestFor: "", image: { src: "", alt: "" }, summary: "", idealFor: [], inTheBox: [] };
const catalog = [
  { ...base, slug: "kit", name: "DIY Protection Kit", size: "500 ml", pricePaise: 104900 },
  { ...base, slug: "bulk", name: "ProteGo Surface Protectant", size: "20 L", pricePaise: null },
];

test("prices lines from the catalogue, never from the client", () => {
  const r = priceCart(catalog, [{ slug: "kit", qty: 2, pricePaise: 1 }]);
  assert.equal(r.ok, true);
  assert.equal(r.subtotalPaise, 209800);
  assert.deepEqual(r.lines[0], { slug: "kit", name: "DIY Protection Kit", size: "500 ml", unitPricePaise: 104900, qty: 2, linePaise: 209800 });
});

test("merges duplicate slugs", () => {
  const r = priceCart(catalog, [{ slug: "kit", qty: 1 }, { slug: "kit", qty: 2 }]);
  assert.equal(r.ok, true);
  assert.equal(r.lines.length, 1);
  assert.equal(r.lines[0].qty, 3);
});

test("rejects empty, unknown, unpriced and bad quantities", () => {
  assert.deepEqual(priceCart(catalog, []), { ok: false, error: "empty" });
  assert.deepEqual(priceCart(catalog, [{ slug: "nope", qty: 1 }]), { ok: false, error: "unknown_product", slug: "nope" });
  assert.deepEqual(priceCart(catalog, [{ slug: "bulk", qty: 1 }]), { ok: false, error: "unpriced_product", slug: "bulk" });
  for (const qty of [0, -1, 1.5, 100, NaN, "2"]) {
    assert.deepEqual(priceCart(catalog, [{ slug: "kit", qty }]), { ok: false, error: "bad_quantity", slug: "kit" }, `qty ${qty}`);
  }
});

test("rejects a merged quantity above the maximum", () => {
  assert.equal(priceCart(catalog, [{ slug: "kit", qty: 60 }, { slug: "kit", qty: 60 }]).ok, false);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, cannot find `lib/orders/pricing.ts`.

- [ ] **Step 3: Implement `lib/orders/pricing.ts`**

```ts
import type { PricedProduct } from "../catalog-merge";

export const MAX_QTY = 99;

export type CartLineInput = { slug: string; qty: number };
export type PricedLine = { slug: string; name: string; size: string; unitPricePaise: number; qty: number; linePaise: number };
export type PricingResult =
  | { ok: true; lines: PricedLine[]; subtotalPaise: number }
  | { ok: false; error: "empty" | "unknown_product" | "unpriced_product" | "bad_quantity"; slug?: string };

/* The client sends slugs and quantities only. Every price here comes from the catalogue. */
export function priceCart(catalog: readonly PricedProduct[], input: readonly CartLineInput[]): PricingResult {
  if (!Array.isArray(input) || input.length === 0) return { ok: false, error: "empty" };

  const merged = new Map<string, number>();
  for (const l of input) {
    const slug = typeof l?.slug === "string" ? l.slug : "";
    const qty = l?.qty;
    if (typeof qty !== "number" || !Number.isInteger(qty) || qty < 1 || qty > MAX_QTY) return { ok: false, error: "bad_quantity", slug };
    merged.set(slug, (merged.get(slug) ?? 0) + qty);
  }

  const lines: PricedLine[] = [];
  for (const [slug, qty] of merged) {
    const p = catalog.find((c) => c.slug === slug);
    if (!p) return { ok: false, error: "unknown_product", slug };
    if (p.pricePaise === null) return { ok: false, error: "unpriced_product", slug };
    if (qty > MAX_QTY) return { ok: false, error: "bad_quantity", slug };
    lines.push({ slug, name: p.name, size: p.size, unitPricePaise: p.pricePaise, qty, linePaise: p.pricePaise * qty });
  }
  return { ok: true, lines, subtotalPaise: lines.reduce((n, l) => n + l.linePaise, 0) };
}
```

- [ ] **Step 4: Run the pricing tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Write the failing validation test**

`tests/shop/validate.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { normalisePhone, parseCustomer, isGstin } from "../../lib/validate.ts";

test("normalisePhone accepts Indian mobiles in common spellings", () => {
  assert.equal(normalisePhone("99670 53755"), "+919967053755");
  assert.equal(normalisePhone("+91-99670-53755"), "+919967053755");
  assert.equal(normalisePhone("09967053755"), "+919967053755");
  assert.equal(normalisePhone("12345"), null);
  assert.equal(normalisePhone("5967053755"), null);
  assert.equal(normalisePhone(undefined), null);
});

test("isGstin checks the 15-character pattern", () => {
  assert.equal(isGstin("27AALCG9671R1ZF"), true);
  assert.equal(isGstin("27aalcg9671r1zf"), true);
  assert.equal(isGstin("27AALCG9671R1"), false);
});

const good = {
  name: " Asha Rao ", phone: "99670 53755", email: "Asha@Example.com", company: "", gstin: "",
  address: "K-104, Tower 6", city: "Navi Mumbai", pincode: "400705", notes: "",
};

test("parseCustomer trims, normalises and nulls optional blanks", () => {
  const r = parseCustomer(good);
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, {
    name: "Asha Rao", phone: "+919967053755", email: "asha@example.com", company: null, gstin: null,
    addressLine: "K-104, Tower 6", city: "Navi Mumbai", pincode: "400705", notes: null,
  });
});

test("parseCustomer reports every bad field at once", () => {
  const r = parseCustomer({ ...good, name: "", phone: "12", email: "nope", pincode: "40070", gstin: "bad" });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "gstin", "name", "phone", "pincode"]);
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test`
Expected: FAIL, cannot find `lib/validate.ts`.

- [ ] **Step 7: Implement `lib/validate.ts`**

```ts
export type FieldErrors = Record<string, string>;

export type CustomerDetails = {
  name: string;
  phone: string;
  email: string;
  company: string | null;
  gstin: string | null;
  addressLine: string;
  city: string;
  pincode: string;
  notes: string | null;
};

const str = (v: unknown, max = 500) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const opt = (v: unknown, max = 500) => str(v, max) || null;

/* Indian mobile numbers: 10 digits starting 6–9, optionally prefixed with 0, 91 or +91. */
export function normalisePhone(raw: unknown): string | null {
  const digits = str(raw).replace(/[^\d]/g, "");
  const m = digits.match(/^(?:0|91)?([6-9]\d{9})$/);
  return m ? `+91${m[1]}` : null;
}

export function isEmail(s: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s);
}

export function isGstin(s: string): boolean {
  return /^\d{2}[A-Z]{5}\d{4}[A-Z][1-9A-Z]Z[0-9A-Z]$/.test(s.toUpperCase());
}

export function parseCustomer(input: Record<string, unknown>): { ok: true; value: CustomerDetails } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const name = str(input.name, 120);
  const phone = normalisePhone(input.phone);
  const email = str(input.email, 200).toLowerCase();
  const gstinRaw = opt(input.gstin, 20);
  const addressLine = str(input.address, 300);
  const city = str(input.city, 100);
  const pincode = str(input.pincode, 10);

  if (name.length < 2) errors.name = "Please enter your name.";
  if (!phone) errors.phone = "Please enter a 10-digit Indian mobile number.";
  if (!isEmail(email)) errors.email = "Please enter a valid email address.";
  if (gstinRaw && !isGstin(gstinRaw)) errors.gstin = "That doesn't look like a 15-character GSTIN.";
  if (addressLine.length < 5) errors.address = "Please enter your delivery address.";
  if (city.length < 2) errors.city = "Please enter your city.";
  if (!/^[1-9]\d{5}$/.test(pincode)) errors.pincode = "Please enter a 6-digit PIN code.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      name,
      phone: phone!,
      email,
      company: opt(input.company, 150),
      gstin: gstinRaw ? gstinRaw.toUpperCase() : null,
      addressLine,
      city,
      pincode,
      notes: opt(input.notes, 1000),
    },
  };
}
```

- [ ] **Step 8: Run the tests**

Run: `npm test`
Expected: PASS.

- [ ] **Step 9: Commit**

```bash
git add lib/orders/pricing.ts lib/validate.ts tests/shop
git commit -m "server-side cart pricing and customer validation"
```

---

### Task 5: Order records and the `createOrder` server action

**Files:**
- Create: `lib/orders/orderNumber.ts`, `lib/razorpay/api.ts`, `lib/db/orders.ts`, `app/actions/orders.ts`, `tests/shop/orderNumber.test.mjs`, `tests/shop/razorpay-api.test.mjs`

**Interfaces:**
- Consumes: `priceCart`, `parseCustomer`, `getCatalog`, `createServiceClient`, `serverEnv`.
- Produces:
  - `makeOrderNumber(date: Date, random: Uint8Array): string` → `PG-YYMMDD-XXXX` (4 chars from the alphabet `ABCDEFGHJKMNPQRSTUVWXYZ23456789`)
  - `createRazorpayOrder(args: { amountPaise: number; receipt: string; notes?: Record<string, string> }, deps: { keyId: string; keySecret: string; fetchImpl?: typeof fetch }): Promise<{ id: string; amount: number }>`
  - DB helpers (all take `db: Db` first): `insertOrder(db, order: NewOrder): Promise<{ id: number; publicId: string }>`, `attachRazorpayOrder(db, id, razorpayOrderId)`, `markPaid(db, razorpayOrderId, paymentId): Promise<"paid" | "already_paid" | "missing">`, `markFailed(db, razorpayOrderId): Promise<void>`, `getOrderByPublicId(db, publicId): Promise<OrderSummary | null>`, `recordWebhookEvent(db, id, event): Promise<boolean>`
  - `type NewOrder = { orderNumber: string; customer: CustomerDetails; lines: PricedLine[]; subtotalPaise: number }`
  - `type OrderSummary = { publicId: string; orderNumber: string; status: "pending" | "paid" | "failed"; customerName: string; customerEmail: string; subtotalPaise: number; createdAt: string; items: { name: string; size: string; qty: number; unitPricePaise: number }[] }`
  - Server action `createOrder(input: { lines: CartLineInput[]; customer: Record<string, string> }): Promise<CreateOrderResult>` where `CreateOrderResult = { ok: true; publicId: string; razorpayOrderId: string; amountPaise: number; keyId: string; prefill: { name: string; email: string; contact: string } } | { ok: false; errors?: FieldErrors; message: string }`

- [ ] **Step 1: Failing test for the order number**

`tests/shop/orderNumber.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { makeOrderNumber } from "../../lib/orders/orderNumber.ts";

test("order number is PG-YYMMDD-XXXX from the date and random bytes", () => {
  const n = makeOrderNumber(new Date("2026-10-01T10:00:00+05:30"), new Uint8Array([0, 1, 2, 3]));
  assert.equal(n, "PG-261001-ABCD");
});

test("random bytes map into an unambiguous alphabet", () => {
  const n = makeOrderNumber(new Date("2026-10-01T10:00:00+05:30"), new Uint8Array([255, 254, 31, 32]));
  assert.match(n, /^PG-261001-[ABCDEFGHJKMNPQRSTUVWXYZ23456789]{4}$/);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`. Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/orders/orderNumber.ts`**

```ts
const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789"; // no 0/O, 1/I/L

/* Human-friendly, unique enough per day; the database enforces uniqueness and the caller retries once. */
export function makeOrderNumber(date: Date, random: Uint8Array): string {
  const ist = new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
  const yy = String(ist.getUTCFullYear()).slice(2);
  const mm = String(ist.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(ist.getUTCDate()).padStart(2, "0");
  const tail = Array.from(random.slice(0, 4), (b) => ALPHABET[b % ALPHABET.length]).join("");
  return `PG-${yy}${mm}${dd}-${tail}`;
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Failing test for the Razorpay order call**

`tests/shop/razorpay-api.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { createRazorpayOrder } from "../../lib/razorpay/api.ts";

test("posts amount, currency and receipt with basic auth and returns the id", async () => {
  let seen;
  const fetchImpl = async (url, init) => {
    seen = { url, init };
    return new Response(JSON.stringify({ id: "order_ABC", amount: 104900, currency: "INR" }), { status: 200 });
  };
  const r = await createRazorpayOrder({ amountPaise: 104900, receipt: "PG-261001-ABCD" }, { keyId: "rzp_test_k", keySecret: "s", fetchImpl });
  assert.deepEqual(r, { id: "order_ABC", amount: 104900 });
  assert.equal(seen.url, "https://api.razorpay.com/v1/orders");
  assert.equal(seen.init.headers.Authorization, `Basic ${Buffer.from("rzp_test_k:s").toString("base64")}`);
  assert.deepEqual(JSON.parse(seen.init.body), { amount: 104900, currency: "INR", receipt: "PG-261001-ABCD", notes: {} });
});

test("throws with Razorpay's error description", async () => {
  const fetchImpl = async () => new Response(JSON.stringify({ error: { description: "Amount too low" } }), { status: 400 });
  await assert.rejects(
    () => createRazorpayOrder({ amountPaise: 1, receipt: "x" }, { keyId: "k", keySecret: "s", fetchImpl }),
    /Amount too low/,
  );
});
```

- [ ] **Step 6: Run it to verify it fails**

Run: `npm test`. Expected: FAIL, module not found.

- [ ] **Step 7: Implement `lib/razorpay/api.ts`**

```ts
/* Razorpay Orders API over plain fetch so it can be tested with an injected fetch. */
export async function createRazorpayOrder(
  args: { amountPaise: number; receipt: string; notes?: Record<string, string> },
  deps: { keyId: string; keySecret: string; fetchImpl?: typeof fetch },
): Promise<{ id: string; amount: number }> {
  const f = deps.fetchImpl ?? fetch;
  const res = await f("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${Buffer.from(`${deps.keyId}:${deps.keySecret}`).toString("base64")}`,
    },
    body: JSON.stringify({ amount: args.amountPaise, currency: "INR", receipt: args.receipt.slice(0, 40), notes: args.notes ?? {} }),
  });
  const json = (await res.json()) as { id?: string; amount?: number; error?: { description?: string } };
  if (!res.ok || !json.id) throw new Error(`Razorpay order failed: ${json.error?.description ?? res.status}`);
  return { id: json.id, amount: json.amount ?? args.amountPaise };
}
```

- [ ] **Step 8: Run the tests**

Run: `npm test`. Expected: PASS.

- [ ] **Step 9: Database helpers `lib/db/orders.ts`**

```ts
import "server-only";
import type { Db } from "../supabase/server";
import type { CustomerDetails } from "../validate";
import type { PricedLine } from "../orders/pricing";

export type NewOrder = { orderNumber: string; customer: CustomerDetails; lines: PricedLine[]; subtotalPaise: number };

export type OrderSummary = {
  publicId: string;
  orderNumber: string;
  status: "pending" | "paid" | "failed";
  customerName: string;
  customerEmail: string;
  subtotalPaise: number;
  createdAt: string;
  items: { name: string; size: string; qty: number; unitPricePaise: number }[];
};

export async function insertOrder(db: Db, o: NewOrder): Promise<{ id: number; publicId: string }> {
  const c = o.customer;
  const { data, error } = await db
    .from("orders")
    .insert({
      order_number: o.orderNumber,
      customer_name: c.name,
      customer_phone: c.phone,
      customer_email: c.email,
      company: c.company,
      gstin: c.gstin,
      address_line: c.addressLine,
      city: c.city,
      pincode: c.pincode,
      notes: c.notes,
      subtotal_paise: o.subtotalPaise,
    })
    .select("id, public_id")
    .single();
  if (error) throw error;

  const { error: itemsError } = await db.from("order_items").insert(
    o.lines.map((l) => ({ order_id: data.id, product_slug: l.slug, name: l.name, size: l.size, unit_price_paise: l.unitPricePaise, quantity: l.qty })),
  );
  if (itemsError) throw itemsError;
  return { id: data.id, publicId: data.public_id };
}

export async function attachRazorpayOrder(db: Db, id: number, razorpayOrderId: string): Promise<void> {
  const { error } = await db.from("orders").update({ razorpay_order_id: razorpayOrderId }).eq("id", id);
  if (error) throw error;
}

/* Idempotent: only a pending order becomes paid. */
export async function markPaid(db: Db, razorpayOrderId: string, paymentId: string): Promise<"paid" | "already_paid" | "missing"> {
  const { data: existing, error: readError } = await db.from("orders").select("status").eq("razorpay_order_id", razorpayOrderId).maybeSingle();
  if (readError) throw readError;
  if (!existing) return "missing";
  if (existing.status === "paid") return "already_paid";
  const { error } = await db
    .from("orders")
    .update({ status: "paid", razorpay_payment_id: paymentId, paid_at: new Date().toISOString() })
    .eq("razorpay_order_id", razorpayOrderId)
    .neq("status", "paid");
  if (error) throw error;
  return "paid";
}

export async function markFailed(db: Db, razorpayOrderId: string): Promise<void> {
  const { error } = await db.from("orders").update({ status: "failed" }).eq("razorpay_order_id", razorpayOrderId).eq("status", "pending");
  if (error) throw error;
}

export async function getOrderByPublicId(db: Db, publicId: string): Promise<OrderSummary | null> {
  if (!/^[0-9a-f-]{36}$/i.test(publicId)) return null;
  const { data, error } = await db
    .from("orders")
    .select("public_id, order_number, status, customer_name, customer_email, subtotal_paise, created_at, order_items (name, size, quantity, unit_price_paise)")
    .eq("public_id", publicId)
    .maybeSingle();
  if (error) throw error;
  if (!data) return null;
  return {
    publicId: data.public_id,
    orderNumber: data.order_number,
    status: data.status as OrderSummary["status"],
    customerName: data.customer_name,
    customerEmail: data.customer_email,
    subtotalPaise: data.subtotal_paise,
    createdAt: data.created_at,
    items: data.order_items.map((i) => ({ name: i.name, size: i.size, qty: i.quantity, unitPricePaise: i.unit_price_paise })),
  };
}

/* Returns false when the event id was already recorded (duplicate delivery). */
export async function recordWebhookEvent(db: Db, id: string, event: string): Promise<boolean> {
  const { error } = await db.from("webhook_events").insert({ id, event });
  if (!error) return true;
  if (error.code === "23505") return false;
  throw error;
}
```

- [ ] **Step 10: Server action `app/actions/orders.ts` (createOrder only; `confirmPayment` is added in Task 6)**

```ts
"use server";

import { randomBytes } from "node:crypto";
import { getCatalog } from "@/lib/catalog";
import { serverEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/server";
import { priceCart, type CartLineInput } from "@/lib/orders/pricing";
import { makeOrderNumber } from "@/lib/orders/orderNumber";
import { parseCustomer, type FieldErrors } from "@/lib/validate";
import { createRazorpayOrder } from "@/lib/razorpay/api";
import { attachRazorpayOrder, insertOrder } from "@/lib/db/orders";

export type CreateOrderResult =
  | { ok: true; publicId: string; razorpayOrderId: string; amountPaise: number; keyId: string; prefill: { name: string; email: string; contact: string } }
  | { ok: false; errors?: FieldErrors; message: string };

const PRICING_MESSAGES: Record<string, string> = {
  empty: "Your cart is empty.",
  unknown_product: "One of the items in your cart is no longer available. Please review your cart.",
  unpriced_product: "One of the items in your cart is priced on request. Please remove it and ask us for a quote.",
  bad_quantity: "Please choose a quantity between 1 and 99.",
};

export async function createOrder(input: { lines: CartLineInput[]; customer: Record<string, string> }): Promise<CreateOrderResult> {
  const customer = parseCustomer(input.customer ?? {});
  if (!customer.ok) return { ok: false, errors: customer.errors, message: "Please check the highlighted fields." };

  const priced = priceCart(await getCatalog(), input.lines ?? []);
  if (!priced.ok) return { ok: false, message: PRICING_MESSAGES[priced.error] };

  const db = createServiceClient();
  let inserted: { id: number; publicId: string } | null = null;
  let orderNumber = "";
  for (let attempt = 0; attempt < 2 && !inserted; attempt++) {
    orderNumber = makeOrderNumber(new Date(), randomBytes(4));
    try {
      inserted = await insertOrder(db, { orderNumber, customer: customer.value, lines: priced.lines, subtotalPaise: priced.subtotalPaise });
    } catch (e) {
      if ((e as { code?: string }).code !== "23505" || attempt === 1) throw e;
    }
  }
  if (!inserted) return { ok: false, message: "We couldn't create your order. Please try again." };

  const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
  if (!keyId) throw new Error("Missing NEXT_PUBLIC_RAZORPAY_KEY_ID");
  const rzp = await createRazorpayOrder(
    { amountPaise: priced.subtotalPaise, receipt: orderNumber, notes: { order_number: orderNumber } },
    { keyId, keySecret: serverEnv("RAZORPAY_KEY_SECRET") },
  );
  await attachRazorpayOrder(db, inserted.id, rzp.id);

  return {
    ok: true,
    publicId: inserted.publicId,
    razorpayOrderId: rzp.id,
    amountPaise: priced.subtotalPaise,
    keyId,
    prefill: { name: customer.value.name, email: customer.value.email, contact: customer.value.phone },
  };
}
```

- [ ] **Step 11: Type-check and lint**

Run: `npx tsc --noEmit && npm run lint`
Expected: clean. If the generated `Database` types reject a column name, the migration and the helper disagree: fix the helper to match `lib/supabase/types.ts`.

- [ ] **Step 12: Commit**

```bash
git add lib/orders/orderNumber.ts lib/razorpay/api.ts lib/db/orders.ts app/actions/orders.ts tests/shop
git commit -m "orders: records, razorpay order and createOrder action"
```

---

### Task 6: Razorpay checkout in the browser, payment confirmation and the success page

**Files:**
- Create: `lib/razorpay/signature.ts`, `lib/razorpay/checkout.ts`, `app/checkout/success/page.tsx`, `tests/shop/signature.test.mjs`
- Modify: `app/actions/orders.ts` (add `confirmPayment`), `components/cart/CheckoutForm.tsx`, `content/privacy.ts` (one line, see step 10)

**Interfaces:**
- Consumes: `createOrder`, `markPaid`, `getOrderByPublicId`, `formatPrice`, `useCart`.
- Produces:
  - `verifyPaymentSignature(args: { orderId: string; paymentId: string; signature: string }, keySecret: string): boolean`
  - `verifyWebhookSignature(rawBody: string, signature: string, webhookSecret: string): boolean`
  - `loadRazorpay(): Promise<RazorpayConstructor>` and the `window.Razorpay` global type
  - Server action `confirmPayment(input: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string }): Promise<{ ok: true; publicId: string } | { ok: false; message: string }>`
  - Route `/checkout/success?o=<publicId>`

- [ ] **Step 1: Failing signature tests**

`tests/shop/signature.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { createHmac } from "node:crypto";
import { verifyPaymentSignature, verifyWebhookSignature } from "../../lib/razorpay/signature.ts";

const secret = "test_secret";

test("payment signature is HMAC-SHA256 of order_id|payment_id", () => {
  const sig = createHmac("sha256", secret).update("order_1|pay_1").digest("hex");
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: sig }, secret), true);
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_2", signature: sig }, secret), false);
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: "" }, secret), false);
  assert.equal(verifyPaymentSignature({ orderId: "order_1", paymentId: "pay_1", signature: sig.slice(0, -1) + "0" }, secret), false);
});

test("webhook signature is HMAC-SHA256 of the raw body", () => {
  const body = '{"event":"payment.captured"}';
  const sig = createHmac("sha256", "whsec").update(body).digest("hex");
  assert.equal(verifyWebhookSignature(body, sig, "whsec"), true);
  assert.equal(verifyWebhookSignature(body + " ", sig, "whsec"), false);
  assert.equal(verifyWebhookSignature(body, "short", "whsec"), false);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`. Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/razorpay/signature.ts`**

```ts
import { createHmac, timingSafeEqual } from "node:crypto";

function hmacHex(secret: string, message: string): string {
  return createHmac("sha256", secret).update(message).digest("hex");
}

function safeEqualHex(a: string, b: string): boolean {
  if (!/^[0-9a-f]+$/i.test(a) || !/^[0-9a-f]+$/i.test(b) || a.length !== b.length) return false;
  return timingSafeEqual(Buffer.from(a, "hex"), Buffer.from(b, "hex"));
}

/* Standard Checkout returns razorpay_signature = HMAC_SHA256(order_id + "|" + payment_id, key_secret). */
export function verifyPaymentSignature(args: { orderId: string; paymentId: string; signature: string }, keySecret: string): boolean {
  if (!args.orderId || !args.paymentId || !args.signature) return false;
  return safeEqualHex(hmacHex(keySecret, `${args.orderId}|${args.paymentId}`), args.signature);
}

/* Webhooks: X-Razorpay-Signature = HMAC_SHA256(raw request body, webhook secret). */
export function verifyWebhookSignature(rawBody: string, signature: string, webhookSecret: string): boolean {
  if (!signature) return false;
  return safeEqualHex(hmacHex(webhookSecret, rawBody), signature);
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Add `confirmPayment` to `app/actions/orders.ts`**

Append (and add the imports `verifyPaymentSignature` from `@/lib/razorpay/signature` and `markPaid` from `@/lib/db/orders`):
```ts
export async function confirmPayment(input: {
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}): Promise<{ ok: true; publicId: string } | { ok: false; message: string }> {
  const okSig = verifyPaymentSignature(
    { orderId: input.razorpayOrderId, paymentId: input.razorpayPaymentId, signature: input.razorpaySignature },
    serverEnv("RAZORPAY_KEY_SECRET"),
  );
  if (!okSig) return { ok: false, message: "We couldn't verify this payment. If money was taken, it will be refunded automatically." };

  const db = createServiceClient();
  const result = await markPaid(db, input.razorpayOrderId, input.razorpayPaymentId);
  if (result === "missing") return { ok: false, message: "We couldn't find this order." };

  const { data } = await db.from("orders").select("public_id").eq("razorpay_order_id", input.razorpayOrderId).single();
  return { ok: true, publicId: data!.public_id };
}
```

- [ ] **Step 6: Browser loader `lib/razorpay/checkout.ts`**

```ts
/* Loads Razorpay Standard Checkout on demand (only when someone pays), never in the page bundle. */

export type RazorpaySuccess = { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string };

export type RazorpayOptions = {
  key: string;
  amount: number;
  currency: "INR";
  name: string;
  description?: string;
  order_id: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccess) => void;
  modal?: { ondismiss?: () => void };
};

export type RazorpayInstance = { open: () => void; on: (event: "payment.failed", cb: (r: { error: { description: string } }) => void) => void };
export type RazorpayConstructor = new (options: RazorpayOptions) => RazorpayInstance;

declare global {
  interface Window {
    Razorpay?: RazorpayConstructor;
  }
}

const SRC = "https://checkout.razorpay.com/v1/checkout.js";
let loading: Promise<RazorpayConstructor> | null = null;

export function loadRazorpay(): Promise<RazorpayConstructor> {
  if (window.Razorpay) return Promise.resolve(window.Razorpay);
  if (!loading) {
    loading = new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = SRC;
      s.async = true;
      s.onload = () => (window.Razorpay ? resolve(window.Razorpay) : reject(new Error("Razorpay failed to load")));
      s.onerror = () => reject(new Error("Razorpay failed to load"));
      document.head.appendChild(s);
    });
  }
  return loading;
}
```

- [ ] **Step 7: Rewrite `components/cart/CheckoutForm.tsx`**

Keep the existing fieldsets, field styles and `OrderSummary`. Replace the header comment, the state and `onSubmit`, and the CTA block:

```tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { createOrder, confirmPayment } from "@/app/actions/orders";
import { loadRazorpay } from "@/lib/razorpay/checkout";
import type { FieldErrors } from "@/lib/validate";
import { useCart } from "./CartProvider";
import { OrderSummary } from "./CartView";

/*
  Checkout: the server prices the cart and creates the order, Razorpay's hosted checkout takes
  the payment, and the server verifies the signature before the order is marked paid.
*/
type Status = { kind: "idle" } | { kind: "working"; step: "creating" | "paying" | "confirming" } | { kind: "error"; message: string; errors?: FieldErrors };

export default function CheckoutForm() {
  const { lines, ready, clear } = useCart();
  const router = useRouter();
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const working = status.kind === "working";
  const errors = status.kind === "error" ? (status.errors ?? {}) : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const customer = Object.fromEntries(Array.from(d.entries()).map(([k, v]) => [k, String(v)]));
    setStatus({ kind: "working", step: "creating" });

    const created = await createOrder({ lines: lines.map((l) => ({ slug: l.slug, qty: l.qty })), customer });
    if (!created.ok) return setStatus({ kind: "error", message: created.message, errors: created.errors });

    let Razorpay;
    try {
      Razorpay = await loadRazorpay();
    } catch {
      return setStatus({ kind: "error", message: "The payment window couldn't load. Please check your connection and try again." });
    }

    setStatus({ kind: "working", step: "paying" });
    const rzp = new Razorpay({
      key: created.keyId,
      amount: created.amountPaise,
      currency: "INR",
      name: "ProteGo Hygiene",
      description: "ProteGo Surface Protectant",
      order_id: created.razorpayOrderId,
      prefill: created.prefill,
      theme: { color: "#004A5D" },
      modal: { ondismiss: () => setStatus({ kind: "error", message: "Payment cancelled. Your cart is still here when you're ready." }) },
      handler: async (r) => {
        setStatus({ kind: "working", step: "confirming" });
        const confirmed = await confirmPayment({
          razorpayOrderId: r.razorpay_order_id,
          razorpayPaymentId: r.razorpay_payment_id,
          razorpaySignature: r.razorpay_signature,
        });
        if (!confirmed.ok) return setStatus({ kind: "error", message: confirmed.message });
        clear();
        router.push(`/checkout/success?o=${confirmed.publicId}`);
      },
    });
    rzp.on("payment.failed", (r) => setStatus({ kind: "error", message: r.error.description || "Payment failed. Please try again." }));
    rzp.open();
  }
  // ... keep the `if (!ready)` and empty-cart branches unchanged ...
```

Inside the form:
- Under each input add `{errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name}</span>}` (same for `phone`, `email`, `gstin`, `address`, `city`, `pincode`), and add `aria-invalid={!!errors.name}` on the inputs.
- Replace the CTA block:
```tsx
<button type="submit" disabled={working} className="btn mt-6 w-full rounded-full bg-orient px-6 py-4 font-semibold text-white hover:bg-sherpa disabled:opacity-60">
  {status.kind === "working"
    ? { creating: "Preparing your order…", paying: "Complete payment in the Razorpay window", confirming: "Confirming payment…" }[status.step]
    : "Pay securely"}
</button>
<p className="mt-3 text-xs text-ink/55">Payments are handled by Razorpay: UPI, cards, net banking and wallets. We never see your card details.</p>
{status.kind === "error" && (
  <p role="alert" className="mt-3 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-800">{status.message}</p>
)}
```
Remove the old `sent` state and screen, and the `CONTACT`/`formatPrice` imports if no longer used.

- [ ] **Step 8: Success page `app/checkout/success/page.tsx`**

```tsx
import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, Clock } from "lucide-react";
import { createServiceClient } from "@/lib/supabase/server";
import { getOrderByPublicId } from "@/lib/db/orders";
import { formatPrice } from "@/lib/money";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default async function SuccessPage(props: PageProps<"/checkout/success">) {
  const { o } = await props.searchParams;
  const order = typeof o === "string" ? await getOrderByPublicId(createServiceClient(), o) : null;

  return (
    <section aria-labelledby="success-title" className="bg-spring">
      <div className="wrap pb-20 pt-28 sm:pt-36">
        {!order ? (
          <div className="rounded-[2rem] bg-white p-10 text-center ring-1 ring-spring-deep">
            <h1 id="success-title" className="text-headline font-normal text-sherpa-deep">We couldn&rsquo;t find that order.</h1>
            <p className="mt-3 text-ink/65">If you have paid, email {CONTACT.email} with your payment reference and we&rsquo;ll sort it out.</p>
          </div>
        ) : (
          <div className="mx-auto max-w-[40rem] rounded-[2rem] bg-white p-8 ring-1 ring-spring-deep sm:p-12">
            {order.status === "paid" ? (
              <CheckCircle2 aria-hidden className="size-12 text-orient" strokeWidth={1.5} />
            ) : (
              <Clock aria-hidden className="size-12 text-orient" strokeWidth={1.5} />
            )}
            <h1 id="success-title" className="mt-6 text-headline font-normal text-sherpa-deep">
              {order.status === "paid" ? "Thank you. Your order is confirmed." : "Payment is being confirmed."}
            </h1>
            <p className="mt-3 text-ink/65">
              Order {order.orderNumber}. {order.status === "paid" ? `We've emailed ${order.customerEmail} and will confirm dispatch within one working day.` : "This usually takes a moment. If it doesn't update, we'll email you once the payment clears."}
            </p>
            <ul className="mt-8 space-y-3 border-t border-spring-deep pt-6 text-sm">
              {order.items.map((i) => (
                <li key={`${i.name}-${i.size}`} className="flex justify-between gap-4">
                  <span className="text-ink/70">{i.name}, {i.size} × {i.qty}</span>
                  <span className="font-semibold text-sherpa-deep">{formatPrice(i.unitPricePaise * i.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-5 flex justify-between border-t border-spring-deep pt-5">
              <span className="font-semibold text-sherpa-deep">Total paid</span>
              <span className="text-title font-semibold text-sherpa-deep">{formatPrice(order.subtotalPaise)}</span>
            </div>
            <Link href="/" className="btn mt-8 inline-block rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa">
              Back to home
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
```
(The "emailed" sentence is only true once Task 10 ships. If Task 10 is skipped, change it to "We'll confirm dispatch within one working day by phone or email.")

- [ ] **Step 9: Verify end to end in Razorpay test mode**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`. Expected: clean.

With the user's dev server running and test keys in `.env.local`: add the 500 ml kit to the cart, fill checkout, pay with Razorpay's test UPI id `success@razorpay` (or test card `4111 1111 1111 1111`, any future expiry, any CVV). Expected: redirect to `/checkout/success?o=…` showing "Thank you. Your order is confirmed." Then check:
```bash
curl -s "http://127.0.0.1:54321/rest/v1/orders?select=order_number,status,razorpay_payment_id,subtotal_paise" -H "apikey: <SERVICE_ROLE_KEY>" -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```
Expected: one row, `status: "paid"`, a `pay_…` id, `subtotal_paise: 104900`.

Then close the Razorpay modal without paying on a second attempt. Expected: the error line "Payment cancelled…" appears and the cart still has the item.

- [ ] **Step 10: Privacy copy, one line now**

In `content/privacy.ts` replace the sentence "We do not take payments on this website…" with: "Payments are taken by Razorpay, a payment gateway licensed in India. Your card, UPI or bank details go to Razorpay, not to us; we receive only a payment reference and the amount." (The rest of the privacy copy is updated in Task 9.)

- [ ] **Step 11: Commit**

```bash
git add -A
git commit -m "razorpay checkout with server-side verification"
```

---

### Task 7: Razorpay webhook (authoritative, idempotent)

**Files:**
- Create: `lib/razorpay/webhook.ts`, `app/api/razorpay/webhook/route.ts`, `scripts/sign-webhook.mjs`, `tests/shop/webhook.test.mjs`

**Interfaces:**
- Consumes: `verifyWebhookSignature`, `recordWebhookEvent`, `markPaid`, `markFailed`, `serverEnv`, `createServiceClient`.
- Produces:
  - `type WebhookDb = { recordEvent(id: string, event: string): Promise<boolean>; markPaid(razorpayOrderId: string, paymentId: string): Promise<"paid" | "already_paid" | "missing">; markFailed(razorpayOrderId: string): Promise<void> }`
  - `applyWebhookEvent(input: { eventId: string; payload: unknown }, db: WebhookDb): Promise<{ handled: boolean; outcome: string }>`
  - Route `POST /api/razorpay/webhook`

- [ ] **Step 1: Failing tests**

`tests/shop/webhook.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { applyWebhookEvent } from "../../lib/razorpay/webhook.ts";

function fakeDb() {
  const calls = [];
  const seen = new Set();
  return {
    calls,
    recordEvent: async (id, event) => { calls.push(["recordEvent", id, event]); if (seen.has(id)) return false; seen.add(id); return true; },
    markPaid: async (o, p) => { calls.push(["markPaid", o, p]); return "paid"; },
    markFailed: async (o) => { calls.push(["markFailed", o]); },
  };
}

const captured = { event: "payment.captured", payload: { payment: { entity: { id: "pay_1", order_id: "order_1", status: "captured" } } } };

test("payment.captured marks the order paid", async () => {
  const db = fakeDb();
  const r = await applyWebhookEvent({ eventId: "evt_1", payload: captured }, db);
  assert.deepEqual(r, { handled: true, outcome: "paid" });
  assert.deepEqual(db.calls[1], ["markPaid", "order_1", "pay_1"]);
});

test("order.paid is handled the same way", async () => {
  const db = fakeDb();
  const payload = { event: "order.paid", payload: { order: { entity: { id: "order_1" } }, payment: { entity: { id: "pay_1", order_id: "order_1" } } } };
  const r = await applyWebhookEvent({ eventId: "evt_2", payload }, db);
  assert.equal(r.outcome, "paid");
});

test("a duplicate event id is ignored without touching orders", async () => {
  const db = fakeDb();
  await applyWebhookEvent({ eventId: "evt_1", payload: captured }, db);
  const r = await applyWebhookEvent({ eventId: "evt_1", payload: captured }, db);
  assert.deepEqual(r, { handled: false, outcome: "duplicate" });
  assert.equal(db.calls.filter((c) => c[0] === "markPaid").length, 1);
});

test("payment.failed only fails pending orders (markFailed is already guarded)", async () => {
  const db = fakeDb();
  const payload = { event: "payment.failed", payload: { payment: { entity: { id: "pay_9", order_id: "order_1" } } } };
  const r = await applyWebhookEvent({ eventId: "evt_3", payload }, db);
  assert.deepEqual(r, { handled: true, outcome: "failed" });
  assert.deepEqual(db.calls[1], ["markFailed", "order_1"]);
});

test("unknown events and malformed payloads are acknowledged, not applied", async () => {
  const db = fakeDb();
  assert.deepEqual(await applyWebhookEvent({ eventId: "evt_4", payload: { event: "refund.created" } }, db), { handled: false, outcome: "ignored" });
  assert.deepEqual(await applyWebhookEvent({ eventId: "evt_5", payload: { event: "payment.captured", payload: {} } }, db), { handled: false, outcome: "malformed" });
  assert.deepEqual(await applyWebhookEvent({ eventId: "", payload: captured }, db), { handled: false, outcome: "missing_event_id" });
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`. Expected: FAIL, module not found.

- [ ] **Step 3: Implement `lib/razorpay/webhook.ts`**

```ts
export type WebhookDb = {
  recordEvent(id: string, event: string): Promise<boolean>;
  markPaid(razorpayOrderId: string, paymentId: string): Promise<"paid" | "already_paid" | "missing">;
  markFailed(razorpayOrderId: string): Promise<void>;
};

type Payload = { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string } } } };

/*
  The webhook is the authoritative record of payment: it arrives even when the browser closed
  before the handler ran. Razorpay retries, so every event id is recorded once.
*/
export async function applyWebhookEvent(input: { eventId: string; payload: unknown }, db: WebhookDb): Promise<{ handled: boolean; outcome: string }> {
  if (!input.eventId) return { handled: false, outcome: "missing_event_id" };
  const body = (input.payload ?? {}) as Payload;
  const event = body.event ?? "";
  if (!["payment.captured", "order.paid", "payment.failed"].includes(event)) return { handled: false, outcome: "ignored" };

  const payment = body.payload?.payment?.entity;
  if (!payment?.id || !payment.order_id) return { handled: false, outcome: "malformed" };

  if (!(await db.recordEvent(input.eventId, event))) return { handled: false, outcome: "duplicate" };

  if (event === "payment.failed") {
    await db.markFailed(payment.order_id);
    return { handled: true, outcome: "failed" };
  }
  const outcome = await db.markPaid(payment.order_id, payment.id);
  return { handled: true, outcome };
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`. Expected: PASS.

- [ ] **Step 5: Route handler `app/api/razorpay/webhook/route.ts`**

```ts
import { serverEnv } from "@/lib/env";
import { createServiceClient } from "@/lib/supabase/server";
import { verifyWebhookSignature } from "@/lib/razorpay/signature";
import { applyWebhookEvent } from "@/lib/razorpay/webhook";
import { markFailed, markPaid, recordWebhookEvent } from "@/lib/db/orders";

export async function POST(request: Request) {
  const raw = await request.text(); // signature is over the raw body; never re-serialise
  const signature = request.headers.get("x-razorpay-signature") ?? "";
  if (!verifyWebhookSignature(raw, signature, serverEnv("RAZORPAY_WEBHOOK_SECRET"))) {
    return new Response("invalid signature", { status: 400 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(raw);
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  const db = createServiceClient();
  const result = await applyWebhookEvent(
    { eventId: request.headers.get("x-razorpay-event-id") ?? "", payload },
    {
      recordEvent: (id, event) => recordWebhookEvent(db, id, event),
      markPaid: (o, p) => markPaid(db, o, p),
      markFailed: (o) => markFailed(db, o),
    },
  );
  return Response.json(result);
}
```

- [ ] **Step 6: Local signing script `scripts/sign-webhook.mjs`**

```js
// Usage: node scripts/sign-webhook.mjs <secret> <order_id> <payment_id> [event]
// Prints a curl command that posts a signed payment.captured (or given event) to the local site.
import { createHmac } from "node:crypto";

const [secret, orderId, paymentId, event = "payment.captured"] = process.argv.slice(2);
if (!secret || !orderId || !paymentId) {
  console.error("usage: node scripts/sign-webhook.mjs <secret> <order_id> <payment_id> [event]");
  process.exit(1);
}
const body = JSON.stringify({ event, payload: { payment: { entity: { id: paymentId, order_id: orderId, status: "captured" } } } });
const sig = createHmac("sha256", secret).update(body).digest("hex");
const eventId = `evt_local_${Date.now()}`;
console.log(
  `curl -s -X POST http://localhost:3000/api/razorpay/webhook -H "Content-Type: application/json" -H "x-razorpay-signature: ${sig}" -H "x-razorpay-event-id: ${eventId}" --data '${body}'`,
);
```

- [ ] **Step 7: Verify against the running site**

Set `RAZORPAY_WEBHOOK_SECRET=localsecret` in `.env.local` (the user restarts their dev server). Create an order through checkout but close the modal without paying, then read its `razorpay_order_id` from the database (curl from Task 6 step 9). Run the printed curl from `node scripts/sign-webhook.mjs localsecret <order_id> pay_local1`.
Expected: `{"handled":true,"outcome":"paid"}`; the order row is now `paid`. Run the same curl again (same event id). Expected: `{"handled":false,"outcome":"duplicate"}`. Change one character of the signature. Expected: HTTP 400 `invalid signature`.

- [ ] **Step 8: Commit**

```bash
git add lib/razorpay/webhook.ts app/api/razorpay/webhook/route.ts scripts/sign-webhook.mjs tests/shop/webhook.test.mjs
git commit -m "razorpay webhook with idempotent paid/failed handling"
```

---

### Task 8: Leads from the assessment form and quote requests

**Files:**
- Create: `lib/db/leads.ts`, `app/actions/leads.ts`, `components/products/RequestQuoteForm.tsx`, `tests/shop/lead.test.mjs`
- Modify: `lib/validate.ts` (add `parseLead`), `components/sections/Contact.tsx`, `app/products/[slug]/page.tsx`

**Interfaces:**
- Consumes: `normalisePhone`, `isEmail`, `createServiceClient`, `PRODUCTS`.
- Produces:
  - `type LeadInput = { kind: "assessment" | "bulk_request"; name: string; phone: string; organisation: string | null; email: string | null; sector: string | null; productSlug: string | null; quantity: number | null; message: string | null; page: string | null }`
  - `parseLead(input: Record<string, unknown>): { ok: true; value: LeadInput } | { ok: false; errors: FieldErrors }`
  - `insertLead(db: Db, lead: LeadInput): Promise<void>`
  - Server action `submitLead(prev: LeadState, formData: FormData): Promise<LeadState>` with `type LeadState = { status: "idle" | "sent" | "error"; errors?: FieldErrors; message?: string }`
  - `<RequestQuoteForm productSlug name size />`

- [ ] **Step 1: Failing tests**

`tests/shop/lead.test.mjs`:
```js
import { test } from "node:test";
import assert from "node:assert/strict";
import { parseLead } from "../../lib/validate.ts";

test("assessment lead needs a name and phone; the rest is optional", () => {
  const r = parseLead({ kind: "assessment", name: "Asha", phone: "9967053755", organisation: "", sector: "School or college", page: "/contact" });
  assert.equal(r.ok, true);
  assert.deepEqual(r.value, {
    kind: "assessment", name: "Asha", phone: "+919967053755", organisation: null, email: null,
    sector: "School or college", productSlug: null, quantity: null, message: null, page: "/contact",
  });
});

test("bulk request carries product and quantity", () => {
  const r = parseLead({ kind: "bulk_request", name: "Ravi", phone: "9967053755", email: "r@x.in", product_slug: "surface-protectant-20l", quantity: "4" });
  assert.equal(r.ok, true);
  assert.equal(r.value.productSlug, "surface-protectant-20l");
  assert.equal(r.value.quantity, 4);
});

test("rejects bad kind, phone, email and quantity", () => {
  const r = parseLead({ kind: "other", name: "", phone: "1", email: "nope", quantity: "0" });
  assert.equal(r.ok, false);
  assert.deepEqual(Object.keys(r.errors).sort(), ["email", "kind", "name", "phone", "quantity"]);
});
```

- [ ] **Step 2: Run it to verify it fails**

Run: `npm test`. Expected: FAIL, `parseLead` is not exported.

- [ ] **Step 3: Add `parseLead` to `lib/validate.ts`**

```ts
export type LeadInput = {
  kind: "assessment" | "bulk_request";
  name: string;
  phone: string;
  organisation: string | null;
  email: string | null;
  sector: string | null;
  productSlug: string | null;
  quantity: number | null;
  message: string | null;
  page: string | null;
};

export function parseLead(input: Record<string, unknown>): { ok: true; value: LeadInput } | { ok: false; errors: FieldErrors } {
  const errors: FieldErrors = {};
  const kind = str(input.kind, 20);
  const name = str(input.name, 120);
  const phone = normalisePhone(input.phone);
  const email = opt(input.email, 200)?.toLowerCase() ?? null;
  const quantityRaw = str(input.quantity, 10);
  const quantity = quantityRaw ? Number(quantityRaw) : null;

  if (kind !== "assessment" && kind !== "bulk_request") errors.kind = "Unknown form.";
  if (name.length < 2) errors.name = "Please enter your name.";
  if (!phone) errors.phone = "Please enter a 10-digit Indian mobile number.";
  if (email && !isEmail(email)) errors.email = "Please enter a valid email address.";
  if (quantity !== null && (!Number.isInteger(quantity) || quantity < 1 || quantity > 100000)) errors.quantity = "Please enter a whole number of packs.";

  if (Object.keys(errors).length) return { ok: false, errors };
  return {
    ok: true,
    value: {
      kind: kind as LeadInput["kind"],
      name,
      phone: phone!,
      organisation: opt(input.organisation, 150),
      email,
      sector: opt(input.sector, 80),
      productSlug: opt(input.product_slug, 80),
      quantity,
      message: opt(input.message, 1000),
      page: opt(input.page, 200),
    },
  };
}
```

- [ ] **Step 4: Run the tests**

Run: `npm test`. Expected: PASS.

- [ ] **Step 5: `lib/db/leads.ts`**

```ts
import "server-only";
import type { Db } from "../supabase/server";
import type { LeadInput } from "../validate";

export async function insertLead(db: Db, l: LeadInput): Promise<void> {
  const { error } = await db.from("leads").insert({
    kind: l.kind,
    name: l.name,
    phone: l.phone,
    organisation: l.organisation,
    email: l.email,
    sector: l.sector,
    product_slug: l.productSlug,
    quantity: l.quantity,
    message: l.message,
    page: l.page,
  });
  if (error) throw error;
}
```

- [ ] **Step 6: Server action `app/actions/leads.ts`**

```ts
"use server";

import { createServiceClient } from "@/lib/supabase/server";
import { insertLead } from "@/lib/db/leads";
import { parseLead, type FieldErrors } from "@/lib/validate";

export type LeadState = { status: "idle" | "sent" | "error"; errors?: FieldErrors; message?: string };

export async function submitLead(_prev: LeadState, formData: FormData): Promise<LeadState> {
  // Honeypot: real visitors never see or fill this field.
  if (String(formData.get("company_website") ?? "")) return { status: "sent" };

  const parsed = parseLead(Object.fromEntries(Array.from(formData.entries()).map(([k, v]) => [k, String(v)])));
  if (!parsed.ok) return { status: "error", errors: parsed.errors, message: "Please check the highlighted fields." };

  try {
    await insertLead(createServiceClient(), parsed.value);
  } catch (e) {
    console.error("lead: insert failed", e);
    return { status: "error", message: "Something went wrong on our side. Please call us or try again in a minute." };
  }
  return { status: "sent" };
}
```

- [ ] **Step 7: Rewire `components/sections/Contact.tsx`**

Replace the `useState`/`onSubmit` with `useActionState`:
```tsx
import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions/leads";
// ...
const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
const errors = state.errors ?? {};
```
- `<form action={action} …>`; add hidden inputs `<input type="hidden" name="kind" value="assessment" />`, `<input type="hidden" name="page" value="/contact" />`, and the honeypot `<input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />`.
- Field errors under name and phone: `{errors.name && <span className="mt-1 block text-xs text-turquoise">{errors.name}</span>}`.
- Submit button: `disabled={pending}` with label `pending ? "Sending…" : "Book my assessment"`.
- Status line:
```tsx
<p className="mt-4 text-sm text-sherpa-tint" aria-live="polite">
  {state.status === "sent" ? "Thank you. We'll call you within one working day to arrange your visit." : state.status === "error" ? state.message : "We'll call you to arrange a convenient time. No obligation."}
</p>
```
- When `state.status === "sent"`, render the thank-you line in place of the form fields (wrap the fields and button in `{state.status !== "sent" && (...)}`).
- Remove the `CONTACT.email` `mailto:` logic; keep the contact details column as is.

- [ ] **Step 8: `components/products/RequestQuoteForm.tsx`**

```tsx
"use client";

import { useActionState } from "react";
import { submitLead, type LeadState } from "@/app/actions/leads";

/* Unpriced packs (and bulk buyers) ask for a quote; it lands as a bulk_request lead. */
export default function RequestQuoteForm({ productSlug, name, size }: { productSlug: string; name: string; size: string }) {
  const [state, action, pending] = useActionState<LeadState, FormData>(submitLead, { status: "idle" });
  const errors = state.errors ?? {};
  const field = "mt-2 w-full rounded-xl border border-spring-deep bg-white px-4 py-3 text-ink placeholder:text-ink/35 focus:border-orient focus:outline-none";
  const label = "block text-sm font-medium text-sherpa-deep";

  if (state.status === "sent")
    return (
      <p role="status" className="rounded-2xl bg-turquoise-tint px-5 py-4 text-sherpa-deep">
        Thank you. We&rsquo;ll send a quote for the {size} pack within one working day.
      </p>
    );

  return (
    <form action={action} className="rounded-[1.75rem] bg-spring p-5 sm:p-6">
      <p className="font-semibold text-sherpa-deep">Request a quote for the {size} pack</p>
      <input type="hidden" name="kind" value="bulk_request" />
      <input type="hidden" name="product_slug" value={productSlug} />
      <input type="hidden" name="page" value={`/products/${productSlug}`} />
      <input type="text" name="company_website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <label className={label}>
          Your name
          <input name="name" required autoComplete="name" aria-invalid={!!errors.name} className={field} />
          {errors.name && <span className="mt-1 block text-xs text-red-700">{errors.name}</span>}
        </label>
        <label className={label}>
          Phone
          <input name="phone" type="tel" required autoComplete="tel" aria-invalid={!!errors.phone} className={field} />
          {errors.phone && <span className="mt-1 block text-xs text-red-700">{errors.phone}</span>}
        </label>
        <label className={label}>
          Email <span className="text-ink/45">(optional)</span>
          <input name="email" type="email" autoComplete="email" aria-invalid={!!errors.email} className={field} />
          {errors.email && <span className="mt-1 block text-xs text-red-700">{errors.email}</span>}
        </label>
        <label className={label}>
          Organisation <span className="text-ink/45">(optional)</span>
          <input name="organisation" autoComplete="organization" className={field} />
        </label>
        <label className={label}>
          Number of packs
          <input name="quantity" inputMode="numeric" pattern="[0-9]*" defaultValue="1" aria-invalid={!!errors.quantity} className={field} />
          {errors.quantity && <span className="mt-1 block text-xs text-red-700">{errors.quantity}</span>}
        </label>
        <label className={`${label} sm:col-span-2`}>
          Anything we should know? <span className="text-ink/45">(optional)</span>
          <textarea name="message" rows={2} className={field} placeholder={`e.g. ${name} for a 40,000 sq ft campus`} />
        </label>
      </div>
      <button type="submit" disabled={pending} className="btn mt-5 rounded-full bg-orient px-6 py-3.5 font-semibold text-white hover:bg-sherpa disabled:opacity-60">
        {pending ? "Sending…" : "Request a quote"}
      </button>
      {state.status === "error" && !state.errors && <p role="alert" className="mt-3 text-sm text-red-800">{state.message}</p>}
    </form>
  );
}
```

In `app/products/[slug]/page.tsx`, replace the temporary "Request a quote" link from Task 3 with `<RequestQuoteForm productSlug={p.slug} name={p.name} size={p.size} />`.

- [ ] **Step 9: Verify**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`. Expected: clean.

With the dev server: submit the contact form with a bad phone. Expected: inline error, nothing stored. Submit a good one. Expected: thank-you line; the row appears:
```bash
curl -s "http://127.0.0.1:54321/rest/v1/leads?select=kind,name,phone,sector,product_slug,quantity&order=created_at.desc" -H "apikey: <SERVICE_ROLE_KEY>" -H "Authorization: Bearer <SERVICE_ROLE_KEY>"
```
Then request a quote from `/products/surface-protectant-20l`. Expected: a `bulk_request` row with `product_slug: "surface-protectant-20l"`.

- [ ] **Step 10: Commit**

```bash
git add -A
git commit -m "leads: assessment and quote forms store to supabase"
```

---

### Task 9: Admin revalidation hook, copy, docs and final checks

**Files:**
- Create: `app/api/revalidate/route.ts`
- Modify: `content/privacy.ts`, `content/faqs.ts` (only if an answer mentions email ordering), `README.md`, `../../CLAUDE.md` (parent project guide, §7 and §8)

**Interfaces:**
- Produces: `POST /api/revalidate` with header `x-revalidate-secret: <REVALIDATE_SECRET>` → `{ revalidated: true, tag: "products" }`. This is the admin dashboard's contract for instant price updates.

- [ ] **Step 1: Route handler `app/api/revalidate/route.ts`**

```ts
import { timingSafeEqual } from "node:crypto";
import { revalidateTag } from "next/cache";
import { serverEnv } from "@/lib/env";
import { PRODUCTS_TAG } from "@/lib/catalog";

function secretMatches(given: string, expected: string): boolean {
  const a = Buffer.from(given);
  const b = Buffer.from(expected);
  return a.length === b.length && timingSafeEqual(a, b);
}

/* Called by the admin dashboard after a price or visibility change. */
export async function POST(request: Request) {
  const given = request.headers.get("x-revalidate-secret") ?? "";
  if (!secretMatches(given, serverEnv("REVALIDATE_SECRET"))) return new Response("forbidden", { status: 403 });
  // { expire: 0 }: a changed price must never be served stale, even for one request.
  revalidateTag(PRODUCTS_TAG, { expire: 0 });
  return Response.json({ revalidated: true, tag: PRODUCTS_TAG });
}
```

- [ ] **Step 2: Verify the hook**

With the dev server running:
```bash
curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3000/api/revalidate
curl -s -X POST http://localhost:3000/api/revalidate -H "x-revalidate-secret: <REVALIDATE_SECRET from .env.local>"
```
Expected: `403`, then `{"revalidated":true,"tag":"products"}`. Then change the price in Studio (`http://127.0.0.1:54323`, table `products`, 500 ml → `99900`), call the hook, reload `/products`. Expected: ₹999 shows. Set it back to `104900` and call the hook again.

- [ ] **Step 3: Privacy policy copy**

In `content/privacy.ts` rewrite the two sections about forms and the cart:
- "Our contact and assessment forms" → "When you send a form on this site (an assessment request or a quote request), we store what you entered, with the date and the page it came from, in our customer database so that we can call you back. We do not store anything until you press the button."
- "Your cart and order requests" → keep the local-storage sentence, then: "When you place an order, we store your name, phone, email, delivery address, GSTIN if given, the items and the amount, so we can deliver and invoice. Payments are taken by Razorpay, a payment gateway licensed in India. Your card, UPI or bank details go to Razorpay, not to us; we receive only a payment reference and the amount. Razorpay's privacy policy applies to the payment itself."
- Add to "How we use what you send us": "Our database is hosted by Supabase. During development it runs on our own machines; before launch it will be hosted in India (AWS Mumbai region)."
Keep the "pending legal review" banner.

- [ ] **Step 4: README setup section**

Add to `README.md` after the install block:
````markdown
## Local data and payments

```bash
npm run db:start      # Supabase in Docker (first run downloads images)
npm run db:reset      # apply supabase/migrations and supabase/seed.sql
npm run db:types      # regenerate lib/supabase/types.ts after a migration
npm test              # unit tests (node --test)
```

Copy `.env.example` to `.env.local` and fill it from `npx supabase status -o env` and your Razorpay **test** keys.
Studio: http://127.0.0.1:54323. Prices and product visibility live in `public.products`; copy lives in `content/products.ts`.

Razorpay webhooks can't reach localhost. Sign a test event with `node scripts/sign-webhook.mjs <RAZORPAY_WEBHOOK_SECRET> <order_id> <payment_id>` and run the printed curl.
In production, register `https://protegohygiene.com/api/razorpay/webhook` for `payment.captured`, `order.paid` and `payment.failed`.

The admin dashboard (separate service) edits `products` and then calls `POST /api/revalidate` with header `x-revalidate-secret`.
````
Also delete the two "Before launch" bullets that mention the `mailto:` contact form and swapping it for the CRM endpoint.

- [ ] **Step 5: Update the parent project guide**

In `../../CLAUDE.md` (the ProteGo project guide, one level above `website/`):
- §7 table, `/contact` row: "form stores a lead in Supabase (`leads`)". `/cart`, `/checkout` row: "Razorpay checkout; orders in Supabase; prices from `products`; webhook at `/api/razorpay/webhook`".
- §8 add: "Oct 2026: prices moved to Supabase `products` (admin-editable); Razorpay live in test mode; placeholders (photos/video) stay until the client supplies assets. Admin dashboard is a separate service on a subdomain, built later; its contract is the shared database plus `POST /api/revalidate`."
- §10 add: "Local Supabase via `npm run db:start` (Docker); never commit `.env.local`."

- [ ] **Step 6: Final verification**

Run: `npx tsc --noEmit && npm run lint && npm test && npm run build`. Expected: all clean.
Screenshots (read-only Playwright against the user's running server) at 390, 1024 and 1440 px of `/products/diy-protection-kit-500ml`, `/products/surface-protectant-20l`, `/cart`, `/checkout`, `/contact`. Expected: no horizontal overflow; forms readable; the quote form sits inside the product hero column on desktop and stacks on phones.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "revalidate hook, privacy copy and setup docs"
```
Then, in the parent folder (not a git repo), nothing to commit; the CLAUDE.md edit is just saved.

---

### Task 10 (optional, do last): Order confirmation email

Skip this task if the client has not yet verified a sending domain with an email provider; the site works without it. If skipped, apply the sentence change noted in Task 6 step 8.

**Files:**
- Create: `lib/email/orderConfirmation.ts`
- Modify: `app/actions/orders.ts` (`confirmPayment`), `app/api/razorpay/webhook/route.ts`, `.env.example`

**Interfaces:**
- Produces: `sendOrderConfirmation(order: OrderSummary): Promise<void>` (no-op with a console warning when `RESEND_API_KEY` is unset).

- [ ] **Step 1: Install Resend, pinned**

`npm install --save-exact resend@6.31.0`. Add to `.env.example`:
```bash
RESEND_API_KEY=            # optional; order confirmation emails are skipped when unset
ORDER_EMAIL_FROM="ProteGo Hygiene <orders@protegohygiene.com>"
```

- [ ] **Step 2: `lib/email/orderConfirmation.ts`**

```ts
import "server-only";
import { Resend } from "resend";
import type { OrderSummary } from "../db/orders";
import { formatPrice } from "../money";
import { CONTACT } from "@/content/contact";

export async function sendOrderConfirmation(order: OrderSummary): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.ORDER_EMAIL_FROM;
  if (!key || !from) {
    console.warn(`email: RESEND_API_KEY not set, skipping confirmation for ${order.orderNumber}`);
    return;
  }
  const lines = order.items.map((i) => `${i.name}, ${i.size} × ${i.qty}: ${formatPrice(i.unitPricePaise * i.qty)}`).join("\n");
  await new Resend(key).emails.send({
    from,
    to: order.customerEmail,
    subject: `Order ${order.orderNumber} confirmed`,
    text: [
      `Hello ${order.customerName},`,
      "",
      `Thank you for your order. We've received your payment and will confirm dispatch within one working day.`,
      "",
      lines,
      `Total paid: ${formatPrice(order.subtotalPaise)}`,
      "",
      `Questions? Call ${CONTACT.phoneDisplay} or reply to this email.`,
      "",
      "ProteGo Hygiene",
      CONTACT.address,
    ].join("\n"),
  });
}
```

- [ ] **Step 3: Send once, on the first transition to paid**

In `confirmPayment` (Task 6 step 5) after `markPaid`, when `result === "paid"`: `const summary = await getOrderByPublicId(db, data!.public_id); if (summary) await sendOrderConfirmation(summary).catch((e) => console.error("email failed", e));` (move the `public_id` lookup above the send).

In the webhook route, wrap `markPaid` so that when it returns `"paid"` the same email is sent: look up the order's `public_id` by `razorpay_order_id`, fetch the summary, send. Because `markPaid` returns `"already_paid"` on the second path (browser handler vs webhook), the customer gets exactly one email.

- [ ] **Step 4: Verify**

`npx tsc --noEmit && npm run lint && npm test && npm run build`. With a real `RESEND_API_KEY` and a verified domain, complete a test payment and check the inbox; without a key, check the server log shows the "skipping confirmation" warning and the order still shows as paid.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "order confirmation email via resend"
```

---

## Self-review notes

- **Spec coverage.** Payments (Tasks 5–7), admin-editable prices (Tasks 1, 3, 9), placeholders untouched (no task edits `Placeholder.tsx`), initial version with current data (seed in Task 1 has one price), admin on a separate subdomain (only the DB and `/api/revalidate` are shared), local Docker Supabase (Task 1). Lead capture from the proposal's website scope (Task 8). Out of scope by the client's instruction: the dashboard itself, inventory deduction, invoices, chatbot, analytics pixels, SEO schema, blog, dispatch emails.
- **Type consistency.** `pricePaise` on `PricedProduct` everywhere; `subtotalPaise` on the cart; DB columns `price_paise`, `subtotal_paise`, `unit_price_paise`; `markPaid` returns `"paid" | "already_paid" | "missing"` in Tasks 5, 7 and 10; `LeadState` and `submitLead` signature identical in Task 8's two forms.
- **Known limitation to tell the client.** Razorpay test mode only until the client's live keys and KYC are in place; the webhook URL must be registered in the Razorpay dashboard at launch; emails need a verified sending domain.
