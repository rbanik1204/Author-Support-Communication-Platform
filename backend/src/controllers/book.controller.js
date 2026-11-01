import Book from "../models/book.model.js"

export const handleGetAuthorBooks = async (req, res, next) => {
  try {
    const authorId = req.session.user.id

    const books = await Book.find({
      author: authorId,
    })
      .select(
        "book_id title isbn genre publication_date status mrp author_royalty_per_copy total_copies_sold total_royalty_earned royalty_paid royalty_pending last_royalty_payout_date print_partner available_on"
      )
      .sort({ createdAt: -1 })
      .lean()

    return res.status(200).json({
      success: true,
      count: books.length,
      books,
    })
  } catch (error) {
    next(error)
  }
}
