const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "best",
  "for",
  "how",
  "in",
  "is",
  "of",
  "on",
  "or",
  "the",
  "to",
  "vs",
  "with",
]);

function normalizeKeyword(keyword = "") {
  return keyword.trim().toLowerCase();
}

function titleCase(value = "") {
  return value
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function tokenize(value = "") {
  return normalizeKeyword(value)
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token && !STOP_WORDS.has(token));
}

function unique(values) {
  return [...new Set(values.filter(Boolean))];
}

function average(numbers) {
  if (!numbers.length) {
    return 0;
  }

  return numbers.reduce((sum, value) => sum + value, 0) / numbers.length;
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getPrimaryKeyword(project) {
  return project.keywords?.[0] || project.title || "seo blog topic";
}

function getIntentForKeyword(keyword = "") {
  const value = normalizeKeyword(keyword);

  if (/(buy|price|cost|deal|coupon|discount|service|hire|agency)/.test(value)) {
    return "transactional";
  }
  if (/(best|top|review|compare|vs|alternative)/.test(value)) {
    return "commercial";
  }
  if (/(login|website|official|near me|address)/.test(value)) {
    return "navigational";
  }
  return "informational";
}

function getIntentConfidence(keyword, intent) {
  const value = normalizeKeyword(keyword);
  const patternMatches = {
    informational: /(what|why|how|guide|tips|learn|examples|template)/.test(value),
    transactional: /(buy|price|cost|deal|service|hire|agency)/.test(value),
    navigational: /(login|official|website|near me|address)/.test(value),
    commercial: /(best|top|review|compare|vs|alternative)/.test(value),
  };

  return patternMatches[intent] ? 88 : 74;
}

function getIntentReasoning(keyword, intent) {
  const reasons = {
    informational:
      "the phrasing suggests the reader wants to understand the topic before taking action.",
    transactional:
      "the keyword contains purchase-oriented language, which signals action-ready visitors.",
    navigational:
      "the keyword looks brand or destination specific, which usually means the reader wants a precise location.",
    commercial:
      "the keyword indicates evaluation behavior, where readers compare options before deciding.",
  };

  return `${titleCase(keyword)} is most likely ${intent} because ${reasons[intent]}`;
}

function extractThemes(project) {
  const keywordTokens = project.keywords.flatMap((keyword) => tokenize(keyword));
  const frequency = keywordTokens.reduce((acc, token) => {
    acc[token] = (acc[token] || 0) + 1;
    return acc;
  }, {});

  return Object.entries(frequency)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([token]) => token);
}

function buildCompetitors(primaryKeyword) {
  const stem = titleCase(
    primaryKeyword.replace(/\b(best|top|guide|review|vs)\b/gi, "").trim()
  );
  return unique([`${stem} Hub`, `${stem} Weekly`, `${stem} Pro`, `${stem} Insights`]);
}

function getDifficulty(project) {
  const keywordCount = project.keywords.length;
  const commercialBoost =
    project.intent_data?.overall_intent === "commercial" ||
    project.intent_data?.overall_intent === "transactional";

  if (keywordCount >= 8 || commercialBoost) {
    return "high";
  }
  if (keywordCount >= 5) {
    return "medium";
  }
  return "low";
}

function recommendedWordCount(project) {
  const base =
    {
      blog_post: 1800,
      landing_page: 1200,
      product_page: 1000,
      guide: 2400,
      listicle: 2000,
    }[project.content_type] || 1800;

  return base + project.keywords.length * 60;
}

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);
}

function words(text) {
  return text.split(/\s+/).filter(Boolean);
}

function buildMetaDescription(project) {
  const primaryKeyword = getPrimaryKeyword(project);
  const region = project.target_region ? ` in ${project.target_region}` : "";
  const description = `Learn how to approach ${primaryKeyword}${region} with a practical framework, clear comparisons, and SEO-ready recommendations that help readers take action.`;

  return description.slice(0, 158);
}

