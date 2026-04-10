# Client (Next.js)

NOTE:
i have used the render server so its sleep while inactive for 15 minutes so first request takes time as server starts again
and some data already added in the database so i have mentioned the ids below for testing

Data
Customer ids
6294c74e-18dc-4d39-bf0c-f5c1c3b54a90

Admin ids
3d8deac7-7406-476a-b575-3c0181d11fd0

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
   - `NEXT_PUBLIC_API_URL=https://bx-track-task-backend.onrender.com`
   - optional `NEXT_PUBLIC_USER_ID=<seeded user id>`
3. Install + run:
   ```bash
   npm install
   npm run dev
   ```

App URL: `https://bx-track-task-frontend.vercel.app/`

## Deploy on Vercel

1. Import `client` folder as a Vercel project.
2. Add env var:
   - `NEXT_PUBLIC_API_URL=https://bx-track-task-backend.onrender.com`
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

# Multi-Tenant CRM Assignment (NestJS + PostgreSQL + Next.js)

## Frontend Flow

- First the main step is the already seed data if the selected id is a customer id then automatic all the ui appeared for customer and if the login user id is admin then appeared the admin ui in there

### Architecture decisions

- I kept the project structure simple and modular so each main part of the system has been seperated. Customers, users, notes, and activity logs are separated into their own modules, which makes the code easier to read and maintain. I used PostgreSQL because the data is relational and the assignment flow needs transaction support. On the frontend, I focused on the required flows instead of spending too much time on UI design.

### How multi-tenancy isolation is enforced

- Each user belongs to one organization, and all records are connected to that organization. The backend always uses the logged-in user’s organization data when reading or writing data. I did not rely on the frontend to send the organization ID for ownership decisions. This keeps data isolated and prevents users from accessing records from another organization.

### How concurrency safety is achieved

- The main concurrency risk is customer assignment, because one user can only have 5 active customers. To handle this safely, I used a transaction around the assignment flow and checked the last count and then verify its less then 5 before saving the new assignment. This helps prevent race conditions when multiple requests happen at the same time.

### Performance strategy and indexing decisions

- Since the task mentions large customer data per organization, I added pagination and kept customer queries scoped by organization. I also added indexes on fields that are commonly used in filtering and search so list queries stay optimized.

### How I would scale this system

- If the system grows more, I would improve search, review pagination strategy for larger datasets, and move heavier work out of the request cycle where needed. I would also add better monitoring and tune database queries based on real usage patterns , and also implement the queues to handle the customers efficiently.

### Trade-offs made

- I focused more on correctness, structure, and clear backend logic than on UI polish or extra features. I tried to keep the solution practical and easy to explain instead of overengineering it.

### Production improvement explanation

- For the production improvement, I added logging for important backend requests. I chose this because it is useful for debugging, tracking issues, and understanding what is happening in the system without adding too much complexity.

## Submission Fields (fill these)

- GitHub repository URL: `https://github.com/HammadAhsan341/bx-track-task-frontend`
- Deployed frontend URL: `https://bx-track-task-frontend.vercel.app/`
- Deployed backend URL: `https://bx-track-task-backend.onrender.com`

Data
Customer ids
6294c74e-18dc-4d39-bf0c-f5c1c3b54a90

Admin ids
3d8deac7-7406-476a-b575-3c0181d11fd0
