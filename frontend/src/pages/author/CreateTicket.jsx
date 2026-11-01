import {
  Form,
  Link,
  useActionData,
  useLoaderData,
  useNavigation,
} from "react-router"

export default function CreateTicket() {
  const { books } = useLoaderData()
  const actionData = useActionData()
  const navigation = useNavigation()

  const isSubmitting = navigation.state === "submitting"

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="mb-8">
        <Link
          to="/author/tickets"
          className="text-sm text-blue-600 hover:underline"
        >
          ← Back to My Tickets
        </Link>

        <h1 className="text-3xl font-bold mt-4">Create Support Ticket</h1>

        <p className="text-gray-500 mt-2">
          Tell us how we can help you. Our support team will get back to you.
        </p>
      </div>

      <Form method="post" encType="multipart/form-data" className="space-y-6">
        {/* BOOK SELECTION */}
        <div>
          <label htmlFor="book" className="block font-medium mb-2">
            Related Book
          </label>

          <select
            id="book"
            name="book"
            defaultValue=""
            className="w-full border rounded-lg p-3"
          >
            <option value="">General / Account Level</option>

            {books.map((book) => (
              <option key={book._id} value={book._id}>
                {book.title}
              </option>
            ))}
          </select>

          <p className="text-sm text-gray-500 mt-1">
            Select a book if your query is related to a specific publication.
          </p>
        </div>

        {/* SUBJECT */}
        <div>
          <label htmlFor="subject" className="block font-medium mb-2">
            Subject
          </label>

          <input
            id="subject"
            name="subject"
            type="text"
            required
            maxLength={200}
            placeholder="e.g. Royalty payment query"
            className="w-full border rounded-lg p-3"
          />
        </div>

        {/* DESCRIPTION */}
        <div>
          <label htmlFor="description" className="block font-medium mb-2">
            Detailed Description
          </label>

          <textarea
            id="description"
            name="description"
            required
            maxLength={10000}
            rows={7}
            placeholder="Describe your issue in detail..."
            className="w-full border rounded-lg p-3 resize-y"
          />
        </div>

        {/* ATTACHMENTS */}
        <div>
          <label htmlFor="attachments" className="block font-medium mb-2">
            Attachments (Optional)
          </label>

          <input
            id="attachments"
            name="attachments"
            type="file"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
            className="w-full border rounded-lg p-3"
          />

          <p className="text-sm text-gray-500 mt-2">
            Maximum 3 files. PDF, JPEG or PNG. Each file must be smaller than 5
            MB.
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {actionData?.error && (
          <div
            role="alert"
            className="bg-red-50 text-red-700 border border-red-200 rounded-lg p-3"
          >
            {actionData.error}
          </div>
        )}

        {/* SUBMIT */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {isSubmitting ? "Creating Ticket..." : "Submit Ticket"}
          </button>

          <Link
            to="/author/tickets"
            className="border px-6 py-3 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </Link>
        </div>
      </Form>
    </div>
  )
}