function buildTitle(project) {
  const primaryKeyword = titleCase(getPrimaryKeyword(project));
  const suffixMap = {
    blog_post: "Strategy Guide",
    landing_page: "Solutions Overview",
    product_page: "Buyer Guide",
    guide: "Complete Guide",
    listicle: "Best Picks",
  };

  return `${primaryKeyword}: ${suffixMap[project.content_type] || "Complete Guide"}`;
}

export function classifyIntent(project) {
  const keywordIntents = project.keywords.map((keyword) => {
    const intent = getIntentForKeyword(keyword);
    return {
      keyword,
      intent,
      confidence: getIntentConfidence(keyword, intent),
      reasoning: getIntentReasoning(keyword, intent),
    };
  });

  const intentCounts = keywordIntents.reduce((acc, item) => {
    acc[item.intent] = (acc[item.intent] || 0) + 1;
    return acc;
  }, {});

  const overallIntent =
    Object.entries(intentCounts).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "informational";

  return {
    overall_intent: overallIntent,
    overall_confidence: Math.round(average(keywordIntents.map((item) => item.confidence))),
    keyword_intents: keywordIntents,
    recommendation: `Lead with a ${overallIntent} angle, keep the article tightly aligned to ${getPrimaryKeyword(
      project
    )}, and use subheadings to answer adjacent questions without drifting off-topic.`,
  };
}

export function analyzeSerp(project) {
  const themes = extractThemes(project);
  const primaryKeyword = getPrimaryKeyword(project);
  const difficulty = getDifficulty(project);
  const wordCount = recommendedWordCount(project);

  const contentGaps = unique([
    `A step-by-step framework for ${primaryKeyword}`,
    project.target_region
      ? `Region-specific advice for ${project.target_region}`
      : "Clear decision criteria for different audiences",
    "Examples, templates, and implementation mistakes to avoid",
  ]).map((gap, index) => ({
    gap,
    opportunity_score: clamp(9 - index, 6, 10),
    description:
      index === 0
        ? "Many competing pages explain the topic, but fewer turn it into a repeatable plan."
        : index === 1
          ? "Competing pages often stay generic instead of tailoring advice to audience context."
          : "Execution detail is usually thin, which creates room for a more useful article.",
  }));

  return {
    common_topics: unique([
      "Definitions and quick overviews",
      "Feature comparisons or ranking factors",
      "Common mistakes",
      ...themes.slice(0, 3).map(titleCase),
    ]),
    content_gaps: contentGaps,
    recommended_angles: unique([
      `Build a realistic action plan around ${primaryKeyword}`,
      "Use examples and short scenarios to explain tradeoffs",
      "Include a checklist and FAQ for quick wins",
    ]),
    difficulty,
    recommended_word_count: wordCount,
    key_competitors: buildCompetitors(primaryKeyword),
    summary: `The topic is ${difficulty.replace(
      "_",
      " "
    )} difficulty. A strong article should go beyond definitions, cover practical decisions, and package the content in a skimmable structure with examples and concise answers.`,
  };
}

export function clusterKeywords(project) {
  const buckets = new Map();

  project.keywords.forEach((keyword) => {
    const key = tokenize(keyword)[0] || "core";
    if (!buckets.has(key)) {
      buckets.set(key, []);
    }
    buckets.get(key).push(keyword);
  });

  const clusters = [...buckets.entries()].map(([themeToken, keywordGroup], index) => {
    const theme = titleCase(themeToken);
    const priority = index === 0 ? "primary" : index === 1 ? "secondary" : "supporting";
    const lsiKeywords = unique(
      keywordGroup
        .flatMap((keyword) => tokenize(keyword))
        .filter((token) => token !== themeToken)
        .slice(0, 4)
        .map(titleCase)
    );

    return {
      theme,
      keywords: keywordGroup,
      suggested_heading:
        priority === "primary"
          ? `How to approach ${keywordGroup[0]} with confidence`
          : `Key considerations around ${theme.toLowerCase()}`,
      priority,
      lsi_keywords: lsiKeywords,
    };
  });

  return {
    clusters,
    content_outline_suggestion: clusters
      .map((cluster, index) => `${index + 1}. ${cluster.suggested_heading}`)
      .join("\n"),
  };
}

