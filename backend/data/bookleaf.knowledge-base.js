export const bookleafKnowledgeBase = {
  companyOverview: {
    name: "BookLeaf Publishing",

    operatingRegions: ["India", "US", "UK"],

    publishingPackages: [
      {
        name: "Standard Free",
        description: "No upfront cost.",
      },
      {
        name: "Bestseller Breakthrough",
        description:
          "Premium, paid package with marketing and distribution add-ons.",
      },
    ],

    services: [
      "Cover design",
      "Typesetting",
      "ISBN assignment",
      "Printing",
      "Distribution",
      "Royalty management",
    ],

    printingFacility: {
      type: "In-house printing facility and warehouse",
      location: "Delhi, India",
      externalPartners: ["Repro India", "Epitome Books"],
    },
  },

  royaltyPolicy: {
    split: {
      author: 80,
      bookleaf: 20,
      basis: "Net profit per book",
    },

    netProfitCalculation: {
      formula: "MRP - printing cost - platform commission - shipping charges",

      deductions: [
        "Printing cost",
        "Platform commission (Amazon/Flipkart)",
        "Shipping charges",
      ],
    },

    calculationFrequency: "Quarterly",

    payoutTimeline: "Within 45 days of the quarter ending.",

    minimumPayout: {
      amount: 1000,
      currency: "INR",
      rule: "If accumulated royalties are below ₹1,000, they roll over to the next quarter.",
    },

    paymentMethod:
      "Bank transfer to the account linked in the author's dashboard.",

    royaltyBreakdown:
      "Authors can view a detailed royalty breakdown in their dashboard, including sales figures per platform.",
  },

  isbnPolicy: {
    assignment:
      "Every book published through BookLeaf receives a unique ISBN assigned by BookLeaf.",

    publisherImprint:
      "ISBNs are registered under BookLeaf's publisher imprint.",

    ownImprint:
      "Authors who want an ISBN under their own imprint must obtain it independently.",

    reportedErrors: ["Duplicate ISBN", "Wrong book linked to ISBN"],

    errorHandling:
      "ISBN errors are treated as high-priority issues and escalated to the production team.",
  },

  printingAndQuality: {
    printingProcess:
      "In-house printing handles most orders. Overflow or specific format requirements are handled by Repro India or Epitome Books.",

    standardTurnaround: "5–7 business days from order confirmation.",

    qualityIssues: ["Misprints", "Binding defects", "Colour inconsistency"],

    resolution:
      "BookLeaf arranges a free reprint after verification of a reported quality issue.",

    evidence: "The author may need to share photographs of the defective copy.",
  },

  distributionAndAvailability: {
    platforms: [
      "Amazon India",
      "Flipkart",
      "Amazon US",
      "Amazon UK",
      "BookLeaf Store",
    ],

    newListingTimeline: "7–10 business days after publication is complete.",

    unavailableBooks:
      "A book showing as unavailable on a platform usually indicates a stock synchronisation issue.",

    stockResynchronisation:
      "BookLeaf's team can trigger a re-sync within 24–48 hours.",
  },

  productionStages: [
    "Manuscript Received",
    "Editing (if opted)",
    "Cover Design",
    "Typesetting",
    "Proofreading",
    "ISBN Assignment",
    "Printing",
    "Distribution Setup",
    "Published & Live",
  ],

  productionUpdates: {
    authorNotifications:
      "Authors are updated at each production stage via email.",

    commonDelays: [
      {
        stage: "Cover Design",
        reason: "Waiting for author approval.",
      },
      {
        stage: "Proofreading",
        reason: "Revision rounds.",
      },
    ],
  },

  metadataUpdates: {
    description:
      "Authors can submit book description updates through their dashboard or by emailing the BookLeaf team.",

    reflectionTimeline:
      "Changes typically reflect on platforms within 3–5 business days after submission.",
  },

  communicationGuidelines: {
    tone: ["Empathetic", "Professional"],

    principles: [
      "Treat authors as partners.",
      "Acknowledge the author's concern before offering a solution.",
      "Provide specific numbers, dates and statuses wherever possible.",
      "If BookLeaf is responsible for an issue, acknowledge it directly.",
      "Do not deflect responsibility for BookLeaf errors or delays.",
      "For investigation or escalation, provide a clear timeline.",
      "Use a 48-hour follow-up timeline where escalation is required.",
      "Always conclude with a clear next step for the author and/or BookLeaf team.",
    ],
  },

  sampleScenarios: [
    {
      category: "Royalty & Payments",
      query:
        "I published my book 4 months ago and still haven't received any royalty. What's going on?",
      expectedResponseGuidance: [
        "Acknowledge the author's frustration.",
        "Explain the quarterly royalty cycle and 45-day payout window.",
        "Check whether bank details are linked.",
        "Provide the specific next payout date when it can be determined from available information.",
        "If payment is genuinely overdue, escalate with a 48-hour resolution timeline.",
      ],
    },

    {
      category: "Royalty & Payments",
      query:
        "My royalty amount seems too low. I sold 200 copies but only received ₹3,000.",
      expectedResponseGuidance: [
        "Explain the net profit calculation.",
        "Explain printing costs, platform commissions and shipping deductions.",
        "Offer a detailed line-by-line royalty breakdown.",
        "Maintain a transparent and non-defensive tone.",
      ],
    },

    {
      category: "ISBN & Metadata Issues",
      query:
        "My book is showing a different ISBN on Amazon than what's on the physical copy.",
      expectedResponseGuidance: [
        "Treat the issue as high priority.",
        "Acknowledge that this is a serious data issue.",
        "Confirm escalation to the production team immediately.",
        "Provide a 48-hour resolution timeline.",
      ],
    },

    {
      category: "Printing & Quality",
      query:
        "I received my author copies and the print quality is terrible. The images are blurry and pages are misaligned.",
      expectedResponseGuidance: [
        "Apologise sincerely.",
        "Ask the author to share photographs of defective copies.",
        "Confirm that BookLeaf will arrange a free reprint after verification.",
        "Provide a 5–7 business day reprint timeline.",
      ],
    },

    {
      category: "Distribution & Availability",
      query:
        'My book is published but it is showing as "Currently Unavailable" on Amazon.',
      expectedResponseGuidance: [
        "Explain that this is typically a stock synchronisation issue.",
        "Confirm that a re-sync is being triggered with the distribution team.",
        "Set an expectation of 24–48 hours for the listing to become available again.",
      ],
    },

    {
      category: "Book Status & Production Updates",
      query:
        "It's been 3 weeks and my book is still in typesetting. When will it be done?",
      expectedResponseGuidance: [
        "Check the actual production status.",
        "If delayed, explain the reason honestly.",
        "Consider pending author approval or proofreading revisions where applicable.",
        "Provide a specific updated timeline.",
        "Do not blame the author; frame the situation collaboratively.",
      ],
    },

    {
      category: "General Inquiry",
      query:
        "Can I update the description of my book on Amazon after it's already live?",
      expectedResponseGuidance: [
        "Confirm that metadata updates can be submitted through the dashboard or by emailing the BookLeaf team.",
        "Explain that changes typically reflect on platforms within 3–5 business days.",
      ],
    },
  ],
}
