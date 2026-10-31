import { isRouteErrorResponse, useRouteError } from "react-router"

function RouteError() {
  const error = useRouteError()

  if (isRouteErrorResponse(error)) {
    return (
      <div>
        <h1>{error.status}</h1>
        <p>{error.statusText}</p>
      </div>
    )
  }

  return (
    <div>
      <h1>Something went wrong</h1>
      <p>{error?.message || "An unexpected error occurred."}</p>
    </div>
  )
}

export default RouteError