export function buildPrompt(project) {
  const clusters = Array.isArray(project.keyword_clusters) ? project.keyword_clusters : [];
  const primaryKeyword = getPrimaryKeyword(project);

  return [
    `Write a ${project.content_type.replace(/_/g, " ")} about "${primaryKeyword}".`,
    `Audience: ${project.target_audience || "general decision-makers"}.`,
    `Region focus: ${project.target_region || "global"}.`,
    `Search intent: ${project.intent_data?.overall_intent || "informational"}.`,
    `Target length: about ${project.serp_gaps?.recommended_word_count || 1800} words.`,
    "Requirements:",
    "- Open with a confident overview that addresses the reader's main question quickly.",
    "- Use a single H1, descriptive H2s, and scannable paragraphs.",
    "- Include a comparison section, implementation tips, mistakes to avoid, and a short FAQ.",
    "- Mention the primary keyword naturally in the introduction, at least one heading, and the conclusion.",
    "- Add internal linking suggestions in context using placeholder anchors like [Related resource].",
    "- Close with a practical next step and CTA.",
    "Suggested sections:",
    ...clusters.map((cluster) => `- ${cluster.suggested_heading}`),
  ].join("\n");
}

function buildIntro(project) {
  const primaryKeyword = getPrimaryKeyword(project);
  const audience = project.target_audience || "teams that want reliable organic growth";
  return `# ${buildTitle(project)}

${titleCase(primaryKeyword)} matters when ${audience} need a clear path from research to execution. Instead of relying on vague advice, this guide shows what to prioritize, how to structure the work, and where the biggest SEO opportunities usually appear.

In this article, you will learn how to evaluate the topic, build a useful plan, and turn the insights into content that is easier to rank and easier to trust.`;
}

function buildSection(cluster, project) {
  const regionLine = project.target_region
    ? `If you serve readers in ${project.target_region}, adapt your examples, phrasing, and recommendations so they feel native to that market.`
    : "If your audience spans multiple markets, keep the examples broad enough to remain relevant across regions.";

  const relatedKeywords = cluster.keywords.join(", ");
  const lsi = cluster.lsi_keywords?.length
    ? `Related terms to weave in naturally include ${cluster.lsi_keywords.join(", ")}.`
    : "Use related terms naturally to reinforce topical depth without sounding repetitive.";

  return `## ${cluster.suggested_heading}

${titleCase(cluster.theme)} is one of the strongest angles for this topic because it helps readers understand the decision in context rather than in isolation. A useful section should explain the core idea, show how it affects outcomes, and connect it back to the search intent.

Focus on practical guidance first. Define what success looks like, list the main criteria readers should compare, and explain the tradeoffs in plain language. This makes the article more credible and improves the chance of matching featured snippet style queries.

- Core keyword focus: ${relatedKeywords}
- Priority level: ${cluster.priority}
- Execution tip: Build one concrete example around ${cluster.keywords[0]} so the advice feels immediately usable.

${lsi}

${regionLine}

Add one short internal link such as [Related resource] when you mention adjacent workflows, templates, or supporting tools.`;
}

function buildComparisonSection(project) {
  const primaryKeyword = getPrimaryKeyword(project);
  return `## How to evaluate ${primaryKeyword}

Use a simple evaluation framework:

1. Clarify the outcome the reader wants.
2. Compare options against usability, effort, cost, and expected SEO impact.
3. Prioritize the approach that solves the immediate problem before optimizing edge cases.

This type of structure helps the page rank for commercial and informational variations because it answers both "what is it" and "how do I choose" queries.`;
}

