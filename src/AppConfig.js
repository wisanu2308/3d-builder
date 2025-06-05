const envConfig = import.meta.env;

export const AppConfig = {
    appName: envConfig.VITE_APP_NAME || "3D Builder",
    appDescription: envConfig.VITE_APP_DESCRIPTION || "A simple 3D model viewer and builder.",
    appVersion: envConfig.VITE_APP_VERSION || "1.0.0",
    apiBaseUrl: envConfig.VITE_API_BASE_URL || "https://api.example.com",
    devMode: envConfig.VITE_DEV_MODE === "development",
}