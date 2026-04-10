# Client (Next.js)

## Minimum Frontend Coverage

- Customer list with search + cursor pagination.
- Create customer.
- Edit customer.
- Notes list + add note.
- Activity logs section (table).
- Loading/error states for user context, customers, notes, activity logs, and mutations.
- Role-based UI behavior:
  - `admin`: can create users, assign customers, and delete customers.
  - `member`: can use customer list/create/edit/notes, but assign/delete actions are hidden.

## Assignment Flow Decision

- There is **no separate assignment page**.
- Assignment is handled inline in the customer workspace (table/card actions).
- If your final decision is auto-assignment, set:
  - `NEXT_PUBLIC_AUTO_ASSIGNMENT=true`
- In auto-assignment mode, manual assignment controls are hidden in the UI.

## Stack

- Next.js 15 (App Router)
- React 18
- TanStack Query v5
- TypeScript strict mode

## Run

1. Copy env:
   ```bash
   cp .env.local.example .env.local
   ```
2. Set:
   - `NEXT_PUBLIC_API_URL=http://localhost:3003`
   - optional `NEXT_PUBLIC_USER_ID=<seeded user id>`
   - optional `NEXT_PUBLIC_AUTO_ASSIGNMENT=true` (to hide manual assignment controls)
3. Install + run:
   ```bash
   npm install
   npm run dev
   ```

App URL: `http://localhost:3000`

## Deploy on Vercel

1. Import `client` folder as a Vercel project.
2. Add env var:
   - `NEXT_PUBLIC_API_URL=https://<your-backend-domain>`
3. Deploy.

## State Management

- Server state handled by React Query.
- Query keys are parameterized by `userId`, `search`, `cursor`.
- Mutations invalidate only relevant resources.
- Debounce hook prevents excessive search requests.

## Error Handling

- `apiRequest` normalizes backend validation and HTTP errors to readable messages.
- Every main mutation/query surfaces state-specific error text.

## UI Notes

- Authentication is simulated by the `x-user-id` header.
- Use user IDs from server seed output to switch users and test tenant isolation.
