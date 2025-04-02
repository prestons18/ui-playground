import { useState, useEffect } from "react";

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

const STORAGE_KEY = "storybook-metadata";

export function useLocalStorage() {
  const [data, setData] = useState<Record<string, StorybookMetadata>>({});

  // Load data from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setData(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored data:", e);
      }
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const saveMetadata = (url: string, metadata: StorybookMetadata) => {
    setData((prev) => ({
      ...prev,
      [url]: metadata,
    }));
  };

  const getMetadata = (url: string) => {
    return data[url];
  };

  const clearData = () => {
    localStorage.removeItem(STORAGE_KEY);
    setData({});
  };

  return {
    data,
    saveMetadata,
    getMetadata,
    clearData,
  };
}
