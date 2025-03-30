const { getDefaultConfig } = require("expo/metro-config");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

// Configuración adicional
defaultConfig.transformer.babelTransformerPath = require.resolve("react-native-svg-transformer");
defaultConfig.resolver.assetExts = defaultConfig.resolver.assetExts.filter(ext => ext !== "svg");
defaultConfig.resolver.sourceExts.push("svg");

// Envolver la configuración con Reanimated
module.exports = wrapWithReanimatedMetroConfig(defaultConfig);
