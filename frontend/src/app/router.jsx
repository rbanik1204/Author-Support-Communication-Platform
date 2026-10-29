import { createBrowserRouter } from "react-router"
import App from "./App"
import PageLoader from "./components/PageLoader"

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { Login } = await import("./routes/Login")
          return { Component: Landing }
        },
      },
      {
        path: "author",
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { Sessions } = await import("./routes/AuthorLayout")
          return { Component: Sessions }
        },
        children: [
          {
            path: "books",
          },
        ],
      },
      {
        path: "sessions/:session_id/events",
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { SessionEvents } = await import("./pages/SessionEvents")
          return { Component: SessionEvents }
        },
      },
      {
        path: "heatmap",
        HydrateFallback: PageLoader,
        lazy: async () => {
          const { Heatmap } = await import("./pages/Heatmap")
          return { Component: Heatmap }
        },
      },
    ],
  },
])

export default router
