import { createBrowserRouter } from "react-router"

import App from "../app/App"
import PageLoader from "../components/common/PageLoader"
import RouteError from "../components/common/RouteError"

const router = createBrowserRouter([
  {
    path: "/",

    Component: App,

    // Used only if this application participates in hydration.
    HydrateFallback: PageLoader,

    ErrorBoundary: RouteError,

    children: [
      // ==================================
      // LOGIN
      // ==================================

      {
        index: true,

        lazy: async () => {
          const [{ default: Login }, { googleLoginAction }, { loginLoader }] =
            await Promise.all([
              import("../routes/auth/Login"),
              import("../actions/auth.action"),
              import("../loaders/auth.loader"),
            ])

          return {
            Component: Login,
            action: googleLoginAction,
            loader: loginLoader,
          }
        },
      },

      // ==================================
      // AUTHOR PORTAL
      // ==================================

      {
        path: "author",

        lazy: async () => {
          const [{ default: AuthorLayout }, { requireAuthorLoader }] =
            await Promise.all([
              import("../layouts/AuthorLayout"),
              import("../loaders/auth.loader"),
            ])

          return {
            Component: AuthorLayout,
            loader: requireAuthorLoader,
          }
        },

        children: [
          // AUTHOR DASHBOARD

          {
            index: true,

            lazy: async () => {
              const [{ default: Dashboard }, { authorDashboardLoader }] =
                await Promise.all([
                  import("../pages/author/Dashboard"),
                  import("../loaders/author.loader"),
                ])

              return {
                Component: Dashboard,
                loader: authorDashboardLoader,
              }
            },
          },

          // MY BOOKS

          {
            path: "books",

            lazy: async () => {
              const [{ default: Books }, { booksLoader }] = await Promise.all([
                import("../pages/author/Books"),
                import("../loaders/book.loader"),
              ])

              return {
                Component: Books,
                loader: booksLoader,
              }
            },
          },

          // MY TICKETS

          {
            path: "tickets",

            lazy: async () => {
              const [{ default: Tickets }, { authorTicketsLoader }] =
                await Promise.all([
                  import("../pages/author/Tickets"),
                  import("../loaders/ticket.loader"),
                ])

              return {
                Component: Tickets,
                loader: authorTicketsLoader,
              }
            },
          },

          // CREATE TICKET

          {
            path: "tickets/new",

            lazy: async () => {
              const [
                { default: CreateTicket },
                { createTicketBooksLoader },
                { createTicketAction },
              ] = await Promise.all([
                import("../pages/author/CreateTicket"),
                import("../loaders/book.loader"),
                import("../actions/ticket.action"),
              ])

              return {
                Component: CreateTicket,
                loader: createTicketBooksLoader,
                action: createTicketAction,
              }
            },
          },

          // DYNAMIC AUTHOR TICKET DETAILS

          {
            path: "tickets/:ticketId",

            lazy: async () => {
              const [
                { default: TicketDetails },
                { authorTicketDetailsLoader },
              ] = await Promise.all([
                import("../pages/author/TicketDetails"),
                import("../loaders/ticket.loader"),
              ])

              return {
                Component: TicketDetails,
                loader: authorTicketDetailsLoader,
              }
            },
          },
        ],
      },

      // ==================================
      // ADMIN PORTAL
      // ==================================

      {
        path: "admin",

        lazy: async () => {
          const [{ default: AdminLayout }, { requireAdminLoader }] =
            await Promise.all([
              import("../layouts/AdminLayout"),
              import("../loaders/auth.loader"),
            ])

          return {
            Component: AdminLayout,
            loader: requireAdminLoader,
          }
        },

        children: [
          // ADMIN DASHBOARD

          {
            index: true,

            lazy: async () => {
              const [{ default: Dashboard }, { adminDashboardLoader }] =
                await Promise.all([
                  import("../pages/admin/Dashboard"),
                  import("../loaders/admin.loader"),
                ])

              return {
                Component: Dashboard,
                loader: adminDashboardLoader,
              }
            },
          },

          // TICKET QUEUE

          {
            path: "tickets",

            lazy: async () => {
              const [{ default: TicketQueue }, { adminTicketQueueLoader }] =
                await Promise.all([
                  import("../pages/admin/TicketQueue"),
                  import("../loaders/ticket.loader"),
                ])

              return {
                Component: TicketQueue,
                loader: adminTicketQueueLoader,
              }
            },
          },

          // DYNAMIC ADMIN TICKET DETAILS

          {
            path: "tickets/:ticketId",

            lazy: async () => {
              const [
                { default: TicketDetails },
                { adminTicketDetailsLoader },
                { adminTicketAction },
              ] = await Promise.all([
                import("../pages/admin/TicketDetails"),
                import("../loaders/ticket.loader"),
                import("../actions/admin.action"),
              ])

              return {
                Component: TicketDetails,
                loader: adminTicketDetailsLoader,
                action: adminTicketAction,
              }
            },
          },

          // AUTHOR DIRECTORY

          {
            path: "authors",

            lazy: async () => {
              const [{ default: Authors }, { adminAuthorsLoader }] =
                await Promise.all([
                  import("../pages/admin/Authors"),
                  import("../loaders/admin.loader"),
                ])

              return {
                Component: Authors,
                loader: adminAuthorsLoader,
              }
            },
          },

          // DYNAMIC AUTHOR DETAILS

          {
            path: "authors/:authorId",

            lazy: async () => {
              const [{ default: AuthorDetails }, { adminAuthorDetailsLoader }] =
                await Promise.all([
                  import("../pages/admin/AuthorDetails"),
                  import("../loaders/admin.loader"),
                ])

              return {
                Component: AuthorDetails,
                loader: adminAuthorDetailsLoader,
              }
            },
          },
        ],
      },
    ],
  },
])

export default router
