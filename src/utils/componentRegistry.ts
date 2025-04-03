import { ComponentType } from "react";
import libraries from "../../config/libraries.json";

type ComponentProps = {
  [key: string]: unknown;
};

export interface ComponentDefinition {
  id: string;
  name: string;
  category: string;
  description: string;
  tags: string[];
  props: ComponentProps;
}

export interface ProviderDefinition {
  id: string;
  name: string;
  description: string;
  config: Record<string, any>;
}

export interface Library {
  name: string;
  version: string;
  components: ComponentDefinition[];
}

class ComponentRegistry {
  private static instance: ComponentRegistry;
  private components: Map<string, ComponentType> = new Map();
  private providers: Map<string, ComponentType> = new Map();
  private libraries: typeof libraries;

  private constructor() {
    this.libraries = libraries;
  }

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  registerComponent(id: string, component: ComponentType): void {
    this.components.set(id, component);
  }

  registerProvider(id: string, provider: ComponentType): void {
    this.providers.set(id, provider);
  }

  getComponent(id: string): ComponentType | undefined {
    return this.components.get(id);
  }

  getProvider(id: string): ComponentType | undefined {
    return this.providers.get(id);
  }

  getAllComponents(): ComponentDefinition[] {
    return Object.values(this.libraries.libraries).flatMap(
      (lib) => lib.components as ComponentDefinition[]
    );
  }

  getAllProviders(): ProviderDefinition[] {
    return Object.entries(this.libraries.providers).map(([id, provider]) => ({
      id,
      ...provider,
    }));
  }

  getComponentsByCategory(category: string): ComponentDefinition[] {
    return this.getAllComponents().filter((comp) => comp.category === category);
  }

  getComponentsByTag(tag: string): ComponentDefinition[] {
    return this.getAllComponents().filter((comp) => comp.tags.includes(tag));
  }
}

export const componentRegistry = ComponentRegistry.getInstance();
