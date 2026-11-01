import { Link, useLoaderData } from "react-router"

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-yellow-100 text-yellow-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-700",
}

const priorityStyles = {
  Critical: "bg-red-100 text-red-700",
  High: "bg-orange-100 text-orange-700",
  Medium: "bg-yellow-100 text-yellow-700",
  Low: "bg-gray-100 text-gray-600",
}

const formatDate = (date) => {
  if (!date) return "N/A"

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date))
}

const isImage = (mimeType) => ["image/jpeg", "image/png"].includes(mimeType)

export default function TicketDetails() {
  const { ticket, messages } = useLoaderData()

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* BACK NAVIGATION */}
      <Link
        to="/author/tickets"
        className="text-blue-600 hover:underline text-sm"
      >
        ← Back to My Tickets
      </Link>

      {/* TICKET HEADER */}
      <div className="mt-6 border rounded-xl p-6 bg-white shadow-sm">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div>
            <p className="text-sm text-gray-500">Support Ticket</p>

            <h1 className="text-2xl font-bold mt-2">{ticket.subject}</h1>

            <p className="text-sm text-gray-500 mt-2">
              Created {formatDate(ticket.createdAt)}
            </p>
          </div>

          <span
            className={`px-4 py-2 rounded-full text-sm font-semibold h-fit w-fit ${
              statusStyles[ticket.status] || "bg-gray-100 text-gray-600"
            }`}
          >
            {ticket.status}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-7 pt-6 border-t">
          <div>
            <p className="text-sm text-gray-500">Related Book</p>
            <p className="font-medium mt-1">
              {ticket.book?.title || "General / Account Level"}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Category</p>
            <p className="font-medium mt-1">{ticket.category}</p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Priority</p>
            <span
              className={`inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium ${
                priorityStyles[ticket.priority] || "bg-gray-100 text-gray-600"
              }`}
            >
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* CONVERSATION */}
      <section className="mt-10">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">Conversation</h2>
            <p className="text-sm text-gray-500 mt-1">
              Your communication with the BookLeaf support team.
            </p>
          </div>

          <span className="text-sm text-gray-500">
            {messages.length} messages
          </span>
        </div>

        {messages.length === 0 ? (
          <div className="border rounded-xl p-8 text-center text-gray-500">
            No messages available.
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((message) => {
              const isAuthor = message.senderRole === "author"

              return (
                <article
                  key={message._id}
                  className={`border rounded-xl p-5 shadow-sm ${
                    isAuthor
                      ? "bg-blue-50 border-blue-100"
                      : "bg-white border-gray-200"
                  }`}
                >
                  {/* MESSAGE HEADER */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <p className="font-semibold">
                        {isAuthor
                          ? "You"
                          : message.sender?.name || "BookLeaf Support"}
                      </p>

                      <p className="text-xs text-gray-500 mt-1">
                        {isAuthor ? "Author" : "Support Team"}
                      </p>
                    </div>

                    <time className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </time>
                  </div>

                  {/* MESSAGE CONTENT */}
                  <div className="mt-5 text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                    {message.content}
                  </div>

                  {/* ATTACHMENTS */}
                  {message.attachments?.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-gray-200">
                      <p className="text-sm font-semibold mb-3">Attachments</p>

                      <div className="space-y-3">
                        {message.attachments.map((file, index) => (
                          <div
                            key={file.publicId || index}
                            className="flex flex-col sm:flex-row sm:items-center gap-3 border rounded-lg p-3 bg-white"
                          >
                            {isImage(file.mimeType) ? (
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                              >
                                <img
                                  src={file.url}
                                  alt={file.originalName}
                                  className="w-20 h-20 object-cover rounded-lg"
                                  loading="lazy"
                                />
                              </a>
                            ) : (
                              <div className="w-12 h-12 flex items-center justify-center bg-red-50 text-red-600 rounded-lg font-bold text-xs">
                                PDF
                              </div>
                            )}

                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">
                                {file.originalName}
                              </p>

                              <p className="text-xs text-gray-500 mt-1">
                                {file.mimeType} ·{" "}
                                {(file.size / 1024).toFixed(1)} KB
                              </p>
                            </div>

                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-blue-600 hover:underline font-medium"
                            >
                              Open attachment ↗
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </article>
              )
            })}
          </div>
        )}
      </section>

      {/* FOOTER */}
      <div className="mt-10 border rounded-xl p-5 bg-gray-50">
        <p className="text-sm text-gray-600">
          Need to provide additional information? Your ticket is available to
          the BookLeaf support team. Further communication will appear in this
          conversation.
        </p>
      </div>
    </div>
  )
}
