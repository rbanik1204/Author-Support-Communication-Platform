import { Outlet } from "react-router"

function AuthorLayout() {
  return (
    <div className="author-layout">
      <aside>
        <h2>BookLeaf Author</h2>
        {/* Author navigation goes here */}
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AuthorLayout
