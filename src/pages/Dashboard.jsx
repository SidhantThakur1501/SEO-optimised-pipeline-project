import React from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  TrendingUp,
  Zap,
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PIPELINE_STEPS, getStepIndex } from "@/lib/pipelineSteps";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

export default function Dashboard() {
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: () => base44.entities.ContentProject.list("-updated_date"),
    initialData: [],
  });

  const published = projects.filter((project) => project.status === "published");
  const inProgress = projects.filter((project) => project.status !== "published");
  const avgSeoScore = published.length
    ? Math.round(
        published.reduce((sum, project) => sum + (project.seo_score || 0), 0) /
          published.length
      )
    : 0;

  const stats = [
    { label: "Total Projects", value: projects.length, icon: FileText, color: "text-primary" },
    { label: "Published", value: published.length, icon: CheckCircle2, color: "text-accent" },
    { label: "In Progress", value: inProgress.length, icon: Clock, color: "text-chart-3" },
    {
      label: "Avg SEO Score",
      value: avgSeoScore || "—",
      icon: TrendingUp,
      color: "text-chart-4",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Your SEO content pipeline at a glance.
          </p>
        </div>
        <Link to="/new">
          <Button className="bg-primary hover:bg-primary/90 gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" /> New Project
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.label} className="p-5 rounded-2xl bg-card border border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                {stat.label}
              </span>
              <stat.icon className={`w-4 h-4 ${stat.color}`} />
            </div>
            <p className={`text-3xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="p-5 rounded-2xl bg-card border border-border">
        <h2 className="text-sm font-semibold text-foreground mb-4">Pipeline Distribution</h2>
        <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
          {PIPELINE_STEPS.map((step) => {
            const count = projects.filter((project) => project.status === step.key).length;
            return (
              <div key={step.key} className="text-center p-3 rounded-xl bg-secondary/50">
                <p className="text-lg font-bold text-foreground">{count}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{step.shortLabel}</p>
              </div>
            );
          })}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Recent Projects</h2>
          <Link to="/projects" className="text-xs text-primary hover:underline">
            View all →
          </Link>
        </div>

        {projects.length === 0 && !isLoading && (
          <div className="text-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
            <Zap className="w-10 h-10 text-primary/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm mb-4">
              No projects yet. Start your first SEO pipeline.
            </p>
            <Link to="/new">
              <Button className="bg-primary hover:bg-primary/90 gap-2">
                <Plus className="w-4 h-4" /> Create Project
              </Button>
            </Link>
          </div>
        )}

        <div className="grid gap-3">
          {projects.slice(0, 5).map((project) => {
            const stepIndex = getStepIndex(project.status);
            const progress = ((stepIndex + 1) / PIPELINE_STEPS.length) * 100;
            const stepLabel =
              PIPELINE_STEPS.find((step) => step.key === project.status)?.label || "—";

            return (
              <Link key={project.id} to={`/pipeline?id=${project.id}`}>
                <div className="p-4 rounded-xl bg-card border border-border hover:border-primary/30 transition-all group flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate group-hover:text-primary transition-colors">
                      {project.title}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <Progress value={progress} className="flex-1 h-1" />
                      <Badge
                        variant="outline"
                        className="text-[10px] border-border text-muted-foreground shrink-0"
                      >
                        {stepLabel}
                      </Badge>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-2">
                      Updated {format(new Date(project.updated_date), "MMM d, yyyy")}
                    </p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
