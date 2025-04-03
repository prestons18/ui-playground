export interface ComponentState {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  backgroundColor: string;
  borderRadius: number;
  opacity: number;
  locked: boolean;
  hidden: boolean;
  border: {
    width: number;
    color: string;
    style: "solid" | "dashed" | "dotted";
  };
  shadow: {
    color: string;
    blur: number;
    spread: number;
    x: number;
    y: number;
  };
  componentType?: string;
  componentProps?: Record<string, any>;
}

// TODO: Expect more properties
