import { useLoaderData } from "react-router"

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
})

const formatCurrency = (value) => {
  if (value == null) return "—"
  return currencyFormatter.format(value)
}

const formatDate = (value) => {
  if (!value) return "—"

  return new Date(value).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })
}

function Books() {
  const { books = [] } = useLoaderData()

  if (books.length === 0) {
    return (
      <main>
        <h1>My Books</h1>
        <p>You haven't added any books yet.</p>
      </main>
    )
  }

  return (
    <main>
      <header>
        <h1>My Books</h1>
        <p>View your books, production progress and royalty details.</p>
      </header>

      <section>
        <p>Total books: {books.length}</p>

        <div style={{ overflowX: "auto" }}>
          <table>
            <thead>
              <tr>
                <th>Book</th>
                <th>ISBN</th>
                <th>Genre</th>
                <th>Publication Date</th>
                <th>Status</th>
                <th>MRP</th>
                <th>Royalty / Copy</th>
                <th>Copies Sold</th>
                <th>Total Royalty</th>
                <th>Royalty Paid</th>
                <th>Royalty Pending</th>
                <th>Last Payout</th>
              </tr>
            </thead>

            <tbody>
              {books.map((book) => (
                <tr key={book._id}>
                  <td>{book.title}</td>
                  <td>{book.isbn}</td>
                  <td>{book.genre}</td>
                  <td>{formatDate(book.publication_date)}</td>
                  <td>{book.status}</td>
                  <td>{formatCurrency(book.mrp)}</td>
                  <td>{formatCurrency(book.author_royalty_per_copy)}</td>
                  <td>{book.total_copies_sold}</td>
                  <td>{formatCurrency(book.total_royalty_earned)}</td>
                  <td>{formatCurrency(book.royalty_paid)}</td>
                  <td>{formatCurrency(book.royalty_pending)}</td>
                  <td>{formatDate(book.last_royalty_payout_date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  )
}

export default Books
