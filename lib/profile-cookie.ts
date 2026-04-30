export const PROFILE_COOKIE = "cd_profile";

export function setProfileCookie(profileId: string) {
  const oneYear = 60 * 60 * 24 * 365;
  document.cookie = `${PROFILE_COOKIE}=${profileId}; path=/; max-age=${oneYear}; samesite=lax`;
}

export function clearProfileCookie() {
  document.cookie = `${PROFILE_COOKIE}=; path=/; max-age=0; samesite=lax`;
}

export const PROFILE_COLORS = [
  { name: "Slate", value: "#0f172a" },
  { name: "Red", value: "#dc2626" },
  { name: "Orange", value: "#ea580c" },
  { name: "Amber", value: "#d97706" },
  { name: "Emerald", value: "#059669" },
  { name: "Teal", value: "#0d9488" },
  { name: "Blue", value: "#2563eb" },
  { name: "Indigo", value: "#4f46e5" },
  { name: "Purple", value: "#9333ea" },
  { name: "Pink", value: "#db2777" },
];

export const PROFILE_ICONS = [
  "🏠",
  "🏡",
  "🏘️",
  "🏗️",
  "🏚️",
  "🏛️",
  "🏢",
  "🛖",
  "🌳",
  "👨",
  "👩",
  "👴",
  "👵",
  "👶",
  "🪔",
  "💼",
];
