import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, Shield, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { qualityGate } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

export default function StepQualityGate({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [qualityReport, setQualityReport] = useState(project.quality_report || null);

  const runQualityGate = async () => {
    try {
      setLoading(true);
      setQualityReport(qualityGate(project));
    } catch (error) {
      toast({
        title: "Quality review failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({
      quality_score: qualityReport.quality_score,
      quality_report: qualityReport,
    });
    await onNext();
  };

  const scoreColor = (score) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-chart-3";
    if (score >= 40) return "text-chart-4";
    return "text-destructive";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Quality Gate</h2>
        <p className="text-muted-foreground text-sm">
          Run a final editorial review before the article moves into the publish stage.
        </p>
      </div>

      {!qualityReport && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Shield className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Run the final quality assessment
          </p>
          <Button onClick={runQualityGate} className="bg-primary hover:bg-primary/90 gap-2">
            <Shield className="w-4 h-4" /> Check Quality
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Evaluating content quality...</p>
        </div>
      )}

      {qualityReport && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-secondary/50 border border-border text-center">
            <p className="text-sm text-muted-foreground mb-2">Quality Score</p>
            <p className={`text-5xl font-bold ${scoreColor(qualityReport.quality_score)}`}>
              {qualityReport.quality_score}
            </p>
            <Progress value={qualityReport.quality_score} className="mt-4 h-2 max-w-xs mx-auto" />
            <div
              className={`mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${
                qualityReport.passed
                  ? "bg-accent/15 text-accent"
                  : "bg-destructive/15 text-destructive"
              }`}
            >
              {qualityReport.passed ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
              {qualityReport.passed ? "PASSED" : "NEEDS IMPROVEMENT"}
            </div>
          </div>

          <p className="text-sm text-foreground/80">{qualityReport.verdict}</p>

          <div className="grid gap-2">
            {qualityReport.criteria?.map((criterion, index) => (
              <div key={`${criterion.name}-${index}`} className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border">
                {criterion.passed ? (
                  <Check className="w-4 h-4 text-accent shrink-0" />
                ) : (
                  <X className="w-4 h-4 text-destructive shrink-0" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-foreground">{criterion.name}</p>
                  <p className="text-xs text-muted-foreground">{criterion.feedback}</p>
                </div>
                <span className={`text-sm font-mono font-bold ${scoreColor(criterion.score)}`}>
                  {criterion.score}
                </span>
              </div>
            ))}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-4 rounded-xl bg-accent/5 border border-accent/20">
              <h4 className="text-sm font-semibold text-accent mb-2">Strengths</h4>
              <ul className="list-disc pl-4 space-y-1">
                {qualityReport.strengths?.map((strength, index) => (
                  <li key={`${strength}-${index}`} className="text-xs text-foreground/70">
                    {strength}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 rounded-xl bg-chart-4/5 border border-chart-4/20">
              <h4 className="text-sm font-semibold text-chart-4 mb-2">Improvements</h4>
              <ul className="list-disc pl-4 space-y-1">
                {qualityReport.improvements?.map((improvement, index) => (
                  <li key={`${improvement}-${index}`} className="text-xs text-foreground/70">
                    {improvement}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Button variant="outline" size="sm" onClick={runQualityGate}>
            Re-check
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!qualityReport?.passed || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Publish & Report <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
