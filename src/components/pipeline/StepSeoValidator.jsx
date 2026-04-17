import React, { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
  MapPin,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { validateSeo } from "@/lib/pipelineEngine";
import { toast } from "@/components/ui/use-toast";

export default function StepSeoValidator({ project, onUpdate, onNext, onBack, isSaving }) {
  const [loading, setLoading] = useState(false);
  const [seoReport, setSeoReport] = useState(project.seo_report || null);
  const [geoData, setGeoData] = useState(project.geo_optimization || null);

  const validate = async () => {
    try {
      setLoading(true);
      const result = validateSeo(project);
      setSeoReport({
        seo_score: result.seo_score,
        seo_checks: result.seo_checks,
        meta_title: result.meta_title,
        meta_description: result.meta_description,
        overall_summary: result.overall_summary,
      });
      setGeoData({
        geo_score: result.geo_score,
        geo_checks: result.geo_checks,
        geo_suggestions: result.geo_suggestions,
      });
    } catch (error) {
      toast({
        title: "SEO validation failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleNext = async () => {
    await onUpdate({
      seo_score: seoReport.seo_score,
      seo_report: seoReport,
      geo_optimization: geoData,
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
        <h2 className="text-2xl font-bold text-foreground mb-1">SEO Validator + GEO Optimizer</h2>
        <p className="text-muted-foreground text-sm">
          Score the draft locally for SEO structure, metadata quality, and geographic alignment.
        </p>
      </div>

      {!seoReport && !loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <ShieldCheck className="w-12 h-12 text-primary/40 mb-4" />
          <p className="text-muted-foreground mb-6 text-sm">
            Run the SEO and GEO checks on your generated draft
          </p>
          <Button onClick={validate} className="bg-primary hover:bg-primary/90 gap-2">
            <ShieldCheck className="w-4 h-4" /> Validate & Optimize
          </Button>
        </div>
      )}

      {loading && (
        <div className="flex flex-col items-center justify-center py-16 border border-dashed border-border rounded-2xl bg-secondary/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
          <p className="text-muted-foreground text-sm">Running SEO and GEO analysis...</p>
        </div>
      )}

      {seoReport && geoData && (
        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="p-5 rounded-2xl bg-secondary/50 border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">SEO Score</p>
              <p className={`text-4xl font-bold ${scoreColor(seoReport.seo_score)}`}>
                {seoReport.seo_score}
              </p>
              <Progress value={seoReport.seo_score} className="mt-3 h-2" />
            </div>
            <div className="p-5 rounded-2xl bg-secondary/50 border border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">GEO Score</p>
              <p className={`text-4xl font-bold ${scoreColor(geoData.geo_score)}`}>
                {geoData.geo_score}
              </p>
              <Progress value={geoData.geo_score} className="mt-3 h-2" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-card border border-border space-y-3">
            <div>
              <span className="text-xs text-muted-foreground">Suggested Title Tag</span>
              <p className="text-sm font-medium text-primary">{seoReport.meta_title}</p>
            </div>
            <div>
              <span className="text-xs text-muted-foreground">Suggested Meta Description</span>
              <p className="text-sm text-foreground/80">{seoReport.meta_description}</p>
            </div>
            <p className="text-xs text-muted-foreground">{seoReport.overall_summary}</p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" /> SEO Checks
            </h3>
            <div className="grid gap-2">
              {seoReport.seo_checks?.map((check, index) => (
                <div key={`${check.name}-${index}`} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                  {check.passed ? (
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.details}</p>
                    {check.suggestion && !check.passed ? (
                      <p className="text-xs text-chart-3 mt-1">Tip: {check.suggestion}</p>
                    ) : null}
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">{check.score}/10</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-accent" /> GEO Optimization
            </h3>
            <div className="grid gap-2">
              {geoData.geo_checks?.map((check, index) => (
                <div key={`${check.name}-${index}`} className="flex items-start gap-3 p-3 rounded-lg bg-card border border-border">
                  {check.passed ? (
                    <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-foreground">{check.name}</p>
                    <p className="text-xs text-muted-foreground">{check.details}</p>
                  </div>
                </div>
              ))}
            </div>
            {geoData.geo_suggestions?.length > 0 ? (
              <div className="mt-3 p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-xs font-medium text-accent mb-2">Suggestions</p>
                <ul className="list-disc pl-4 space-y-1">
                  {geoData.geo_suggestions.map((suggestion, index) => (
                    <li key={`${suggestion}-${index}`} className="text-xs text-foreground/70">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <Button variant="outline" size="sm" onClick={validate}>
            Re-validate
          </Button>
        </div>
      )}

      <div className="flex justify-between pt-4">
        <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
          <ArrowLeft className="w-4 h-4" /> Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!seoReport || isSaving}
          className="bg-primary hover:bg-primary/90 gap-2"
        >
          Quality Gate <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
