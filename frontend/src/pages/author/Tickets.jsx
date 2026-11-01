import { Link, useLoaderData, useNavigation } from "react-router"

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

const priorityStyles = {
  Critical: "text-red-700",
  High: "text-orange-600",
  Medium: "text-yellow-700",
  Low: "text-gray-500",
}

const formatDate = (date) => {
  if (!date) return "N/A"

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date))
}

export default function Tickets() {
  const { tickets, pagination } = useLoaderData()
  const navigation = useNavigation()

  const isLoading = navigation.state === "loading"

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Tickets</h1>

          <p className="text-gray-500 mt-2">
            Track your support requests and conversations.
          </p>
        </div>

        <Link
          to="/author/tickets/new"
          className="bg-blue-600 text-white px-5 py-3 rounded-lg text-center hover:bg-blue-700"
        >
          + Create Ticket
        </Link>
      </div>

      {/* TICKET LIST */}
      {isLoading ? (
        <div className="text-center py-16 text-gray-500">
          Loading tickets...
        </div>
      ) : tickets.length === 0 ? (
        <div className="border rounded-xl p-12 text-center">
          <h2 className="text-xl font-semibold">No support tickets yet</h2>

          <p className="text-gray-500 mt-2">
            Need assistance? Create your first support ticket.
          </p>

          <Link
            to="/author/tickets/new"
            className="inline-block mt-5 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700"
          >
            Create Your First Ticket
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {tickets.map((ticket) => (
              <Link
                key={ticket._id}
                to={`/author/tickets/${ticket._id}`}
                className="block border rounded-xl p-5 hover:shadow-md hover:border-blue-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="font-semibold text-lg">{ticket.subject}</h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {ticket.book?.title || "General / Account Level"}
                    </p>
                  </div>

                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full h-fit w-fit ${
                      statusStyles[ticket.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-2 mt-5 text-sm">
                  <span className="text-gray-600">
                    Category: {ticket.category}
                  </span>

                  <span
                    className={`font-semibold ${
                      priorityStyles[ticket.priority] || "text-gray-500"
                    }`}
                  >
                    Priority: {ticket.priority}
                  </span>

                  <span className="text-gray-500">
                    Last activity: {formatDate(ticket.lastActivityAt)}
                  </span>
                </div>
              </Link>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="flex items-center justify-between mt-8">
            <span className="text-sm text-gray-500">
              Page {pagination.currentPage} of {pagination.totalPages}
              {" · "}
              {pagination.totalTickets} tickets
            </span>

            <div className="flex gap-3">
              {pagination.hasPreviousPage && (
                <Link
                  to={`?page=${pagination.currentPage - 1}&limit=${pagination.limit}`}
                  className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </Link>
              )}

              {pagination.hasNextPage && (
                <Link
                  to={`?page=${pagination.currentPage + 1}&limit=${pagination.limit}`}
                  className="border px-4 py-2 rounded-lg hover:bg-gray-50"
                >
                  Next
                </Link>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
