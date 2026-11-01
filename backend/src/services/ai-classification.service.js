import { gemini, AI_MODEL } from "../configs/gemini.config.js"
import { Type } from "@google/genai"

const CATEGORIES = [
  "Royalty & Payments",
  "ISBN & Metadata Issues",
  "Printing & Quality",
  "Distribution & Availability",
  "Book Status & Production Updates",
  "General Inquiry",
]

const PRIORITIES = ["Critical", "High", "Medium", "Low"]

const classificationSchema = {
  type: Type.OBJECT,
  properties: {
    category: {
      type: Type.STRING,
      enum: CATEGORIES,
    },
    priority: {
      type: Type.STRING,
      enum: PRIORITIES,
    },
    reasoning: {
      type: Type.STRING,
    },
    confidence: {
      type: Type.NUMBER,
    },
  },
  required: ["category", "priority", "reasoning", "confidence"],
}

const SYSTEM_PROMPT = `
You are an experienced support ticket classification
assistant working for BookLeaf Publishing.

Your task is to classify incoming author support tickets.

CATEGORY RULES:

1. Royalty & Payments:
Royalty calculations, missing payments, payout delays,
royalty breakdowns and payment details.

2. ISBN & Metadata Issues:
ISBN errors, duplicate ISBNs, incorrect book metadata
and incorrect book information.

3. Printing & Quality:
Printing defects, misprints, binding issues,
colour inconsistencies and author copy quality.

4. Distribution & Availability:
Distribution platforms, missing listings,
unavailable books and stock synchronisation.

5. Book Status & Production Updates:
Manuscript processing, editing, cover design,
typesetting, proofreading, printing progress
and publication status.

6. General Inquiry:
Questions that do not reasonably fit the other
five categories.

PRIORITY RULES:

Critical:
- Immediate severe operational or author-impacting issue.
- Serious publishing issue requiring urgent attention.
- Use sparingly.

High:
- Missing or significantly delayed royalties.
- Incorrect or duplicate ISBN.
- Serious printing or distribution problems.
- Issues requiring escalation.

Medium:
- Normal support issues requiring investigation or action.
- Production delays without immediate severe impact.

Low:
- General questions.
- Routine information requests.
- Minor profile or metadata changes.

IMPORTANT:
- Evaluate the actual content, not just individual keywords.
- Do not invent facts.
- Do not confuse a question with an emergency.
- Select exactly one category and one priority.
- Explain your decision briefly.
- Confidence must be between 0 and 1.
`

const validateClassification = (result) => {
  if (
    !CATEGORIES.includes(result.category) ||
    !PRIORITIES.includes(result.priority) ||
    typeof result.reasoning !== "string" ||
    typeof result.confidence !== "number" ||
    !Number.isFinite(result.confidence) ||
    result.confidence < 0 ||
    result.confidence > 1
  ) {
    throw new Error("Invalid AI classification response.")
  }

  return result
}
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const generateWithRetry = async (request, maxRetries = 2) => {
  for (let attempt = 0; ; attempt++) {
    try {
      return await gemini.models.generateContent(request)
    } catch (error) {
      const retryable = [429, 500, 502, 503, 504].includes(error.status)

      if (!retryable || attempt >= maxRetries) {
        throw error
      }

      const delay = 2000 * 2 ** attempt

      console.log(
        `Gemini temporarily unavailable. Retry ${attempt + 1}/${maxRetries} in ${delay}ms`
      )

      await sleep(delay)
    }
  }
}
export const classifyTicket = async ({ subject, description }) => {
  if (
    typeof subject !== "string" ||
    typeof description !== "string" ||
    !subject.trim() ||
    !description.trim()
  ) {
    throw new Error("Ticket subject and description are required.")
  }

  if (!gemini) {
    return {
      success: false,
      status: "unavailable",
      error: "Gemini API is not configured.",
    }
  }

  console.time("Gemini classification")

  try {
    const response = await generateWithRetry({
      model: AI_MODEL,

      contents: JSON.stringify({
        subject: subject.trim(),
        description: description.trim(),
      }),

      config: {
        systemInstruction: SYSTEM_PROMPT,
        responseMimeType: "application/json",
        responseSchema: classificationSchema,
        temperature: 0.1,
        maxOutputTokens: 512,
      },
    })

    const content = response.text

    if (!content) {
      throw new Error("Gemini returned an empty classification.")
    }

    const parsedResult = JSON.parse(content)
    const result = validateClassification(parsedResult)
    console.log("Gemini finish reason:", response.candidates?.[0]?.finishReason)
    console.log("Gemini usage:", response.usageMetadata)
    console.log("Gemini raw response:", response.text)
    return {
      success: true,
      status: "completed",
      data: result,
    }
  } catch (error) {
    console.error("Gemini ticket classification failed:", error.message)

    const status =
      error.status === 429
        ? "rate_limited"
        : [500, 502, 503, 504].includes(error.status)
          ? "provider_unavailable"
          : "failed"

    return {
      success: false,
      status,
      error: error.message,
    }
  } finally {
    console.timeEnd("Gemini classification")
  }
}
