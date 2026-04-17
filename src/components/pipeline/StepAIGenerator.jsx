import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, ArrowRight, Loader2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { generateContent } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

export default function StepAIGenerator({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState(project.generated_content || "");
  const [editMode, setEditMode] = useState(false);

  const generate = async () => {
    try {
      setLoading(true);
      setContent(generateContent(project));
    } catch (error) {
      toast({
        title: "Content generation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({ generated_content: content });
    await onNext();
  };

  const wordCount = content ? content.split(/\s+/).filter(Boolean).length : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Article Generator</h2>
        <p className="text-muted-foreground text-sm">
          Generate a full draft locally with structured sections, FAQs, and SEO-aware formatting.
        </p>
      </div>

      {!content && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Sparkles className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Generate a polished article draft from your content brief
          </p>
          <Button onClick={generate} className="bg-primary hover:bg-primary/90 gap-2">
            <Sparkles className="w-4 h-4" /> Generate Content
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Generating article draft...</p>
        </div>
      )}

      {content && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{wordCount.toLocaleString()} words</span>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setEditMode((value) => !value)}>
                {editMode ? "Preview" : "Edit"}
              </Button>
              <Button variant="outline" size="sm" onClick={generate}>
                Regenerate
              </Button>
            </div>
          </div>

          {editMode ? (
            <textarea
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full min-h-[500px] bg-secondary border border-border rounded-xl p-5 font-mono text-sm text-foreground resize-y focus:outline-none focus:ring-2 focus:ring-primary"
            />
          ) : (
            <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-h-[600px] overflow-y-auto prose prose-invert prose-sm max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-2xl font-bold text-foreground mt-0 mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-xl font-semibold text-foreground mt-8 mb-3 pb-2 border-b border-border">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-lg font-medium text-foreground mt-6 mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm text-foreground/80 leading-relaxed mb-4">{children}</p>
                  ),
                  ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
                  ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
                  li: ({ children }) => <li className="text-sm text-foreground/80">{children}</li>,
                  strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-primary pl-4 my-4 text-muted-foreground italic">
                      {children}
                    </blockquote>
                  ),
                }}
              >
                {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!content || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Validate SEO <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
