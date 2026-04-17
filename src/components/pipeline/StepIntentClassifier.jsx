import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Brain, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { classifyIntent } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

const intentColors = {
  informational: "bg-chart-5/15 text-chart-5 border-chart-5/30",
  transactional: "bg-accent/15 text-accent border-accent/30",
  navigational: "bg-chart-3/15 text-chart-3 border-chart-3/30",
  commercial: "bg-chart-4/15 text-chart-4 border-chart-4/30",
};

export default function StepIntentClassifier({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [intentData, setIntentData] = useState(project.intent_data || null);

  const runClassifier = async () => {
    try {
      setLoading(true);
      const result = classifyIntent(project);
      setIntentData(result);
    } catch (error) {
      toast({
        title: "Intent analysis failed",
        description: error.message || "Please review your keywords and try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({ intent_data: intentData });
    await onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Intent Classifier</h2>
        <p className="text-muted-foreground text-sm">
          Analyze the intent behind your keywords with a local, free workflow.
        </p>
      </div>

      {!intentData && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Brain className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Classify the intent of your {project.keywords?.length} keyword(s)
          </p>
          <Button onClick={runClassifier} className="bg-primary hover:bg-primary/90 gap-2">
            <Brain className="w-4 h-4" />
            Classify Intent
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Analyzing search intent...</p>
        </div>
      )}

      {intentData && (
        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-secondary/50 border border-border">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-muted-foreground">Overall Intent</span>
              <Badge
                className={`${intentColors[intentData.overall_intent] || "bg-secondary"} border text-sm capitalize`}
              >
                {intentData.overall_intent}
              </Badge>
              <span className="text-sm text-muted-foreground">
                {intentData.overall_confidence}% confidence
              </span>
            </div>
            <p className="text-sm text-foreground/80">{intentData.recommendation}</p>
          </div>

          <div className="grid gap-3">
            {intentData.keyword_intents?.map((keywordIntent, index) => (
              <div
                key={`${keywordIntent.keyword}-${index}`}
                className="flex items-start gap-4 p-4 rounded-xl bg-card border border-border"
              >
                <Badge
                  className={`${intentColors[keywordIntent.intent] || "bg-secondary"} border text-xs capitalize shrink-0`}
                >
                  {keywordIntent.intent}
                </Badge>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">{keywordIntent.keyword}</p>
                  <p className="text-xs text-muted-foreground mt-1">{keywordIntent.reasoning}</p>
                </div>
                <span className="text-xs font-mono text-muted-foreground shrink-0">
                  {keywordIntent.confidence}%
                </span>
              </div>
            ))}
          </div>

          <Button variant="outline" size="sm" onClick={runClassifier}>
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
          disabled={!intentData || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Analyze SERP Gaps <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
