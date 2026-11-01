# BookLeaf — Frontend

The frontend for the **BookLeaf Author Support & Communication Platform**, a web application that provides separate author-facing and admin-facing interfaces for managing books, support tickets, and author communications.

The application is built with React and React Router. It communicates with the backend through a REST API and supports role-based navigation, ticket management, AI-assisted response drafting, and near-real-time ticket updates.

## Live Application

- **Frontend:** https://author-support-communication-platfo.vercel.app/
- **Backend API:** https://author-support-communication-platform.onrender.com/

## 1. Technology Stack

| Technology              | Purpose                                                   |
| ----------------------- | --------------------------------------------------------- |
| React 19                | Component-based UI                                        |
| React Router 8          | Routing, nested layouts, loaders, actions, and navigation |
| Vite                    | Development server and production build                   |
| Tailwind CSS            | Utility-first styling                                     |
| JavaScript (ES Modules) | Application logic                                         |
| Fetch API               | Backend communication                                     |
| Google OAuth            | Google sign-in integration                                |

## 2. Application Architecture

The frontend follows a feature-oriented structure with a clear separation between routing, UI components, data loading, mutations, and API communication.

### Architecture responsibilities

- **Pages:** Render the author and admin application screens.
- **Layouts:** Provide separate navigation and structural layouts for authors and administrators.
- **Components:** Reusable UI elements for tickets, books, status indicators, filters, and common states.
- **Loaders:** Retrieve data before route components render.
- **Actions:** Handle form submissions and route-level mutations.
- **Services:** Encapsulate HTTP requests to backend endpoints.
- **Config:** Centralizes the backend API base URL.

### Data flow

```text
User Interaction
       |
       v
React Router
       |
       +------> Loader ------> API Service ------> Backend REST API
       |                                          |
       |                                          v
       |                                     MongoDB
       |
       +------> Action ------> API Service ------> Backend REST API
       |
       v
React Components
       |
       v
Rendered UI
```

React Router's data APIs are used to keep data fetching and mutations close to their respective routes.

## 3. Project Structure

