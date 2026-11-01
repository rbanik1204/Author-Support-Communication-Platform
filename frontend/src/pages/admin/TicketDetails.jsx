import { useLoaderData, useFetcher, Link } from "react-router"

import { useState } from "react"

const STATUSES = ["Open", "In Progress", "Resolved", "Closed"]

const statusStyles = {
  Open: "bg-blue-100 text-blue-700",
  "In Progress": "bg-purple-100 text-purple-700",
  Resolved: "bg-green-100 text-green-700",
  Closed: "bg-gray-100 text-gray-600",
}

function formatDate(date) {
  return date ? new Date(date).toLocaleString() : "—"
}

export default function TicketDetails() {
  const { ticket, messages = [] } = useLoaderData()

  const statusFetcher = useFetcher()
  const assignFetcher = useFetcher()
  const replyFetcher = useFetcher()
  const noteFetcher = useFetcher()

  const [reply, setReply] = useState("")
  const [note, setNote] = useState("")

  const busy =
    statusFetcher.state !== "idle" ||
    assignFetcher.state !== "idle" ||
    replyFetcher.state !== "idle" ||
    noteFetcher.state !== "idle"

  const handleSubmit = (event, fetcher, intent) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    formData.set("intent", intent)

    fetcher.submit(formData, { method: "post" })
  }

  return (
    <div className="space-y-6 p-6">
      <Link
        to="/admin/tickets"
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        ← Back to tickets
      </Link>

      {/* Ticket header */}
      <div className="rounded-xl border bg-white p-6">
        <div className="flex flex-col justify-between gap-4 md:flex-row">
          <div>
            <p className="text-sm text-gray-500">Ticket #{ticket._id}</p>

            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              {ticket.subject}
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Submitted {formatDate(ticket.createdAt)}
            </p>
          </div>

          <div className="flex items-start gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[ticket.status] || "bg-gray-100 text-gray-600"}`}
            >
              {ticket.status}
            </span>

            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-700">
              {ticket.priority}
            </span>
          </div>
        </div>
      </div>

      {/* Author and book information */}
      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-gray-900">Author Information</h2>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Name: </span>
              {ticket.author?.name || "—"}
            </p>

            <p>
              <span className="text-gray-500">Email: </span>
              {ticket.author?.email || "—"}
            </p>

            <p>
              <span className="text-gray-500">Phone: </span>
              {ticket.author?.phone || "—"}
            </p>
          </div>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <h2 className="font-semibold text-gray-900">Ticket Information</h2>

          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-gray-500">Category: </span>
              {ticket.category}
            </p>

            <p>
              <span className="text-gray-500">Priority: </span>
              {ticket.priority}
            </p>

            <p>
              <span className="text-gray-500">Book: </span>
              {ticket.book?.title || "General inquiry"}
            </p>

            <p>
              <span className="text-gray-500">Assigned to: </span>
              {ticket.assignedTo?.name || "Unassigned"}
            </p>
          </div>
        </div>
      </div>

      {/* Ticket controls */}
      <div className="flex flex-wrap items-end gap-4 rounded-xl border bg-white p-5">
        <div className="flex-1">
          <label className="mb-2 block text-sm font-medium">
            Update status
          </label>

          <statusFetcher.Form
            method="post"
            onSubmit={(event) =>
              handleSubmit(event, statusFetcher, "update-status")
            }
          >
            <div className="flex gap-2">
              <select
                name="status"
                defaultValue={ticket.status}
                className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm"
              >
                {STATUSES.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                disabled={busy}
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                Update
              </button>
            </div>
          </statusFetcher.Form>
        </div>

        <assignFetcher.Form
          method="post"
          onSubmit={(event) =>
            handleSubmit(event, assignFetcher, "assign-ticket")
          }
        >
          <button
            type="submit"
            disabled={busy}
            className="rounded-lg border border-blue-600 px-4 py-2 text-sm font-medium text-blue-600 disabled:opacity-50"
          >
            Assign to me
          </button>
        </assignFetcher.Form>
      </div>

      {/* Conversation */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="text-lg font-semibold text-gray-900">
          Conversation ({messages.length})
        </h2>

        <div className="mt-5 space-y-4">
          {messages.length === 0 ? (
            <p className="text-sm text-gray-500">No messages available.</p>
          ) : (
            messages.map((message) => {
              const internal = message.visibility === "internal"

              return (
                <div
                  key={message._id}
                  className={`rounded-xl border p-4 ${
                    internal
                      ? "border-amber-300 bg-amber-50"
                      : message.senderRole === "admin"
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="flex flex-wrap justify-between gap-2">
                    <div className="text-sm font-semibold">
                      {message.sender?.name || message.senderRole}
                    </div>

                    <span className="text-xs text-gray-500">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>

                  <div className="mt-1 text-xs font-medium text-gray-500">
                    {internal
                      ? "INTERNAL NOTE"
                      : message.senderRole === "admin"
                        ? "PUBLIC REPLY"
                        : "AUTHOR MESSAGE"}
                  </div>

                  <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-800">
                    {message.content}
                  </p>

                  {message.attachments?.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment) => (
                        <a
                          key={attachment.publicId || attachment.url}
                          href={attachment.url}
                          target="_blank"
                          rel="noreferrer"
                          className="block text-sm text-blue-600 underline"
                        >
                          {attachment.originalName}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>

      {/* Public reply */}
      <div className="rounded-xl border bg-white p-5">
        <h2 className="font-semibold text-gray-900">Reply to author</h2>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()

            const formData = new FormData()
            formData.set("intent", "send-reply")
            formData.set("content", reply.trim())

            replyFetcher.submit(formData, { method: "post" })
            setReply("")
          }}
        >
          <textarea
            value={reply}
            onChange={(event) => setReply(event.target.value)}
            rows={5}
            maxLength={10000}
            placeholder="Write a response to the author..."
            className="w-full rounded-lg border p-3 text-sm outline-none focus:border-blue-500"
            required
          />

          <button
            type="submit"
            disabled={!reply.trim() || busy}
            className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {replyFetcher.state !== "idle" ? "Sending..." : "Send reply"}
          </button>
        </form>
      </div>

      {/* Internal note */}
      <div className="rounded-xl border border-amber-300 bg-amber-50 p-5">
        <h2 className="font-semibold text-gray-900">Internal note</h2>

        <p className="mt-1 text-xs text-gray-600">
          Only administrators can see these notes. Authors cannot access them.
        </p>

        <form
          className="mt-4 space-y-3"
          onSubmit={(event) => {
            event.preventDefault()

            const formData = new FormData()
            formData.set("intent", "add-internal-note")
            formData.set("content", note.trim())

            noteFetcher.submit(formData, { method: "post" })
            setNote("")
          }}
        >
          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            rows={4}
            maxLength={10000}
            placeholder="Write an internal note..."
            className="w-full rounded-lg border border-amber-300 bg-white p-3 text-sm outline-none"
            required
          />

          <button
            type="submit"
            disabled={!note.trim() || busy}
            className="rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-50"
          >
            {noteFetcher.state !== "idle" ? "Saving..." : "Add internal note"}
          </button>
        </form>
      </div>
    </div>
  )
}