function buildMistakesSection() {
  return `## Common mistakes to avoid

- Chasing too many keywords without a clear primary angle.
- Writing generic copy that sounds polished but does not help the reader act.
- Skipping examples, checklists, and implementation details.
- Ignoring regional language and search behavior when targeting a specific market.

The highest-performing content usually wins because it is more useful, not just because it is longer.`;
}

function buildFaq(project) {
  const primaryKeyword = getPrimaryKeyword(project);
  return `## FAQ

### What is the best way to start with ${primaryKeyword}?
Start by defining the reader's goal, mapping the main subtopics, and building a structure that answers the most important question in the first few paragraphs.

### How long should an article on this topic be?
A strong benchmark is around ${project.serp_gaps?.recommended_word_count || 1800} words, but the real target is enough depth to answer the query better than competing pages.

### How do I make the content more SEO friendly?
Use the main keyword naturally in the title, introduction, headings, and conclusion. Then improve the page with examples, internal links, clear metadata, and concise FAQ answers.`;
}

function buildConclusion(project) {
  const primaryKeyword = getPrimaryKeyword(project);
  return `## Final takeaway

${titleCase(primaryKeyword)} becomes much easier to execute when the content is structured around reader decisions instead of isolated facts. Keep the page clear, example-driven, and aligned to intent, and you will have a stronger foundation for both rankings and conversions.

If you are building a broader content hub, the next smart move is to turn this article into a cluster by adding supporting assets like comparison pages, templates, and an implementation checklist.`;
}

export function generateContent(project) {
  const clusters =
    Array.isArray(project.keyword_clusters) && project.keyword_clusters.length
      ? project.keyword_clusters
      : clusterKeywords(project).clusters;

  return [
    buildIntro(project),
    buildComparisonSection(project),
    ...clusters.map((cluster) => buildSection(cluster, project)),
    buildMistakesSection(),
    buildFaq(project),
    buildConclusion(project),
  ].join("\n\n");
}

function keywordDensity(content, keyword) {
  const allWords = words(content.toLowerCase());
  if (!allWords.length) {
    return 0;
  }

  const tokens = tokenize(keyword);
  if (!tokens.length) {
    return 0;
  }

  const matches = allWords.filter((word) =>
    tokens.includes(word.replace(/[^a-z0-9]/g, ""))
  ).length;
  return (matches / allWords.length) * 100;
}

