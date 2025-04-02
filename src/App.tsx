import { Stack, Box, Text, Input, Button } from "preston-ui";
import { useStorybookLoader } from "./hooks/useStorybookLoader";
import { useLocalStorage } from "./hooks/useLocalStorage";
import { useStorybookComponent } from "./hooks/useStorybookComponent";
import { useState, useEffect } from "react";

function App() {
  const { clearData } = useLocalStorage();
  const [source, setSource] = useState(() => {
    // Initialize source from localStorage if available
    const savedSource = localStorage.getItem("storybook_source");
    return savedSource || "";
  });
  const [selectedStoryId, setSelectedStoryId] = useState<string | null>(null);

  // Save source to localStorage whenever it changes
  useEffect(() => {
    if (source) {
      localStorage.setItem("storybook_source", source);
    } else {
      localStorage.removeItem("storybook_source");
    }
  }, [source]);

  const { metadata, loading, error } = useStorybookLoader(source);
  const {
    component,
    loading: componentLoading,
    error: componentError,
    iframeUrl,
  } = useStorybookComponent(source, selectedStoryId || "");

  // Group stories by their title (component)
  const groupedStories = metadata?.stories.reduce((acc, story) => {
    const title = story.title;
    if (!acc[title]) {
      acc[title] = [];
    }
    acc[title].push(story);
    return acc;
  }, {} as Record<string, typeof metadata.stories>);

  const handleClearCache = () => {
    clearData();
    setSource("");
    setSelectedStoryId(null);
  };

  return (
    <Box style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      <Stack style={{ gap: "1.5rem" }}>
        <Box>
          <Text
            as="h1"
            size="3xl"
            weight="black"
            style={{ marginBottom: "0.5rem" }}
          >
            Storybook Browser
          </Text>
          <Text emphasis="low" size="lg">
            Browse and explore Storybook components from any instance
          </Text>
        </Box>

        <Box
          style={{
            padding: "1.5rem",
            borderRadius: "0.5rem",
            backgroundColor: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          }}
        >
          <Stack style={{ gap: "1rem" }}>
            <Box>
              <Text
                size="sm"
                weight="medium"
                style={{ marginBottom: "0.5rem" }}
              >
                Storybook URL
              </Text>
              <Box
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  gap: "0.75rem",
                  alignItems: "end",
                }}
              >
                <Input
                  placeholder="https://your-storybook-url.com"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  style={{ width: "100%" }}
                />
                <Box style={{ display: "flex", gap: "0.5rem" }}>
                  <Button onClick={() => setSource(source)}>
                    Load Stories
                  </Button>
                  <Button variant="outline" onClick={handleClearCache}>
                    Clear Cache
                  </Button>
                </Box>
              </Box>
            </Box>

            {error && (
              <Text
                emphasis="low"
                size="sm"
                weight="medium"
                style={{ color: "red" }}
              >
                {error}
              </Text>
            )}

            {loading && (
              <Text emphasis="low" size="base" weight="medium">
                Loading stories...
              </Text>
            )}
          </Stack>
        </Box>

        {groupedStories && (
          <Box
            style={{
              display: "grid",
              gridTemplateColumns: "300px 1fr",
              gap: "1.5rem",
              height: "calc(100vh - 300px)",
            }}
          >
            {/* Story List */}
            <Box
              style={{
                overflowY: "auto",
                padding: "1rem",
                borderRadius: "0.5rem",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
              }}
            >
              <Stack style={{ gap: "1rem" }}>
                <Text size="xl" weight="bold">
                  Components ({Object.keys(groupedStories).length})
                </Text>
                {Object.entries(groupedStories).map(([title, stories]) => (
                  <Box key={title}>
                    <Text
                      size="lg"
                      weight="semibold"
                      style={{ marginBottom: "0.5rem" }}
                    >
                      {title}
                    </Text>
                    <Stack style={{ gap: "0.5rem" }}>
                      {stories.map((story) => (
                        <Box
                          key={story.id}
                          style={{
                            padding: "0.5rem",
                            borderRadius: "0.25rem",
                            backgroundColor:
                              selectedStoryId === story.id
                                ? "#e5e7eb"
                                : "#f9fafb",
                            transition: "background-color 0.2s",
                            cursor: "pointer",
                          }}
                          onClick={() => setSelectedStoryId(story.id)}
                          onMouseEnter={(e) =>
                            (e.currentTarget.style.backgroundColor = "#f3f4f6")
                          }
                          onMouseLeave={(e) =>
                            (e.currentTarget.style.backgroundColor =
                              selectedStoryId === story.id
                                ? "#e5e7eb"
                                : "#f9fafb")
                          }
                        >
                          <Stack style={{ gap: "0.25rem" }}>
                            <Text size="base" weight="medium">
                              {story.name}
                            </Text>
                            {story.type === "docs" && (
                              <Text
                                emphasis="low"
                                size="sm"
                                style={{ color: "#2563eb" }}
                              >
                                Documentation
                              </Text>
                            )}
                          </Stack>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                ))}
              </Stack>
            </Box>

            {/* Component Preview */}
            <Box
              style={{
                borderRadius: "0.5rem",
                backgroundColor: "white",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {selectedStoryId ? (
                <>
                  {componentLoading && (
                    <Box
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: "rgba(255, 255, 255, 0.9)",
                        zIndex: 1,
                      }}
                    >
                      <Text emphasis="low" size="base" weight="medium">
                        Loading component...
                      </Text>
                    </Box>
                  )}
                  {componentError && (
                    <Box
                      style={{
                        padding: "2rem",
                        textAlign: "center",
                        backgroundColor: "#fef2f2",
                      }}
                    >
                      <Text
                        emphasis="low"
                        size="base"
                        weight="medium"
                        style={{ color: "red" }}
                      >
                        {componentError}
                      </Text>
                    </Box>
                  )}
                  {iframeUrl && (
                    <iframe
                      src={iframeUrl}
                      style={{
                        width: "100%",
                        height: "100%",
                        border: "none",
                        backgroundColor: "white",
                      }}
                      title="Storybook Preview"
                    />
                  )}
                </>
              ) : (
                <Box
                  style={{
                    padding: "2rem",
                    textAlign: "center",
                    color: "#6b7280",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text size="lg">Select a component to preview</Text>
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Stack>
    </Box>
  );
}

export default App;
