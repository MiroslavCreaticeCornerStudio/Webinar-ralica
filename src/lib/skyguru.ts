// Skyguru CRM lead ingestion.
// Public endpoint (no auth) — only `phone` is required; all other fields are
// accepted and optional. Best-effort: a failure here must NEVER block the
// Brevo/Zoom registration or the user's success response.

const SKYGURU_LEADS_URL = "https://skyguru.ai/api/v1/public/leads";

export interface SkyguruLead {
  name: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phone: string;
  consent?: boolean;
  /** Unique Zoom join link for this registrant, if Zoom registration succeeded. */
  webinarJoinUrl?: string;
  /** Raw ad-attribution / tracking object captured client-side (fbclid, utm_*, …). */
  attribution?: Record<string, unknown>;
}

const trim = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() ? v.trim() : undefined;

/**
 * Forward a webinar lead to Skyguru. Returns true on success, false on any
 * failure (never throws). Sends a flat payload — Laravel reads individual
 * inputs, so top-level keys give the best chance of being captured.
 */
export async function sendSkyguruLead(lead: SkyguruLead): Promise<boolean> {
  const attr = lead.attribution ?? {};

  const payload: Record<string, unknown> = {
    name: lead.name,
    first_name: lead.firstName,
    last_name: lead.lastName,
    email: lead.email,
    phone: lead.phone,
    consent: lead.consent,
    form_name: "Уебинар – Сделки за милиони в настоящия пазар",
    source: "home2u-webinar-ralica",
    webinar: "Сделки за милиони",
    webinar_join_url: lead.webinarJoinUrl,
    // ad attribution / tracking
    fbclid: trim(attr.fbclid),
    fbc: trim(attr.fbc),
    fbp: trim(attr.fbp),
    utm_source: trim(attr.utm_source),
    utm_medium: trim(attr.utm_medium),
    utm_campaign: trim(attr.utm_campaign),
    utm_term: trim(attr.utm_term),
    utm_content: trim(attr.utm_content),
    landing_page: trim(attr.landing_page),
    captured_at: trim(attr.captured_at),
  };

  // Drop empty values so we don't send a wall of nulls.
  for (const key of Object.keys(payload)) {
    const value = payload[key];
    if (value === undefined || value === null || value === "") delete payload[key];
  }

  try {
    const res = await fetch(SKYGURU_LEADS_URL, {
      method: "POST",
      headers: { "content-type": "application/json", accept: "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      console.error("Skyguru lead failed", res.status, await res.text().catch(() => ""));
      return false;
    }
    return true;
  } catch (err) {
    console.error("Skyguru lead threw", err);
    return false;
  }
}
