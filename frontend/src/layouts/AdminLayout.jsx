import { Outlet } from "react-router"

function AdminLayout() {
  return (
    <div className="admin-layout">
      <aside>
        <h2>BookLeaf Admin</h2>
        {/* Admin navigation goes here */}
      </aside>

      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
