import { useRouteLoaderData, Form } from "react-router"

export default function Dashboard() {
  const user = useRouteLoaderData("admin")

  return (
    <section>
      <h2>Admin Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <p>{user.email}</p>

      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
    </section>
  )
}
