const STORAGE_KEY = "seo-blog-generator-projects-v1";

const memoryStorage = (() => {
  let store = {};
  return {
    getItem(key) {
      return Object.prototype.hasOwnProperty.call(store, key) ? store[key] : null;
    },
    setItem(key, value) {
      store[key] = String(value);
    },
    removeItem(key) {
      delete store[key];
    },
  };
})();

const storage =
  typeof window === "undefined" ? memoryStorage : window.localStorage;

function nowIso() {
  return new Date().toISOString();
}

function createId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  return `project_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

function readProjects() {
  const raw = storage.getItem(STORAGE_KEY);
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to parse stored projects", error);
    return [];
  }
}

function writeProjects(projects) {
  storage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function sortProjects(projects, sortBy = "-updated_date") {
  if (sortBy === "-updated_date") {
    return [...projects].sort(
      (a, b) => new Date(b.updated_date).getTime() - new Date(a.updated_date).getTime()
    );
  }

  return [...projects];
}

export function listProjects(sortBy = "-updated_date") {
  return sortProjects(readProjects(), sortBy);
}

export function getProjectById(id) {
  return readProjects().find((project) => project.id === id) || null;
}

export function createProject(data) {
  const timestamp = nowIso();
  const project = {
    id: createId(),
    title: data.title,
    status: data.status || "keyword_input",
    keywords: data.keywords || [],
    intent_data: null,
    serp_gaps: null,
    keyword_clusters: [],
    generated_prompt: "",
    generated_content: "",
    seo_score: 0,
    seo_report: null,
    geo_optimization: null,
    quality_score: 0,
    quality_report: null,
    target_audience: data.target_audience || "",
    target_region: data.target_region || "",
    content_type: data.content_type || "blog_post",
    created_date: timestamp,
    updated_date: timestamp,
  };

  const projects = readProjects();
  writeProjects([project, ...projects]);
  return project;
}

export function updateProject(id, data) {
  let updatedProject = null;
  const projects = readProjects().map((project) => {
    if (project.id !== id) {
      return project;
    }

    updatedProject = {
      ...project,
      ...data,
      updated_date: nowIso(),
    };

    return updatedProject;
  });

  writeProjects(projects);
  return updatedProject;
}
