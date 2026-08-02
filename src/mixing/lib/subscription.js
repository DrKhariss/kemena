export const PLANS = {
  platinum: {
    id: "platinum",
    name: "Platinum",
    priceNgn: 2_000_000,
    tracks: "Unlimited",
    duration: "4 months",
    features: ["Dolby Atmos included", "Best for labels with multiple artistes"],
    badge: "Label tier",
  },
  gold: {
    id: "gold",
    name: "Gold",
    priceNgn: 500_000,
    tracks: 8,
    duration: "6 months",
    features: ["Stereo mixing & mastering"],
    badge: null,
  },
  silver: {
    id: "silver",
    name: "Silver",
    priceNgn: 300_000,
    tracks: 6,
    duration: "3 months",
    features: ["Stereo mixing & mastering"],
    badge: null,
  },
  monthly: {
    id: "monthly",
    name: "Monthly",
    priceNgn: 100_000,
    tracks: "3 per month",
    duration: "1 month",
    features: ["Most commonly used", "Flexible entry point"],
    badge: "Popular",
  },
};

export const TERMS_PARAGRAPHS = [
  "I ….. of sound health and mind without coercion chose to enter into an agreement with mid-side ent. Paying for stereo mixing and mastering services, trusting them as professional engineers and giving them permission to shape my audio having it radio and streaming ready.",
  "I own/have rights to all audio recordings sent in for mixing.",
  "I will pay for this service by one of the options available in the mid-side subscription service.",
  "No publishing or master rights are being offered unless outright stated in an external document.",
  "I submit to a maximum of two revisions per mix, and accept that any more after that is not a requirement but can be expected in good faith.",
  "All stems for mixing must be sent from the original mail used to sign up to avoid confusion.",
  "Stems must be sent to only the mail provided, none other. To avoid confusion.",
];

export const SESSION_KEY = "midside_mixing_session";

export function loadSession() {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveSession(data) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
}

export function formatNgn(amount) {
  return `₦${amount.toLocaleString("en-NG")}`;
}
