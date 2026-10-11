export const PLANS = {
  platinum: {
    id: "platinum",
    name: "Platinum",
    priceNgn: 2_000_000,
    tracks: "Unlimited",
    stereoTracks: null,
    atmosTracks: null,
    duration: "3 months",
    features: ["Unlimited stereo mixes", "Dolby Atmos included", "Best for labels with multiple artistes"],
    badge: "Label tier",
    highlight: false,
  },
  gold: {
    id: "gold",
    name: "Gold",
    priceNgn: 500_000,
    tracks: "8 stereo · 3 Atmos",
    stereoTracks: 8,
    atmosTracks: 3,
    duration: "6 months",
    features: ["8 stereo tracks", "3 Dolby Atmos tracks"],
    badge: null,
    highlight: true,
  },
  silver: {
    id: "silver",
    name: "Silver",
    priceNgn: 300_000,
    tracks: "6 stereo",
    stereoTracks: 6,
    atmosTracks: 0,
    duration: "3 months",
    features: ["6 stereo tracks", "No Dolby Atmos on this plan"],
    badge: null,
    highlight: false,
  },
  basic: {
    id: "basic",
    name: "Basic",
    priceNgn: 100_000,
    tracks: "3 stereo / month",
    stereoTracks: 3,
    atmosTracks: 0,
    duration: "1 month",
    features: ["Three stereo mixes per month", "Flexible entry point"],
    badge: "Popular",
    highlight: false,
  },
};

/** Resolve plan; maps legacy `monthly` id → Basic. */
export function getPlan(planId) {
  if (!planId) return null;
  if (planId === "monthly") return PLANS.basic;
  return PLANS[planId] || null;
}

export const TERMS_PARAGRAPHS = [
  "I ….. of sound health and mind without coercion chose to enter into an agreement with mid-side audio. Paying for stereo mixing and mastering services, trusting them as professional engineers and giving them permission to shape my audio having it radio and streaming ready.",
  "I own/have rights to all audio recordings sent in for mixing.",
  "I will pay for this service by one of the options available in the mid-side audio subscription service.",
  "No publishing or master rights are being offered unless outright stated in an external document.",
  "I submit to a maximum of two revisions per mix, and accept that any more after that is not a requirement but can be expected in good faith.",
  "I will submit stems by pasting a Drive, Dropbox, or WeTransfer link in my Mid-Side Audio account dashboard after subscribing.",
  "The email used to sign up is my account identity for login and support; mix jobs are logged in-app via stem links, not by emailing stems separately.",
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
