import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Globe, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { analyzeSerp } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

export default function StepSerpAnalyzer({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [serpData, setSerpData] = useState(project.serp_gaps || null);

  const analyze = async () => {
    try {
      setLoading(true);
      setSerpData(analyzeSerp(project));
    } catch (error) {
      toast({
        title: "Research step failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({ serp_gaps: serpData });
    await onNext();
  };

  const difficultyColor = {
    low: "text-accent",
    medium: "text-chart-3",
    high: "text-chart-4",
    very_high: "text-destructive",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">SERP Gap Analyzer</h2>
        <p className="text-muted-foreground text-sm">
          Build a practical research brief without relying on paid search APIs.
        </p>
      </div>

      {!serpData && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Globe className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Analyze this topic to find useful content opportunities
          </p>
          <Button onClick={analyze} className="bg-primary hover:bg-primary/90 gap-2">
            <Globe className="w-4 h-4" /> Analyze SERP
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Building research snapshot...</p>
        </div>
      )}

      {serpData && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-secondary/50 border border-border">
            <p className="text-sm text-foreground/80 mb-3">{serpData.summary}</p>
            <div className="flex flex-wrap gap-4 text-sm">
              <div>
                <span className="text-muted-foreground">Difficulty: </span>
                <span className={`font-semibold capitalize ${difficultyColor[serpData.difficulty]}`}>
                  {serpData.difficulty?.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-muted-foreground">Recommended length: </span>
                <span className="font-semibold text-foreground">
                  {serpData.recommended_word_count?.toLocaleString()} words
                </span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3">
              Content Gaps & Opportunities
            </h3>
            <div className="grid gap-3">
              {serpData.content_gaps?.map((gap, index) => (
                <div key={`${gap.gap}-${index}`} className="p-4 rounded-xl bg-card border border-border">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm text-foreground">{gap.gap}</span>
                    <span className="text-xs font-mono text-accent">{gap.opportunity_score}/10</span>
                  </div>
                  <p className="text-xs text-muted-foreground">{gap.description}</p>
                  <Progress value={gap.opportunity_score * 10} className="mt-2 h-1" />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Recommended Angles</h3>
              <div className="flex flex-wrap gap-2">
                {serpData.recommended_angles?.map((angle, index) => (
                  <Badge key={`${angle}-${index}`} variant="outline" className="border-primary/30 text-primary text-xs">
                    {angle}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Reference Competitors</h3>
              <div className="flex flex-wrap gap-2">
                {serpData.key_competitors?.map((competitor, index) => (
                  <Badge
                    key={`${competitor}-${index}`}
                    variant="outline"
                    className="border-border text-muted-foreground text-xs"
                  >
                    {competitor}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={analyze}>
            Re-analyze
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!serpData || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Cluster Keywords <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
