import React from "react"
import ReactDOM from "react-dom/client"

import { RouterProvider } from "react-router"
import { GoogleOAuthProvider } from "@react-oauth/google"

import router from "./app/router"
console.log("Google Client ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID)
console.log("Current origin:", window.location.origin)
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <RouterProvider
      router={router}
      fallbackElement={<div>Loading BookLeaf...</div>}
    />
  </GoogleOAuthProvider>
)
