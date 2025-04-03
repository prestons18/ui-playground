import React from "react";
import { componentRegistry } from "../utils/componentRegistry";

const WelcomeScreen: React.FC = () => {
  const components = componentRegistry.getAllComponents();
  const providers = componentRegistry.getAllProviders();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl md:text-6xl">
            Design System
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 dark:text-gray-300 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            A comprehensive collection of reusable components and providers for
            building beautiful interfaces
          </p>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Components
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {components.map((component) => (
              <div
                key={component.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {component.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  {component.description}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {component.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-8">
            Providers
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
              >
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {provider.name}
                </h3>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-300">
                  {provider.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
