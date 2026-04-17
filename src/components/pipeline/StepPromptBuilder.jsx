import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { buildPrompt } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

export default function StepPromptBuilder({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [prompt, setPrompt] = useState(project.generated_prompt || "");

  const createPrompt = async () => {
    try {
      setLoading(true);
      setPrompt(buildPrompt(project));
    } catch (error) {
      toast({
        title: "Prompt generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({ generated_prompt: prompt });
    await onNext();
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Prompt Builder</h2>
        <p className="text-muted-foreground text-sm">
          Create a reusable editorial brief that drives the article generation step.
        </p>
      </div>

      {!prompt && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Wand2 className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Auto-build an optimized prompt from your research
          </p>
          <Button onClick={createPrompt} className="bg-primary hover:bg-primary/90 gap-2">
            <Wand2 className="w-4 h-4" /> Build Prompt
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Constructing editorial brief...</p>
        </div>
      )}

      {prompt && (
        <div className="space-y-4">
          <Textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="bg-secondary border-border font-mono text-sm min-h-[400px] resize-y"
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={createPrompt}>
              Regenerate
            </Button>
          </div>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!prompt || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Generate Content <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
