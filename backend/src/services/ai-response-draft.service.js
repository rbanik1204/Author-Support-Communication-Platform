import { gemini, AI_MODEL } from "../configs/gemini.config.js"
import { getRelevantKnowledgeBase } from "./knowledge-base.service.js"

const DRAFT_SYSTEM_PROMPT = `
You are an experienced customer support representative at BookLeaf Publishing.

Your task is to draft a response to an author's support ticket.

STRICT RULES:

1. Use only the supplied BookLeaf knowledge base and ticket context.
2. Never invent payment dates, transaction details, production statuses,
   investigation results, or actions already performed.
3. If information is unavailable, acknowledge this and explain what needs
   to be checked by the BookLeaf team.
4. Follow the relevant BookLeaf policies and sample response guidance.
5. Acknowledge the author's concern before explaining the solution.
6. Use an empathetic, professional, transparent tone.
7. Provide specific timelines only when supported by the supplied context.
8. Never claim that an escalation, re-sync, refund, or reprint has already
   happened unless the conversation explicitly confirms it.
9. Do not expose internal notes or internal administrative information.
10. End with a clear next step.

Return only the suggested response to the author.
Do not include headings such as "AI Draft" or explanations about your reasoning.
`

export const generateTicketDraft = async ({ ticket, messages = [] }) => {
  if (!gemini) {
    return {
      success: false,
      status: "unavailable",
      error: "Gemini API is not configured.",
    }
  }

  if (!ticket || !ticket.subject) {
    throw new Error("Valid ticket information is required.")
  }

  try {
    // 1. Retrieve category-specific knowledge.
    const knowledgeContext = getRelevantKnowledgeBase(ticket.category)

    // 2. Include only public conversation messages.
    const conversation = messages
      .filter((message) => message.visibility === "public")
      .map((message) => ({
        senderRole: message.senderRole,
        type: message.type,
        content: message.content,
        createdAt: message.createdAt,
      }))

    // 3. Prepare available ticket and book context.
    const ticketContext = {
      subject: ticket.subject,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,

      author: {
        name: ticket.author?.name,
      },

      book: ticket.book
        ? {
            title: ticket.book.title,
            isbn: ticket.book.isbn,
            genre: ticket.book.genre,
            publicationDate: ticket.book.publication_date,
            productionStatus: ticket.book.status,
            royaltyPending: ticket.book.royalty_pending,
            royaltyPaid: ticket.book.royalty_paid,
            totalRoyaltyEarned: ticket.book.total_royalty_earned,
          }
        : null,

      conversation,
    }

    // 4. Generate the suggested response.
    const response = await gemini.models.generateContent({
      model: AI_MODEL,

      contents: JSON.stringify({
        knowledgeBase: knowledgeContext,
        ticket: ticketContext,
      }),

      config: {
        systemInstruction: DRAFT_SYSTEM_PROMPT,
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    })

    const draft = response.text?.trim()

    if (!draft) {
      throw new Error("Gemini returned an empty response draft.")
    }

    return {
      success: true,
      status: "completed",
      draft,
    }
  } catch (error) {
    console.error("AI response draft generation failed:", error.message)

    return {
      success: false,
      status: error.status === 429 ? "rate_limited" : "failed",
      error: error.message,
    }
  }
}
