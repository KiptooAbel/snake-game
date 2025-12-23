// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add custom resolver for @/ path alias
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Handle @/ imports by replacing with the project root path
  if (moduleName.startsWith('@/')) {
    const modulePath = path.join(__dirname, moduleName.slice(2));
    return context.resolveRequest(context, modulePath, platform);
  }
  // Use default resolution for everything else
  return context.resolveRequest(context, moduleName, platform);
};

module.exports = config;
