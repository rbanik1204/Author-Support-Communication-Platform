import { classifyTicket } from "../src/services/ai-classification.service.js"
import dotenv from "dotenv"
dotenv.config({
  path: ".env.production",
})

const testCases = [
  {
    name: "Delayed royalty for 6 months",
    subject: "Royalty payment not received",
    description:
      "I published my book six months ago, and I still haven't received any royalty payment.",
    expectedCategory: "Royalty & Payments",
    expectedPriority: "High",
  },
  {
    name: "Royalty breakdown query",
    subject: "Royalty calculation clarification",
    description:
      "I sold 200 copies of my book but received only ₹3,000. Can you explain the deductions?",
    expectedCategory: "Royalty & Payments",
    expectedPriority: "Medium",
  },
  {
    name: "Incorrect ISBN",
    subject: "Wrong ISBN on Amazon",
    description:
      "My book is showing a different ISBN on Amazon compared to the ISBN printed on my physical book.",
    expectedCategory: "ISBN & Metadata Issues",
    expectedPriority: "High",
  },
  {
    name: "Printing quality issue",
    subject: "Defective author copies",
    description:
      "The images in my printed book are blurry and several pages are misaligned.",
    expectedCategory: "Printing & Quality",
    expectedPriority: "High",
  },
  {
    name: "Amazon unavailable listing",
    subject: "Book unavailable on Amazon",
    description: "My book is published but Amazon shows Currently Unavailable.",
    expectedCategory: "Distribution & Availability",
    expectedPriority: "Medium",
  },
  {
    name: "Production delay",
    subject: "Book stuck in typesetting",
    description:
      "My book has been stuck in typesetting for three weeks. When will it move forward?",
    expectedCategory: "Book Status & Production Updates",
    expectedPriority: "Medium",
  },
  {
    name: "Author bio update",
    subject: "Update author bio",
    description: "I want to update my author biography on my BookLeaf profile.",
    expectedCategory: "General Inquiry",
    expectedPriority: "Low",
  },
]

for (const testCase of testCases) {
  console.log("\n====================================")
  console.log(`TEST: ${testCase.name}`)
  console.log("====================================")

  const result = await classifyTicket({
    subject: testCase.subject,
    description: testCase.description,
  })

  if (!result.success) {
    console.log("AI FAILED:", result.error)
    continue
  }

  console.log("ACTUAL:", result.data)
  console.log("EXPECTED CATEGORY:", testCase.expectedCategory)
  console.log("EXPECTED PRIORITY:", testCase.expectedPriority)

  console.log(
    "CATEGORY MATCH:",
    result.data.category === testCase.expectedCategory
  )

  console.log(
    "PRIORITY MATCH:",
    result.data.priority === testCase.expectedPriority
  )
}
