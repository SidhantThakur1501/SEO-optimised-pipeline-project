import {
  analyzeSerp,
  buildPrompt,
  classifyIntent,
  clusterKeywords,
  generateContent,
  qualityGate,
  validateSeo,
} from "../src/lib/pipelineEngine.js";

const project = {
  id: "demo-project",
  title: "Best CRM Tools for Startups",
  status: "keyword_input",
  keywords: [
    "best crm for startups",
    "startup crm software",
    "crm tools for small teams",
    "how to choose a crm",
  ],
  target_audience: "startup founders and revenue leaders evaluating CRM options",
  target_region: "United States",
  content_type: "blog_post",
};

project.intent_data = classifyIntent(project);
project.serp_gaps = analyzeSerp(project);
project.keyword_clusters = clusterKeywords(project).clusters;
project.generated_prompt = buildPrompt(project);
project.generated_content = generateContent(project);

const seo = validateSeo(project);
project.seo_score = seo.seo_score;
project.seo_report = {
  seo_score: seo.seo_score,
  seo_checks: seo.seo_checks,
  meta_title: seo.meta_title,
  meta_description: seo.meta_description,
  overall_summary: seo.overall_summary,
};
project.geo_optimization = {
  geo_score: seo.geo_score,
  geo_checks: seo.geo_checks,
  geo_suggestions: seo.geo_suggestions,
};

const quality = qualityGate(project);
project.quality_score = quality.quality_score;
project.quality_report = quality;
project.status = quality.passed ? "published" : "quality_gate";

console.log(JSON.stringify({
  title: project.title,
  status: project.status,
  seo_score: project.seo_score,
  geo_score: project.geo_optimization.geo_score,
  quality_score: project.quality_score,
  meta_title: project.seo_report.meta_title,
  meta_description: project.seo_report.meta_description,
  prompt_preview: project.generated_prompt.slice(0, 240),
  article_preview: project.generated_content.slice(0, 1200),
}, null, 2));
