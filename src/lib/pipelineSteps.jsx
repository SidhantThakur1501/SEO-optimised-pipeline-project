export const PIPELINE_STEPS = [
  { key: "keyword_input", label: "Keyword Input", shortLabel: "Keywords", index: 0 },
  { key: "intent_classification", label: "Intent Classifier", shortLabel: "Intent", index: 1 },
  { key: "serp_analysis", label: "SERP Gap Analyzer", shortLabel: "SERP", index: 2 },
  { key: "keyword_clustering", label: "Keyword Clustering", shortLabel: "Clusters", index: 3 },
  { key: "prompt_building", label: "Prompt Builder", shortLabel: "Prompt", index: 4 },
  { key: "content_generation", label: "AI Generator", shortLabel: "Generate", index: 5 },
  { key: "seo_validation", label: "SEO Validator + GEO", shortLabel: "SEO/GEO", index: 6 },
  { key: "quality_gate", label: "Quality Gate", shortLabel: "Quality", index: 7 },
  { key: "published", label: "Publish + Report", shortLabel: "Publish", index: 8 },
];

export function getStepIndex(status) {
  const step = PIPELINE_STEPS.find(s => s.key === status);
  return step ? step.index : 0;
}

export function getNextStep(currentStatus) {
  const currentIndex = getStepIndex(currentStatus);
  if (currentIndex < PIPELINE_STEPS.length - 1) {
    return PIPELINE_STEPS[currentIndex + 1].key;
  }
  return currentStatus;
}