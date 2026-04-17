import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Check, Copy, Download, FileText, Trophy } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/use-toast";

export default function StepPublish({ project, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const copyContent = async () => {
    await navigator.clipboard.writeText(project.generated_content || "");
    setCopied(true);
    toast({
      title: "Copied",
      description: "Generated blog content copied to your clipboard.",
    });
    window.setTimeout(() => setCopied(false), 2000);
  };

  const downloadContent = () => {
    const blob = new Blob([project.generated_content || ""], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${project.title?.replace(/\s+/g, "-").toLowerCase() || "content"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const wordCount = project.generated_content?.split(/\s+/).filter(Boolean).length || 0;
  const seoScore = project.seo_score || 0;
  const qualityScore = project.quality_score || 0;
  const geoScore = project.geo_optimization?.geo_score || 0;
  const overallScore = Math.round((seoScore + qualityScore + geoScore) / 3);

  const scoreColor = (score) => {
    if (score >= 80) return "text-accent";
    if (score >= 60) return "text-chart-3";
    return "text-chart-4";
  };

  return (
    <div className="space-y-6">
      <div className="text-center py-6">
        <div className="w-16 h-16 rounded-2xl bg-accent/15 flex items-center justify-center mx-auto mb-4">
          <Trophy className="w-8 h-8 text-accent" />
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-1">Content Ready</h2>
        <p className="text-muted-foreground text-sm">
          Your blog draft has completed the full pipeline and is ready for export.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-4">
        {[
          { label: "Overall", score: overallScore },
          { label: "SEO", score: seoScore },
          { label: "Quality", score: qualityScore },
          { label: "GEO", score: geoScore },
        ].map((item) => (
          <div key={item.label} className="p-4 rounded-xl bg-secondary/50 border border-border text-center">
            <p className="text-xs text-muted-foreground mb-1">{item.label}</p>
            <p className={`text-2xl font-bold ${scoreColor(item.score)}`}>{item.score}</p>
            <Progress value={item.score} className="mt-2 h-1" />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap gap-3 justify-center">
        <Badge variant="outline" className="text-foreground border-border">
          {wordCount.toLocaleString()} words
        </Badge>
        <Badge variant="outline" className="text-foreground border-border capitalize">
          {project.content_type?.replace(/_/g, " ")}
        </Badge>
        <Badge variant="outline" className="text-foreground border-border capitalize">
          {project.intent_data?.overall_intent} intent
        </Badge>
        <Badge variant="outline" className="text-foreground border-border">
          {project.keywords?.length} keywords
        </Badge>
      </div>

      {project.seo_report?.meta_title ? (
        <div className="p-4 rounded-xl bg-card border border-border space-y-2">
          <div>
            <span className="text-xs text-muted-foreground">Title Tag</span>
            <p className="text-sm font-medium text-primary">{project.seo_report.meta_title}</p>
          </div>
          <div>
            <span className="text-xs text-muted-foreground">Meta Description</span>
            <p className="text-sm text-foreground/80">{project.seo_report.meta_description}</p>
          </div>
        </div>
      ) : null}

      <div className="flex flex-wrap gap-3 justify-center">
        <Button onClick={copyContent} variant="outline" className="gap-2">
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? "Copied" : "Copy Content"}
        </Button>
        <Button onClick={downloadContent} variant="outline" className="gap-2">
          <Download className="w-4 h-4" /> Download .md
        </Button>
        <Button onClick={() => setShowContent((value) => !value)} variant="outline" className="gap-2">
          <FileText className="w-4 h-4" /> {showContent ? "Hide" : "View"} Content
        </Button>
      </div>

      {showContent ? (
        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 max-h-[500px] overflow-y-auto">
          <ReactMarkdown
            components={{
              h1: ({ children }) => <h1 className="text-2xl font-bold text-foreground mt-0 mb-4">{children}</h1>,
              h2: ({ children }) => (
                <h2 className="text-xl font-semibold text-foreground mt-8 mb-3 pb-2 border-b border-border">
                  {children}
                </h2>
              ),
              h3: ({ children }) => <h3 className="text-lg font-medium text-foreground mt-6 mb-2">{children}</h3>,
              p: ({ children }) => <p className="text-sm text-foreground/80 leading-relaxed mb-4">{children}</p>,
              ul: ({ children }) => <ul className="list-disc pl-5 mb-4 space-y-1">{children}</ul>,
              ol: ({ children }) => <ol className="list-decimal pl-5 mb-4 space-y-1">{children}</ol>,
              li: ({ children }) => <li className="text-sm text-foreground/80">{children}</li>,
              strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
            }}
          >
            {project.generated_content}
          </ReactMarkdown>
        </div>
      ) : null}

      <div className="flex justify-start pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
      </div>
    </div>
  );
}
