// booksLoader, createTicketBooksLoader
import { getAuthorBooksAPI } from "../services/books.api.js"

export const booksLoader = async () => {
  const data = await getAuthorBooksAPI()

  return {
    books: data.books,
  }
}

export const createTicketBooksLoader = async () => {
  const data = await getAuthorBooksAPI()

  return {
    books: data.books,
  }
}