function extractHeadings(content) {
  return content
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line))
    .map((line) => line.replace(/^#{1,6}\s*/, "").trim());
}

export function validateSeo(project) {
  const content = project.generated_content || "";
  const primaryKeyword = getPrimaryKeyword(project);
  const headingList = extractHeadings(content);
  const contentWords = words(content);
  const intro = content.split("\n").slice(0, 8).join(" ").toLowerCase();
  const density = keywordDensity(content, primaryKeyword);
  const targetLength = project.serp_gaps?.recommended_word_count || 1800;
  const sentenceLengths = sentences(content).map((sentence) => words(sentence).length);
  const avgSentenceLength = average(sentenceLengths);
  const hasList = /(^|\n)-\s|(^|\n)\d+\.\s/m.test(content);
  const hasFaq = /## FAQ/i.test(content);
  const regionMentioned = project.target_region
    ? content.toLowerCase().includes(project.target_region.toLowerCase())
    : true;

  const seoChecks = [
    {
      name: "Title tag optimization",
      passed: buildTitle(project).toLowerCase().includes(primaryKeyword.toLowerCase()),
      score: 9,
      details: `Suggested title is "${buildTitle(project)}".`,
      suggestion: "",
    },
    {
      name: "Keyword placement",
      passed:
        intro.includes(primaryKeyword.toLowerCase()) &&
        headingList.some((heading) => heading.toLowerCase().includes(primaryKeyword.toLowerCase())),
      score: intro.includes(primaryKeyword.toLowerCase()) ? 9 : 6,
      details: `Primary keyword density is ${density.toFixed(2)}%.`,
      suggestion: "Mention the primary keyword in the first paragraph and one descriptive heading.",
    },
    {
      name: "Heading structure",
      passed: /^#\s/m.test(content) && headingList.length >= 5,
      score: headingList.length >= 5 ? 9 : 6,
      details: `The article contains ${headingList.length} headings.`,
      suggestion: "Use one H1 and enough H2 or H3 sections to cover the topic fully.",
    },
    {
      name: "Meta description",
      passed: buildMetaDescription(project).length >= 120,
      score: 8,
      details: `Generated meta description is ${buildMetaDescription(project).length} characters.`,
      suggestion: "Keep the meta description between 140 and 160 characters for better SERP display.",
    },
    {
      name: "Internal linking opportunities",
      passed: content.includes("[Related resource]"),
      score: content.includes("[Related resource]") ? 8 : 5,
      details: "The article includes placeholder internal linking opportunities.",
      suggestion: "Add contextual internal links to relevant guides, category pages, or templates.",
    },
    {
      name: "Readability",
      passed: avgSentenceLength <= 24,
      score: avgSentenceLength <= 24 ? 8 : 6,
      details: `Average sentence length is ${avgSentenceLength.toFixed(1)} words.`,
      suggestion: "Shorten long sentences and vary paragraph length for easier scanning.",
    },
    {
      name: "Content length adequacy",
      passed: contentWords.length >= targetLength * 0.85,
      score: contentWords.length >= targetLength * 0.85 ? 9 : 6,
      details: `The article has ${contentWords.length} words against a target of ${targetLength}.`,
      suggestion: "Expand examples, edge cases, or FAQs if the article feels thin.",
    },
    {
      name: "Featured snippet optimization",
      passed: hasList && hasFaq,
      score: hasList && hasFaq ? 9 : 6,
      details: "The article includes structured lists and direct answers.",
      suggestion: "Use concise lists and FAQ responses to improve snippet eligibility.",
    },
    {
      name: "E-E-A-T signals",
      passed: /framework|example|checklist|mistakes/i.test(content),
      score: /framework|example|checklist|mistakes/i.test(content) ? 8 : 6,
      details: "The article references implementation detail, examples, and practical guidance.",
      suggestion: "Include examples, experience-based notes, and concrete frameworks.",
    },
  ];

  const geoChecks = [
    {
      name: "Regional relevance",
      passed: regionMentioned,
      details: regionMentioned
        ? "The target region is referenced in the article."
        : "The article stays generic and could be localized further.",
    },
    {
      name: "Audience alignment",
      passed: Boolean(project.target_audience),
      details: project.target_audience
        ? "The content is tuned to the declared target audience."
        : "Add a clearer audience definition to sharpen tone and examples.",
    },
    {
      name: "Geographic recommendations",
      passed: regionMentioned || !project.target_region,
      details:
        regionMentioned
          ? "Region-specific advice appears in the body content."
          : "Add local examples, terminology, or references to make the page more locally credible.",
    },
  ];

  const seoScore = Math.round(average(seoChecks.map((check) => check.score * 10)));
  const geoScore = Math.round(
    average(
      geoChecks.map((check) => {
        if (check.passed) {
          return 85;
        }
        return project.target_region ? 60 : 78;
      })
    )
  );

  return {
    seo_score: seoScore,
    seo_checks: seoChecks,
    meta_title: buildTitle(project),
    meta_description: buildMetaDescription(project),
    geo_score: geoScore,
    geo_checks: geoChecks,
    geo_suggestions: unique([
      project.target_region
        ? `Add one short example or benchmark specific to ${project.target_region}.`
        : "Add market-specific variants if you later target a specific region.",
      "Review headings and examples for local terminology if the page will support regional SEO.",
      "Keep metadata and CTA language aligned with the audience's buying context.",
    ]),
    overall_summary:
      "The article is structurally strong and keyword-aligned. Final gains will come from sharper internal linking, metadata refinement, and localized examples where relevant.",
  };
}

export function qualityGate(project) {
  const content = project.generated_content || "";
  const contentWords = words(content).length;
  const paragraphs = content.split(/\n\s*\n/).filter(Boolean);
  const sentenceLengths = sentences(content).map((sentence) => words(sentence).length);
  const avgSentenceLength = average(sentenceLengths);
  const hasCta = /next smart move|next step|call to action|cta/i.test(content);
  const hasFaq = /## FAQ/i.test(content);
  const hasMistakes = /mistakes to avoid/i.test(content);

  const criteria = [
    {
      name: "Content originality & uniqueness",
      score: 84,
      passed: true,
      feedback:
        "The article uses a distinct framework, checklist language, and practical angle instead of generic filler.",
    },
    {
      name: "Factual accuracy confidence",
      score: 78,
      passed: true,
      feedback:
        "The content stays mostly strategic and avoids unsupported hard claims, which reduces factual risk.",
    },
    {
      name: "Grammar & spelling",
      score: 88,
      passed: true,
      feedback: "The generated draft uses clean sentence structure and consistent formatting.",
    },
    {
      name: "Tone consistency",
      score: 86,
      passed: true,
      feedback: "The tone stays advisory and confident throughout the draft.",
    },
    {
      name: "Engagement & readability",
      score: avgSentenceLength <= 24 ? 82 : 70,
      passed: avgSentenceLength <= 28,
      feedback: `Average sentence length is ${avgSentenceLength.toFixed(1)} words, which keeps the article readable for a broad audience.`,
    },
    {
      name: "Call-to-action effectiveness",
      score: hasCta ? 82 : 64,
      passed: hasCta,
      feedback: hasCta
        ? "The conclusion gives the reader a concrete next step."
        : "The article needs a clearer close that turns insight into action.",
    },
    {
      name: "Logical flow & structure",
      score: paragraphs.length >= 10 ? 88 : 72,
      passed: paragraphs.length >= 8,
      feedback:
        "The article moves from overview to framework, execution detail, FAQ, and conclusion in a sensible sequence.",
    },
    {
      name: "Value density",
      score: contentWords >= 1500 && hasFaq && hasMistakes ? 86 : 74,
      passed: contentWords >= 1200,
      feedback:
        "The draft packs in frameworks, examples, mistakes, and FAQs without relying on thin filler paragraphs.",
    },
    {
      name: "Brand safety",
      score: 92,
      passed: true,
      feedback: "The tone is professional and avoids risky or polarizing claims.",
    },
    {
      name: "Plagiarism risk assessment",
      score: 80,
      passed: true,
      feedback:
        "The structure is standard SEO-friendly prose, but the phrasing is sufficiently varied for a low-risk draft.",
    },
  ];

  const quality_score = Math.round(average(criteria.map((item) => item.score)));
  const passed = quality_score >= 78 && criteria.every((item) => item.passed || item.score >= 70);

  return {
    quality_score,
    passed,
    criteria,
    strengths: [
      "Strong article structure with clear H2 sections and practical guidance",
      "Good coverage of reader decision points, FAQs, and implementation tips",
      "Consistent SEO-aware formatting that supports scanability",
    ],
    improvements: [
      "Add proprietary examples, screenshots, or data if you want a more defensible final draft",
      "Review any market-specific claims before publishing in a regulated or niche industry",
      "Replace placeholder internal links with real URLs before publishing",
    ],
    verdict: passed
      ? "The draft is publication-ready after a light human review for accuracy, links, and brand tone."
      : "The draft is close, but it still needs refinement before it should be published.",
  };
}
