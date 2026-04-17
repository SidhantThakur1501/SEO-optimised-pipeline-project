import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { ChevronRight, FileText, Loader2, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PIPELINE_STEPS, getStepIndex } from "@/lib/pipelineSteps";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export default function Projects() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.ContentProject.list("-updated_date"),
    initialData: [],
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {projects.length} project{projects.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link to="/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </Link>
      </div>

      {isLoading && (
        <div className="flex justify-center py-20">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}

      {!isLoading && projects.length === 0 && (
        <div className="text-center py-20 border border-dashed border-border rounded-2xl bg-secondary/30">
          <FileText className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">No projects yet</p>
          <Link to="/new">
            <Button className="bg-primary hover:bg-primary/90 gap-2">
              <Plus className="w-4 h-4" /> Create First Project
            </Button>
          </Link>
        </div>
      )}

      <div className="grid gap-3">
        {projects.map((project) => {
          const stepIndex = getStepIndex(project.status);
          const progress = ((stepIndex + 1) / PIPELINE_STEPS.length) * 100;
          const currentStepLabel =
            PIPELINE_STEPS.find((step) => step.key === project.status)?.label || "Unknown";

          return (
            <Link key={project.id} to={`/pipeline?id=${project.id}`}>
              <div className="p-5 rounded-2xl bg-card border border-border hover:border-primary/30 transition-all group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {project.updated_date
                        ? format(new Date(project.updated_date), "MMM d, yyyy")
                        : "—"}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="flex-1 h-1.5" />
                  <Badge
                    variant="outline"
                    className="text-xs border-border text-muted-foreground shrink-0"
                  >
                    {currentStepLabel}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {project.keywords?.slice(0, 4).map((keyword, index) => (
                    <Badge
                      key={`${keyword}-${index}`}
                      variant="secondary"
                      className="text-xs bg-secondary text-secondary-foreground"
                    >
                      {keyword}
                    </Badge>
                  ))}
                  {project.keywords?.length > 4 && (
                    <Badge
                      variant="secondary"
                      className="text-xs bg-secondary text-muted-foreground"
                    >
                      +{project.keywords.length - 4}
                    </Badge>
                  )}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
