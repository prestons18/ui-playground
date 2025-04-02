import { useState, useEffect } from "react";

interface StoryComponent {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
  importPath: string;
  componentPath?: string;
  tags: string[];
  parameters?: Record<string, any>;
  args?: Record<string, any>;
  argTypes?: Record<string, any>;
}

interface UseStorybookComponentResult {
  component: StoryComponent | null;
  loading: boolean;
  error: string | null;
  iframeUrl: string | null;
}

export function useStorybookComponent(
  source: string,
  storyId: string
): UseStorybookComponentResult {
  const [component, setComponent] = useState<StoryComponent | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iframeUrl, setIframeUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!source || !storyId) return;

    async function fetchComponent() {
      setLoading(true);
      setError(null);

      try {
        // First, get the component data from the index.json
        const indexUrl = `/storybook/index.json?target=${encodeURIComponent(
          source
        )}`;

        const indexResponse = await fetch(indexUrl);
        if (!indexResponse.ok) throw new Error("Failed to load Storybook data");
        const indexData = await indexResponse.json();

        // Find the component in the entries
        const storyData = Object.values(indexData.entries).find(
          (entry: any) => entry.id === storyId
        ) as StoryComponent;

        if (!storyData) {
          throw new Error("Component not found");
        }

        setComponent(storyData);

        // Construct the iframe URL using the story ID
        const iframeUrl = `/storybook/iframe.html?globals=&args=&id=${storyId}&target=${encodeURIComponent(
          source
        )}`;
        setIframeUrl(iframeUrl);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchComponent();
  }, [source, storyId]);

  return { component, loading, error, iframeUrl };
}
