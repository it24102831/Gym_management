import Constants from "expo-constants";

const getDevHost = () => {
  if (typeof window !== "undefined" && window.location?.hostname) {
    return window.location.hostname;
  }

  const hostUri =
    Constants.expoConfig?.hostUri ||
    Constants.manifest2?.extra?.expoClient?.hostUri ||
    Constants.manifest?.debuggerHost;

  return hostUri ? hostUri.split(":")[0] : "localhost";
};

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || `http://${getDevHost()}:5050`;
