// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add support for @/ path alias
config.resolver = {
  ...config.resolver,
  extraNodeModules: {
    '@': path.resolve(__dirname),
  },
};

module.exports = config;
