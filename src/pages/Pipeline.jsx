import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertCircle, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { PIPELINE_STEPS, getStepIndex, getNextStep } from "@/lib/pipelineSteps";
import PipelineProgress from "@/components/pipeline/PipelineProgress";
import StepKeywordInput from "@/components/pipeline/StepKeywordInput";
import StepIntentClassifier from "@/components/pipeline/StepIntentClassifier";
import StepSerpAnalyzer from "@/components/pipeline/StepSerpAnalyzer";
import StepKeywordClustering from "@/components/pipeline/StepKeywordClustering";
import StepPromptBuilder from "@/components/pipeline/StepPromptBuilder";
import StepAIGenerator from "@/components/pipeline/StepAIGenerator";
import StepSeoValidator from "@/components/pipeline/StepSeoValidator";
import StepQualityGate from "@/components/pipeline/StepQualityGate";
import StepPublish from "@/components/pipeline/StepPublish";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";

export default function Pipeline() {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [currentStep, setCurrentStep] = useState(null);

  useEffect(() => {
    if (!projectId) {
      navigate("/new", { replace: true });
    }
  }, [navigate, projectId]);

  const {
    data: project,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      const results = await base44.entities.ContentProject.filter({ id: projectId });
      return results[0] || null;
    },
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    if (project?.status) {
      setCurrentStep((existing) => existing ?? project.status);
    }
  }, [project]);

  const updateMutation = useMutation({
    mutationFn: async (data) => {
      const updated = await base44.entities.ContentProject.update(projectId, data);
      if (!updated) {
        throw new Error("Project could not be updated.");
      }
      return updated;
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(["project", projectId], updated);
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
    onError: (mutationError) => {
      toast({
        title: "Update failed",
        description: mutationError.message || "Please try that step again.",
        variant: "destructive",
      });
    },
  });

  const onUpdate = async (data) => {
    return updateMutation.mutateAsync(data);
  };

  const setAndPersistStep = async (stepKey) => {
    setCurrentStep(stepKey);
    await onUpdate({ status: stepKey });
  };

  const advanceStep = async () => {
    const nextStep = getNextStep(currentStep);
    await setAndPersistStep(nextStep);
  };

  const goBack = async () => {
    const currentIndex = getStepIndex(currentStep);
    if (currentIndex > 0) {
      await setAndPersistStep(PIPELINE_STEPS[currentIndex - 1].key);
    }
  };

  const stepProps = useMemo(
    () => ({
      project,
      onUpdate,
      onNext: advanceStep,
      onBack: goBack,
      isSaving: updateMutation.isPending,
    }),
    [project, updateMutation.isPending]
  );

  const stepComponents = {
    keyword_input: <StepKeywordInput {...stepProps} />,
    intent_classification: <StepIntentClassifier {...stepProps} />,
    serp_analysis: <StepSerpAnalyzer {...stepProps} />,
    keyword_clustering: <StepKeywordClustering {...stepProps} />,
    prompt_building: <StepPromptBuilder {...stepProps} />,
    content_generation: <StepAIGenerator {...stepProps} />,
    seo_validation: <StepSeoValidator {...stepProps} />,
    quality_gate: <StepQualityGate {...stepProps} />,
    published: <StepPublish {...stepProps} />,
  };

  if (!projectId) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  if (isError || !project) {
    return (
      <div className="max-w-xl mx-auto py-16">
        <div className="p-6 rounded-2xl bg-card border border-border text-center space-y-4">
          <AlertCircle className="w-10 h-10 text-destructive mx-auto" />
          <div>
            <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
            <p className="text-sm text-muted-foreground mt-2">
              {error?.message || "The requested project could not be loaded."}
            </p>
          </div>
          <Button onClick={() => navigate("/projects")}>Back to Projects</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <PipelineProgress
        currentStatus={currentStep || project.status}
        onStepClick={(step) => {
          setCurrentStep(step);
        }}
      />
      <div className="max-w-4xl mx-auto">
        {stepComponents[currentStep || project.status] || stepComponents.keyword_input}
      </div>
    </div>
  );
}
