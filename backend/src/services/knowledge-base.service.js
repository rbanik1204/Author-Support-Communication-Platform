import { bookleafKnowledgeBase } from "../../data/bookleaf.knowledge-base.js"

const CATEGORY_KB_MAP = {
  "Royalty & Payments": ["royaltyPolicy"],

  "ISBN & Metadata Issues": ["isbnPolicy", "metadataUpdates"],

  "Printing & Quality": ["printingAndQuality"],

  "Distribution & Availability": ["distributionAndAvailability"],

  "Book Status & Production Updates": ["productionStages", "productionUpdates"],

  "General Inquiry": [
    "companyOverview",
    "metadataUpdates",
    "publishingPackages",
  ],
}

export const getRelevantKnowledgeBase = (category) => {
  const relevantSections = CATEGORY_KB_MAP[category]

  // Unknown or missing category: provide general context.
  if (!relevantSections) {
    return {
      companyOverview: bookleafKnowledgeBase.companyOverview,
      communicationGuidelines: bookleafKnowledgeBase.communicationGuidelines,
    }
  }

  const knowledgeContext = {}

  for (const section of relevantSections) {
    if (section === "publishingPackages") {
      knowledgeContext.publishingPackages =
        bookleafKnowledgeBase.companyOverview.publishingPackages

      continue
    }

    knowledgeContext[section] = bookleafKnowledgeBase[section]
  }

  // Communication guidelines apply to every generated response.
  knowledgeContext.communicationGuidelines =
    bookleafKnowledgeBase.communicationGuidelines

  // Include only sample scenarios relevant to this category.
  knowledgeContext.sampleScenarios =
    bookleafKnowledgeBase.sampleScenarios.filter(
      (scenario) => scenario.category === category
    )

  return knowledgeContext
}
