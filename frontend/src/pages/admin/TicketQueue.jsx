import { useLoaderData, useSearchParams, Link } from "react-router"
import { useEffect, useState } from "react"

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"]

const CATEGORIES = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
]

const PRIORITIES = ["Critical", "High", "Medium", "Low"]

const priorityStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-green-100 text-green-700",
}

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-purple-100 text-purple-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
}

export default function TicketQueue() {
  const { tickets = [], pagination = {} } = useLoaderData()
  const [searchParams, setSearchParams] = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")

  const page = Number(searchParams.get("page") || 1)

  const fromDate = searchParams.get("fromDate") || ""
  const toDate = searchParams.get("toDate") || ""
  useEffect(() => {
    const timeout = setTimeout(() => {
      const next = new URLSearchParams(searchParams)

      if (search.trim()) {
        next.set("search", search.trim())
      } else {
        next.delete("search")
      }

      next.set("page", "1")

      if (next.toString() !== searchParams.toString()) {
        setSearchParams(next)
      }
    }, 400)

    return () => clearTimeout(timeout)
  }, [search])

  const updateFilter = (key, value) => {
    const next = new URLSearchParams(searchParams)

    if (value) {
      next.set(key, value)
    } else {
      next.delete(key)
    }

    next.set("page", "1")
    setSearchParams(next)
  }

  const changePage = (nextPage) => {
    const next = new URLSearchParams(searchParams)
    next.set("page", String(nextPage))
    setSearchParams(next)
  }

  const totalPages = pagination.totalPages || 1

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Support Tickets</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage author queries and support requests.
        </p>
      </div>

      <div className="grid gap-3 md:grid-cols-4">
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Tickets displayed</p>
          <p className="mt-1 text-2xl font-bold">{tickets.length}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Current page</p>
          <p className="mt-1 text-2xl font-bold">{page}</p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Total tickets</p>
          <p className="mt-1 text-2xl font-bold">
            {pagination.totalTickets ?? 0}
          </p>
        </div>
        <div className="rounded-xl border bg-white p-4">
          <p className="text-sm text-gray-500">Total pages</p>
          <p className="mt-1 text-2xl font-bold">{totalPages}</p>
        </div>
      </div>

      <div className="grid gap-3 rounded-xl border bg-white p-4 md:grid-cols-4">
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search subject or author..."
          className="rounded-lg border px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <select
          value={searchParams.get("status") || ""}
          onChange={(event) => updateFilter("status", event.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("category") || ""}
          onChange={(event) => updateFilter("category", event.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All categories</option>
          {CATEGORIES.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        <select
          value={searchParams.get("priority") || ""}
          onChange={(event) => updateFilter("priority", event.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        >
          <option value="">All priorities</option>
          {PRIORITIES.map((priority) => (
            <option key={priority} value={priority}>
              {priority}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={fromDate}
          max={toDate || undefined}
          onChange={(event) => updateFilter("fromDate", event.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />

        <input
          type="date"
          value={toDate}
          min={fromDate || undefined}
          onChange={(event) => updateFilter("toDate", event.target.value)}
          className="rounded-lg border px-3 py-2 text-sm"
        />
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        {tickets.length === 0 ? (
          <div className="p-12 text-center">
            <h2 className="font-semibold text-gray-800">No tickets found</h2>
            <p className="mt-1 text-sm text-gray-500">
              Try changing your filters or search query.
            </p>
          </div>
        ) : (
          <div className="divide-y">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/admin/tickets/${ticket._id}`}
                className="block p-5 transition hover:bg-gray-50"
              >
                <div className="flex flex-col justify-between gap-3 md:flex-row">
                  <div className="min-w-0 space-y-2">
                    <h2 className="font-semibold text-gray-900">
                      {ticket.subject}
                    </h2>

                    <p className="text-sm text-gray-500">
                      {ticket.author?.name || "Unknown author"}
                      {ticket.book?.title && ` · ${ticket.book.title}`}
                    </p>

                    <p className="text-xs text-gray-400">{ticket.category}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-start gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityStyles[ticket.priority] || "bg-gray-100 text-gray-600"}`}
                    >
                      {ticket.priority}
                    </span>

                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status] || "bg-gray-100 text-gray-600"}`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                </div>

                <p className="mt-3 text-xs text-gray-400">
                  Last activity:{" "}
                  {ticket.lastActivityAt
                    ? new Date(ticket.lastActivityAt).toLocaleString()
                    : "No activity recorded"}
                </p>
              </Link>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Page {page} of {totalPages}
        </p>

        <div className="flex gap-2">
          <button
            disabled={page <= 1}
            onClick={() => changePage(page - 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <button
            disabled={page >= totalPages}
            onClick={() => changePage(page + 1)}
            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  )
}
