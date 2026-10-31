import React from "react"
import ReactDOM from "react-dom/client"

import { RouterProvider } from "react-router"
import { GoogleOAuthProvider } from "@react-oauth/google"

import router from "./app/router"

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <RouterProvider
        router={router}
        fallbackElement={<div>Loading BookLeaf...</div>}
      />
    </GoogleOAuthProvider>
  </React.StrictMode>
)
