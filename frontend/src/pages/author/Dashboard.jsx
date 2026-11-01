import { useRouteLoaderData, Form } from "react-router"

export default function Dashboard() {
  const user = useRouteLoaderData("author")

  return (
    <section>
      <h2>Author Dashboard</h2>
      <p>Welcome, {user.name}</p>
      <p>{user.email}</p>

      <Form method="post" action="/logout">
        <button type="submit">Logout</button>
      </Form>
    </section>
  )
}
