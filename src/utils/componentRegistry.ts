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
    console.log("Initializing ComponentRegistry");
    this.libraries = libraries;
    console.log("Libraries loaded:", JSON.stringify(this.libraries, null, 2));
  }

  static getInstance(): ComponentRegistry {
    if (!ComponentRegistry.instance) {
      console.log("Creating new ComponentRegistry instance");
      ComponentRegistry.instance = new ComponentRegistry();
    }
    return ComponentRegistry.instance;
  }

  registerComponent(id: string, component: ComponentType): void {
    console.log(`Registering component with id: ${id}`, component);
    this.components.set(id, component);
    console.log(
      "Current registered components:",
      Array.from(this.components.keys())
    );
  }

  registerProvider(id: string, provider: ComponentType): void {
    console.log(`Registering provider '${id}'`);
    try {
      this.providers.set(id, provider);
      console.log(`Provider '${id}' registered successfully`);
      console.log("Current providers:", this.providers);
    } catch (error) {
      console.error(`Error registering provider '${id}':`, error);
    }
  }

  getComponent(id: string): ComponentType | undefined {
    console.log(`Getting component with id: ${id}`);
    const component = this.components.get(id);
    console.log("Retrieved component:", component);
    return component;
  }

  getProvider(id: string): ComponentType | undefined {
    console.log(`Getting provider '${id}'`);
    const provider = this.providers.get(id);
    if (provider) {
      console.log(`Provider '${id}' found`);
    } else {
      console.log(`Provider '${id}' not found`);
    }
    return provider;
  }

  getAllComponents(): ComponentDefinition[] {
    console.log("Getting all component definitions");
    const allComponents: ComponentDefinition[] = [];

    Object.values(this.libraries.libraries).forEach((library) => {
      console.log("Processing library:", library.name);
      library.components.forEach((component) => {
        console.log("Adding component definition:", component);
        allComponents.push(component);
      });
    });

    console.log("All component definitions:", allComponents);
    return allComponents;
  }

  getAllProviders(): ProviderDefinition[] {
    console.log("Getting all provider definitions");
    try {
      const providers = Object.entries(this.libraries.providers).map(
        ([id, provider]) => ({
          id,
          ...provider,
        })
      );
      console.log("Provider definitions:", providers);
      return providers;
    } catch (error) {
      console.error("Error getting provider definitions:", error);
      return [];
    }
  }

  getComponentsByCategory(category: string): ComponentDefinition[] {
    console.log(`Getting components by category '${category}'`);
    try {
      const components = this.getAllComponents().filter(
        (comp) => comp.category === category
      );
      console.log(
        `Found ${components.length} components in category '${category}'`
      );
      return components;
    } catch (error) {
      console.error(
        `Error getting components for category '${category}':`,
        error
      );
      return [];
    }
  }

  getComponentsByTag(tag: string): ComponentDefinition[] {
    console.log(`Getting components by tag '${tag}'`);
    try {
      const components = this.getAllComponents().filter((comp) =>
        comp.tags.includes(tag)
      );
      console.log(`Found ${components.length} components with tag '${tag}'`);
      return components;
    } catch (error) {
      console.error(`Error getting components for tag '${tag}':`, error);
      return [];
    }
  }
}

export const componentRegistry = ComponentRegistry.getInstance();
