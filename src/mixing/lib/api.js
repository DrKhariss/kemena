const API_BASE = `${String(import.meta.env.VITE_API_BASE || "").replace(/\/+$/, "")}/mixing/api`;

async function request(path, { method = "GET", body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    credentials: "include",
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.error || "Something went wrong.");
  }
  return data;
}

export async function fetchConfig() {
  return request("/config");
}

export async function signupUser(email, fullName) {
  return request("/signup", { method: "POST", body: { email, full_name: fullName } });
}

export async function acceptTerms(email) {
  return request("/terms", { method: "POST", body: { email } });
}

export async function login(email, password) {
  return request("/auth/login", { method: "POST", body: { email, password } });
}

export async function logout() {
  return request("/auth/logout", { method: "POST" });
}

export async function setupPassword(email, password, reference) {
  return request("/auth/setup-password", {
    method: "POST",
    body: { email, password, reference },
  });
}

export async function fetchMe() {
  return request("/auth/me");
}

export async function initiatePayment(planId, session) {
  return request("/initiate-payment", {
    method: "POST",
    body: { plan_id: planId, email: session.email, full_name: session.fullName },
  });
}

export async function verifyPayment(reference) {
  return request("/verify-payment", { method: "POST", body: { reference } });
}

export async function fetchReceipt(reference) {
  return request(`/receipt?reference=${encodeURIComponent(reference)}`);
}

export async function createMixRequest(payload) {
  return request("/mix-requests", {
    method: "POST",
    body: {
      title: payload.title,
      artist_name: payload.artistName,
      genre: payload.genre,
      bpm: payload.bpm,
      musical_key: payload.musicalKey,
      stem_link: payload.stemLink,
      reference_links: payload.referenceLinks,
      notes: payload.notes,
    },
  });
}

export async function updateMixRequest(id, payload) {
  return request(`/mix-requests/${id}`, {
    method: "PATCH",
    body: {
      title: payload.title,
      artist_name: payload.artistName,
      genre: payload.genre,
      bpm: payload.bpm,
      musical_key: payload.musicalKey,
      stem_link: payload.stemLink,
      reference_links: payload.referenceLinks,
      notes: payload.notes,
    },
  });
}

export async function fetchAdminStats() {
  return request("/admin/stats");
}

export async function fetchAdminSubscribers() {
  return request("/admin/subscribers");
}

export async function fetchAdminSubscriptions() {
  return request("/admin/subscriptions");
}

export async function fetchAdminMixRequests() {
  return request("/admin/mix-requests");
}

export async function updateAdminSubscription(id, payload) {
  return request(`/admin/subscriptions/${id}`, { method: "PATCH", body: payload });
}

export async function updateAdminMixRequest(id, status, adminNotes) {
  return request(`/admin/mix-requests/${id}`, {
    method: "PATCH",
    body: { status, admin_notes: adminNotes },
  });
}

export function openPaystack({ publicKey, email, amountKobo, reference, planId, planName, fullName, onSuccess, onClose }) {
  if (typeof PaystackPop === "undefined") {
    throw new Error("Paystack failed to load. Check your connection.");
  }

  const handler = PaystackPop.setup({
    key: publicKey,
    email,
    amount: amountKobo,
    ref: reference,
    currency: "NGN",
    metadata: {
      plan_id: planId,
      plan: planName,
      full_name: fullName,
      custom_fields: [
        { display_name: "Plan", variable_name: "plan", value: planName },
        { display_name: "Name", variable_name: "full_name", value: fullName },
      ],
    },
    callback: (response) => onSuccess(response.reference),
    onClose,
  });

  handler.openIframe();
}
