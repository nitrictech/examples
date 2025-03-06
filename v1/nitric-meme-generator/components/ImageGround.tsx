"use client";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { PromptInput } from "./PromptInput";
import {
  initializeProviderRecord,
  MODEL_CONFIGS,
  ModelMode,
  PROVIDER_ORDER,
  ProviderKey,
  PROVIDERS,
} from "@/lib/provider-config";
import { Suggestion } from "@/lib/suggestions";
import { ModelCardCarousel } from "./ModelCardCarousel";
import { ModelSelect } from "./ModelSelect";
import { useImageGeneration } from "@/hooks/use-image-generation";
import { toast } from "@/hooks/use-toast";

export function ImageGround({ suggestions }: { suggestions: Suggestion[] }) {
  const {
    images,
    timings,
    failedProviders,
    isLoading,
    startGeneration,
    activePrompt,
    errors,
  } = useImageGeneration();

  const [showProviders, setShowProviders] = useState(true);
  const [selectedModels, setSelectedModels] = useState<
    Record<ProviderKey, string>
  >(MODEL_CONFIGS.performance);
  const [enabledProviders, setEnabledProviders] = useState(
    initializeProviderRecord(true)
  );
  const [mode, setMode] = useState<ModelMode>("performance");
  const toggleView = () => {
    setShowProviders((prev) => !prev);
  };

  const handleModeChange = (newMode: ModelMode) => {
    setMode(newMode);
    setSelectedModels(MODEL_CONFIGS[newMode]);
    setShowProviders(true);
  };

  const handleModelChange = (providerKey: ProviderKey, model: string) => {
    setSelectedModels((prev) => ({ ...prev, [providerKey]: model }));
  };

  const handleProviderToggle = (provider: string, enabled: boolean) => {
    setEnabledProviders((prev) => ({
      ...prev,
      [provider]: enabled,
    }));
  };

  const providerToModel = {
    openai: selectedModels.openai,
  };

  const handlePromptSubmit = (newPrompt: string) => {
    const activeProviders = PROVIDER_ORDER.filter((p) => enabledProviders[p]);
    if (activeProviders.length > 0) {
      startGeneration(newPrompt, activeProviders, providerToModel);
    }
    setShowProviders(false);
  };

  useEffect(() => {
    if (errors.length > 0) {
      errors.forEach((error) => {
        toast({
          title: "Image Generation Error",
          description: `Provider: ${error.provider} - ${error.message}`,
          variant: "destructive",
        });
      });
    }
  }, [errors]);

  useEffect(() => {
    images.forEach((image) => {
      if (image.image) {
        toast({
          title: "Image Generated Successfully",
          description: `Provider: ${image.provider} - Model: ${image.modelId}`,
          variant: "default",
        });
      }
    });
  }, [images]);

  return (
    <div className="min-h-screen bg-background py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Header />
        <PromptInput
          onSubmit={handlePromptSubmit}
          isLoading={isLoading}
          showProviders={showProviders}
          onToggleProviders={toggleView}
          mode={mode}
          onModeChange={handleModeChange}
          suggestions={suggestions}
        />
        <>
          {(() => {
            const getModelProps = () =>
              (Object.keys(PROVIDERS) as ProviderKey[]).map((key) => {
                const provider = PROVIDERS[key];
                const imageItem = images.find((img) => img.provider === key);
                const imageData = imageItem?.image;
                const modelId = imageItem?.modelId ?? "N/A";
                const timing = timings[key];

                return {
                  label: provider.displayName,
                  models: provider.models,
                  value: selectedModels[key],
                  providerKey: key,
                  onChange: (model: string, providerKey: ProviderKey) =>
                    handleModelChange(providerKey, model),
                  iconPath: provider.iconPath,
                  color: provider.color,
                  enabled: enabledProviders[key],
                  onToggle: (enabled: boolean) =>
                    handleProviderToggle(key, enabled),
                  image: imageData,
                  modelId,
                  timing,
                  failed: failedProviders.includes(key),
                };
              });

            return (
              <>
                <div className="md:hidden">
                  <ModelCardCarousel models={getModelProps()} />
                </div>
                <div className="hidden md:grid md:grid-cols-2 2xl:grid-cols-4 gap-8">
                  {getModelProps().map((props) => (
                    <ModelSelect key={props.label} {...props} />
                  ))}
                </div>
                {activePrompt && activePrompt.length > 0 && (
                  <div className="text-center mt-4 text-muted-foreground">
                    {activePrompt}
                  </div>
                )}
              </>
            );
          })()}
        </>
      </div>
    </div>
  );
}