```text
frontend/
├── public/
├── src/
│   ├── actions/
│   │   ├── admin-ticket.action.js
│   │   ├── auth.action.js
│   │   └── ticket.action.js
│   │
│   ├── app/
│   │   ├── App.jsx
│   │   └── router.jsx
│   │
│   ├── components/
│   │   ├── books/
│   │   │   └── BooksTable.jsx
│   │   ├── common/
│   │   │   ├── EmptyState.jsx
│   │   │   ├── ErrorState.jsx
│   │   │   ├── PageLoader.jsx
│   │   │   ├── Pagination.jsx
│   │   │   └── RouteError.jsx
│   │   └── tickets/
│   │       ├── AIDraftEditor.jsx
│   │       ├── CategoryBadge.jsx
│   │       ├── InternalNotes.jsx
│   │       ├── PriorityBadge.jsx
│   │       ├── TicketControls.jsx
│   │       ├── TicketConversation.jsx
│   │       ├── TicketFilters.jsx
│   │       ├── TicketForm.jsx
│   │       └── TicketStatusBadge.jsx
│   │
│   ├── config/
│   │   └── api.js
│   │
│   ├── layouts/
│   │   ├── AdminLayout.jsx
│   │   └── AuthorLayout.jsx
│   │
│   ├── loaders/
│   │   ├── admin.loader.js
│   │   ├── auth.loader.js
│   │   ├── author.loader.js
│   │   ├── book.loader.js
│   │   └── ticket.loader.js
│   │
│   ├── pages/
│   │   ├── admin/
│   │   │   ├── AuthorDetails.jsx
│   │   │   ├── Authors.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TicketDetails.jsx
│   │   │   └── TicketQueue.jsx
│   │   │
│   │   └── author/
│   │       ├── Books.jsx
│   │       ├── CreateTicket.jsx
│   │       ├── Dashboard.jsx
│   │       ├── TicketDetails.jsx
│   │       └── Tickets.jsx
│   │
│   ├── routes/
│   │   └── auth/
│   │       └── Login.jsx
│   │
│   ├── services/
│   │   ├── admin-ticket.api.js
│   │   ├── auth.api.js
│   │   ├── books.api.js
│   │   └── tickets.api.js
│   │
│   ├── main.jsx
│   └── index.css
│
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

## 4. Routing Architecture

The application uses `createBrowserRouter` from React Router.

Routes are organized into three main sections:

1. Authentication routes
2. Author portal routes
3. Admin portal routes

The author and admin portals use separate nested layouts. Their parent routes also use authentication loaders to enforce role-specific access before rendering protected sections.

### 4.1 Authentication Routes

| Method | Frontend Route | Purpose                              |
| ------ | -------------- | ------------------------------------ |
| GET    | `/`            | Login page                           |
| POST   | `/`            | Login / Google authentication action |
| POST   | `/logout`      | Logout action                        |

The login route uses a lazy-loaded component, authentication action, and loader.

### 4.2 Author Portal Routes

The author portal is nested under `/author`.

| Route                       | Purpose                                         |
| --------------------------- | ----------------------------------------------- |
| `/author`                   | Author dashboard                                |
| `/author/books`             | View the author's books and royalty information |
| `/author/tickets`           | View submitted support tickets                  |
| `/author/tickets/new`       | Submit a new support ticket                     |
| `/author/tickets/:ticketId` | View an individual ticket and its conversation  |

**Dynamic path parameter:**

- `:ticketId` identifies the ticket whose details are being requested.

For example:

```text
/author/tickets/671a1234567890abcdef1234
```

The ticket details loader uses the ticket ID to retrieve the corresponding ticket. The backend independently verifies that the authenticated author owns that ticket.

### 4.3 Admin Portal Routes

The admin portal is nested under `/admin`.

| Route                      | Purpose                             |
| -------------------------- | ----------------------------------- |
| `/admin`                   | Admin dashboard                     |
| `/admin/tickets`           | View and manage the ticket queue    |
| `/admin/tickets/:ticketId` | Manage an individual support ticket |
| `/admin/authors`           | View the author directory           |
| `/admin/authors/:authorId` | View an individual author's details |

**Dynamic path parameters:**

- `:ticketId` identifies the ticket being managed.
- `:authorId` identifies the author whose details are being viewed.

Examples:

```text
/admin/tickets/671a1234567890abcdef1234

/admin/authors/671a1234567890abcdef5678
```

### 4.4 Dynamic Search Parameters

The admin ticket queue supports URL-based filters and pagination.

The following query parameters are used by the ticket queue:

| Query Parameter | Purpose                                          |
| --------------- | ------------------------------------------------ |
| `search`        | Search tickets using the supported search fields |
| `status`        | Filter tickets by status                         |
| `category`      | Filter tickets by support category               |
| `priority`      | Filter tickets by priority                       |
| `fromDate`      | Filter tickets from a selected date              |
| `toDate`        | Filter tickets up to a selected date             |
| `page`          | Select the current pagination page               |
| `limit`         | Control the number of tickets per page           |

Example:

```text
/admin/tickets?search=royalty&status=Open&category=Royalty%20%26%20Payments&priority=High&fromDate=2026-10-01&toDate=2026-10-31&page=1&limit=10
```

These filters are represented in the URL rather than being maintained exclusively in component state.

**Why URL search parameters?**

- Filters can be refreshed without losing their values.
- Filtered views can be bookmarked or shared.
- Pagination and filters remain synchronized.
- The backend receives the filtering criteria through query parameters.

Changing filters resets pagination to the first page.

## 5. Data Loading and Mutations

The application uses React Router loaders and actions to manage route-level data operations.

### Loaders

| Loader                      | Responsibility                                      |
| --------------------------- | --------------------------------------------------- |
| `loginLoader`               | Handles login-page authentication state             |
| `requireAuthorLoader`       | Protects author routes                              |
| `requireAdminLoader`        | Protects admin routes                               |
| `authorDashboardLoader`     | Loads author dashboard data                         |
| `booksLoader`               | Retrieves the author's books                        |
| `createTicketBooksLoader`   | Retrieves books for the ticket submission form      |
| `authorTicketsLoader`       | Retrieves the author's ticket list                  |
| `authorTicketDetailsLoader` | Retrieves an individual author's ticket             |
| `adminDashboardLoader`      | Loads admin dashboard data                          |
| `adminTicketQueueLoader`    | Retrieves the filtered admin ticket queue           |
| `adminTicketDetailsLoader`  | Retrieves an individual ticket for admin management |
| `adminAuthorsLoader`        | Retrieves the author directory                      |
| `adminAuthorDetailsLoader`  | Retrieves individual author details                 |

### Actions

| Action               | Responsibility                             |
| -------------------- | ------------------------------------------ |
| `googleLoginAction`  | Handles Google authentication              |
| `logoutAction`       | Logs out the authenticated user            |
| `createTicketAction` | Creates a support ticket                   |
| `adminTicketAction`  | Handles admin ticket-management operations |

The unified `adminTicketAction` dispatches operations based on the submitted intent:

- `update-status`
- `assign-ticket`
- `send-reply`
- `add-internal-note`
- `generate-draft`
- `update-classification`

This keeps related admin ticket mutations within one route action while maintaining separate API service functions.

## 6. API Integration

The frontend communicates with the backend using REST APIs.

### API Base URL

The backend URL is configured using a Vite environment variable.

`src/config/api.js`

```js
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ""

