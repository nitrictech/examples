export type ModelMode = "performance" | "quality";

export type ProviderKey = "openai";

export const PROVIDERS: Record<
  ProviderKey,
  {
    displayName: string;
    iconPath: string;
    color: string;
    models: string[];
  }
> = {
  openai: {
    displayName: "OpenAI",
    iconPath: "/provider-icons/openai.svg",
    color: "from-blue-500 to-cyan-500",
    models: ["dall-e-2", "dall-e-3"],
  },
};

export const MODEL_CONFIGS: Record<ModelMode, Record<ProviderKey, string>> = {
  performance: {
    openai: "dall-e-2",
  },
  quality: {
    openai: "dall-e-3",
  },
};

export const PROVIDER_ORDER: ProviderKey[] = ["openai"];

export const initializeProviderRecord = <T>(defaultValue?: T) =>
  Object.fromEntries(
    PROVIDER_ORDER.map((key) => [key, defaultValue])
  ) as Record<ProviderKey, T>;
