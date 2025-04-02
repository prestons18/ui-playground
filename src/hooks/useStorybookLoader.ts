/**
 * useStorybookLoader - A React hook to load and manage Storybook metadata.
 *
 * This hook accepts a Storybook URL and fetches its metadata.
 * It retrieves:
 * - `stories`: A list of all stories in the Storybook instance.
 * - `globals`: Global parameters used by Storybook.
 * - `parameters`: Global and per-story parameters.
 * - `config`: Any additional configuration from Storybook.
 *
 * Returns:
 * - `metadata`: The complete Storybook metadata object.
 * - `loading`: Boolean indicating whether the data is still being fetched.
 * - `error`: Error message if fetching fails.
 */

import { useEffect, useState } from "react";
import { useLocalStorage } from "./useLocalStorage";

interface StoryMetadata {
  id: string;
  title: string;
  name: string;
  type: "story" | "docs";
  importPath: string;
  componentPath?: string;
  tags: string[];
}

interface StorybookMetadata {
  stories: StoryMetadata[];
  globals?: Record<string, any>;
  parameters?: Record<string, any>;
  config?: Record<string, any>;
}

export function useStorybookLoader(source: string) {
  const [metadata, setMetadata] = useState<StorybookMetadata | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { getMetadata, saveMetadata } = useLocalStorage();

  useEffect(() => {
    if (!source) return;
    setLoading(true);
    setError(null);

    async function fetchStories() {
      try {
        // Check localStorage first
        const cached = getMetadata(source);
        if (cached) {
          setMetadata(cached);
          setLoading(false);
          return;
        }

        // Use the proxy for local Storybook server
        const url =
          source.includes("localhost:6006") || source.includes("localhost:8080")
            ? `/storybook/index.json`
            : `${source}/index.json`;

        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to load Storybook data");
        const data = await response.json();
        const newMetadata: StorybookMetadata = {
          stories: Object.values(data.entries) as StoryMetadata[],
          globals: data.globals || {},
          parameters: data.parameters || {},
          config: data.config || {},
        };

        setMetadata(newMetadata);
        saveMetadata(source, newMetadata);
      } catch (err) {
        setError((err as Error).message);
      } finally {
        setLoading(false);
      }
    }

    fetchStories();
  }, [source, getMetadata, saveMetadata]);

  return { metadata, loading, error };
}