if (!API_BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not configured")
}

export default API_BASE_URL
```

Configure the following environment variable:

```env
VITE_API_BASE_URL=https://author-support-communication-platform.onrender.com
```

For local development, configure it to point to the local backend.

### Authentication

The frontend uses cookie-based session authentication.

Requests that require an authenticated session must include credentials so that the browser can send the session cookie to the backend.

The backend remains responsible for authentication, authorization, and role validation.

### API Endpoint Reference

#### Authentication

| Method | Endpoint       | Purpose                                 |
| ------ | -------------- | --------------------------------------- |
| POST   | `/auth/login`  | Authenticate a user                     |
| GET    | `/auth/me`     | Retrieve the current authenticated user |
| POST   | `/auth/logout` | Destroy the current session             |

#### Author

| Method | Endpoint                 | Purpose                                   |
| ------ | ------------------------ | ----------------------------------------- |
| GET    | `/api/books`             | Retrieve the authenticated author's books |
| POST   | `/api/tickets`           | Submit a support ticket                   |
| GET    | `/api/tickets`           | Retrieve the author's tickets             |
| GET    | `/api/tickets/:ticketId` | Retrieve an individual author's ticket    |

#### Admin

| Method | Endpoint                                      | Purpose                                     |
| ------ | --------------------------------------------- | ------------------------------------------- |
| GET    | `/api/admin/tickets`                          | Retrieve the ticket queue                   |
| GET    | `/api/admin/tickets/:ticketId`                | Retrieve ticket details                     |
| PATCH  | `/api/admin/tickets/:ticketId/status`         | Update ticket status                        |
| PATCH  | `/api/admin/tickets/:ticketId/assign`         | Assign ticket to the current admin          |
| POST   | `/api/admin/tickets/:ticketId/messages`       | Send a public reply or add an internal note |
| POST   | `/api/admin/tickets/:ticketId/draft`          | Generate an AI response draft               |
| PATCH  | `/api/admin/tickets/:ticketId/classification` | Override ticket category and/or priority    |

The admin ticket queue accepts the supported search and filter parameters described in the routing section.

## 7. Author Portal Features

The author-facing interface provides the following functionality.

### Dashboard

Provides an overview of the author's account and publishing activity.

### My Books

Displays the author's books and relevant publishing and royalty information, including:

- Book title and ISBN
- Genre
- Publication date and publishing status
- MRP
- Total copies sold
- Total royalty earned
- Royalty paid
- Royalty pending

The interface is designed to handle books that are still in production, published books, and books with zero royalty earnings.

### Submit a Support Query

Authors can submit support tickets with:

- A selected book or General / Account Level category
- Subject
- Detailed description
- Optional file attachments

The form communicates with the backend ticket-creation endpoint.

### My Tickets

Authors can view their submitted tickets, current status, original query, and admin responses.

Ticket statuses include:

- Open
- In Progress
- Resolved
- Closed

### Ticket Conversation

The ticket details page displays the conversation between the author and BookLeaf support.

Internal admin notes are excluded by the backend and are not exposed to authors.

## 8. Admin Portal Features

The admin-facing interface provides operational tools for managing author support.

### Dashboard

Provides an overview of support operations.

### Ticket Queue

Administrators can:

- View tickets across authors.
- Search and filter tickets.
- Filter by status, category, priority, and date.
- Navigate through paginated results.
- Identify urgent and older unresolved tickets.

The backend orders tickets by priority and then age, helping administrators focus on the most urgent work.

### Ticket Details and Management

Administrators can:

- View ticket and author information.
- Update ticket status.
- Assign a ticket to themselves.
- Send public replies.
- Add internal notes.
- Generate AI response drafts.
- Edit AI-generated drafts before sending.
- Override AI-generated category and priority classifications.

Internal notes are visible to administrators but not authors.

### Author Directory

Administrators can browse the author directory and open individual author details.

## 9. AI-Assisted Support Workflow

AI processing is handled by the backend. The frontend does not contain the Gemini API key or directly call the LLM provider.

The frontend provides the interface for administrators to use the AI-generated results.

### Classification

The ticket queue displays ticket categories and priority levels returned by the backend.

Administrators can override the classification and priority when necessary.

### AI-Drafted Responses

When an administrator opens a ticket, they can generate an AI response draft.

The generated draft is presented in an editable interface. The administrator can review and modify the content before sending it as a public response.

The frontend treats AI-generated text as a draft rather than automatically sending it to the author.

## 10. Near-Real-Time Ticket Updates

The application uses polling through React Router's `useRevalidator` API.

Both author and admin ticket details pages periodically revalidate their route data.

- Polling interval: **5 seconds**
- Revalidation occurs when the router is idle.
- The polling interval is cleared when the component unmounts.

This allows:

- Authors to see new admin replies and status changes without manually refreshing.
- Administrators to see new author messages without manually refreshing.

Polling was chosen as a straightforward implementation of the assignment's near-real-time requirement without introducing the additional infrastructure required for WebSockets or Server-Sent Events.

## 11. Error Handling and User Experience

The application includes reusable components for common UI states:

| Component    | Responsibility             |
| ------------ | -------------------------- |
| `PageLoader` | Loading state              |
| `RouteError` | Route-level error boundary |
| `ErrorState` | Display application errors |
| `EmptyState` | Display empty data states  |
| `Pagination` | Navigate paginated results |

The UI handles loading, empty, and error states rather than assuming that every API request succeeds.

Backend validation and authorization errors are handled through the API response flow.

## 12. Local Development Setup

### Prerequisites

- Node.js
- npm
- Running BookLeaf backend

### Installation

Clone the private repository and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_API_BASE_URL=http://localhost:3000
```

