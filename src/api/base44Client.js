import {
  createProject,
  getProjectById,
  listProjects,
  updateProject,
} from "@/lib/projectStore";

const demoUser = {
  id: "local-user",
  name: "Local User",
  email: "local@example.com",
  role: "admin",
};

export const base44 = {
  auth: {
    async me() {
      return demoUser;
    },
    logout() {
      return undefined;
    },
    redirectToLogin() {
      return undefined;
    },
  },
  entities: {
    ContentProject: {
      async list(sortBy = "-updated_date") {
        return listProjects(sortBy);
      },
      async filter(filters = {}) {
        if (filters.id) {
          const project = getProjectById(filters.id);
          return project ? [project] : [];
        }

        return listProjects("-updated_date").filter((project) =>
          Object.entries(filters).every(([key, value]) => project[key] === value)
        );
      },
      async create(data) {
        return createProject(data);
      },
      async update(id, data) {
        return updateProject(id, data);
      },
    },
  },
  integrations: {
    Core: {
      async InvokeLLM() {
        throw new Error(
          "Hosted LLM calls have been removed. Use the local pipeline engine instead."
        );
      },
    },
  },
};
