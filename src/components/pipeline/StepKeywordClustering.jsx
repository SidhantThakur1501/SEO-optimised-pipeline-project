import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { clusterKeywords } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

const clusterColors = [
  "bg-primary/10 border-primary/30 text-primary",
  "bg-accent/10 border-accent/30 text-accent",
  "bg-chart-3/10 border-chart-3/30 text-chart-3",
  "bg-chart-4/10 border-chart-4/30 text-chart-4",
  "bg-chart-5/10 border-chart-5/30 text-chart-5",
];

export default function StepKeywordClustering({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [clusters, setClusters] = useState(
    project.keyword_clusters?.length
      ? { clusters: project.keyword_clusters, content_outline_suggestion: "" }
      : null
  );

  const runClustering = async () => {
    try {
      setLoading(true);
      setClusters(clusterKeywords(project));
    } catch (error) {
      toast({
        title: "Keyword clustering failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({ keyword_clusters: clusters?.clusters || [] });
    await onNext();
  };

  const priorityBadge = {
    primary: "bg-primary/20 text-primary",
    secondary: "bg-accent/20 text-accent",
    supporting: "bg-muted text-muted-foreground",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Keyword Clustering</h2>
        <p className="text-muted-foreground text-sm">
          Group related keywords into semantic sections for a stronger content structure.
        </p>
      </div>

      {!clusters && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Layers className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Organize your keywords into topic clusters
          </p>
          <Button onClick={runClustering} className="bg-primary hover:bg-primary/90 gap-2">
            <Layers className="w-4 h-4" /> Cluster Keywords
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Clustering keywords...</p>
        </div>
      )}

      {clusters && (
        <div className="space-y-6">
          <div className="grid gap-4">
            {clusters.clusters?.map((cluster, index) => (
              <div
                key={`${cluster.theme}-${index}`}
                className={`p-5 rounded-2xl border ${clusterColors[index % clusterColors.length]}`}
              >
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="font-semibold text-sm">{cluster.theme}</h3>
                  <Badge className={`${priorityBadge[cluster.priority]} text-xs capitalize`}>
                    {cluster.priority}
                  </Badge>
                </div>
                <p className="text-xs text-foreground/70 mb-3">
                  Suggested heading:{" "}
                  <span className="font-medium">{cluster.suggested_heading}</span>
                </p>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {cluster.keywords?.map((keyword, keywordIndex) => (
                    <Badge
                      key={`${keyword}-${keywordIndex}`}
                      variant="outline"
                      className="text-xs border-current/20"
                    >
                      {keyword}
                    </Badge>
                  ))}
                </div>
                {cluster.lsi_keywords?.length > 0 && (
                  <div>
                    <span className="text-xs text-muted-foreground">LSI Keywords: </span>
                    <span className="text-xs text-foreground/60">
                      {cluster.lsi_keywords.join(", ")}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {clusters.content_outline_suggestion ? (
            <div className="p-4 rounded-xl bg-secondary/50 border border-border">
              <h3 className="text-sm font-semibold text-foreground mb-2">
                Content Outline Suggestion
              </h3>
              <p className="text-sm text-foreground/70 whitespace-pre-wrap">
                {clusters.content_outline_suggestion}
              </p>
            </div>
          ) : null}

          <Button variant="outline" size="sm" onClick={runClustering}>
            Re-cluster
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!clusters || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Build Prompt <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