Use the actual local backend address and port configured in your environment.

### Start the development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

## 13. Deployment

The frontend is deployed on Vercel.

Production environment configuration:

```env
VITE_API_BASE_URL=https://author-support-communication-platform.onrender.com
```

The frontend communicates with the deployed backend using credentialed requests. The backend must allow the deployed frontend origin through its CORS configuration.

## 14. Security Considerations

- Authentication is maintained through backend-managed sessions.
- Requests include credentials where session authentication is required.
- Author and admin interfaces use separate protected route hierarchies.
- Backend middleware enforces role-based access control.
- Author ownership checks are performed by the backend, not trusted to frontend route parameters.
- Gemini API credentials remain exclusively on the backend.
- Frontend environment variables prefixed with `VITE_` are public build-time configuration and must never contain secrets.

## 15. Known Limitations and Future Improvements

Potential improvements for a production-scale application include:

- Replace polling with WebSockets or Server-Sent Events if update volume justifies it.
- Add more comprehensive frontend unit and integration tests.
- Add automated end-to-end tests for author and admin workflows.
- Improve accessibility and keyboard navigation.
- Add richer client-side form validation and attachment previews.
- Introduce more advanced dashboard analytics and reporting.
- Add robust retry and offline handling for transient network failures.

## 16. Important Notes

- The application is designed to work with the provided BookLeaf sample dataset seeded by the backend.
- The frontend does not independently determine user permissions; the backend is the source of truth for authorization.
- AI classification and response generation are backend responsibilities.
- AI-generated replies require administrator review before being sent.
- This project was developed as part of a confidential technical evaluation. The repository should remain private.
