import type { APIRoute } from "astro";
// Astro v6 on Cloudflare: runtime env/secrets come from `cloudflare:workers`.
// In dev the adapter populates this from `.env`; in production from Worker secrets.
import { env } from "cloudflare:workers";

// Server-rendered (not pre-rendered) so it runs on each request.
export const prerender = false;

const BREVO_CONTACTS_URL = "https://api.brevo.com/v3/contacts";

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export const POST: APIRoute = async ({ request }) => {
  const cfEnv = env as unknown as Record<string, string | undefined>;
  const apiKey = cfEnv.BREVO_API_KEY;
  const listId = Number(cfEnv.BREVO_LIST_ID ?? 4);

  if (!apiKey) {
    console.error("BREVO_API_KEY is not set");
    return json({ ok: false, error: "Регистрацията е временно недостъпна." }, 500);
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ ok: false, error: "Невалидна заявка." }, 400);
  }

  const name = String(body.name ?? "").trim();
  const phone = String(body.phone ?? "").trim();
  const email = String(body.email ?? "").trim().toLowerCase();
  const consent = Boolean(body.consent);

  if (!name || !phone || !isEmail(email) || !consent) {
    return json({ ok: false, error: "Моля, попълни всички задължителни полета." }, 422);
  }

  // Brevo attributes, incl. ad attribution (fbclid / UTMs) for offline conversion tracking
  const attributes: Record<string, string> = { FIRSTNAME: name, TELEFON: phone };
  const attribution = (body.attribution ?? {}) as Record<string, unknown>;
  const ATTR_MAP: Record<string, string> = {
    fbclid: "FBCLID",
    fbc: "FBC",
    fbp: "FBP",
    utm_source: "UTM_SOURCE",
    utm_medium: "UTM_MEDIUM",
    utm_campaign: "UTM_CAMPAIGN",
    utm_term: "UTM_TERM",
    utm_content: "UTM_CONTENT",
    landing_page: "LANDING_PAGE",
    captured_at: "AD_TIMESTAMP",
  };
  for (const [src, dest] of Object.entries(ATTR_MAP)) {
    const value = attribution[src];
    if (typeof value === "string" && value.trim()) {
      attributes[dest] = value.trim().slice(0, 255);
    }
  }

  try {
    const res = await fetch(BREVO_CONTACTS_URL, {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "content-type": "application/json",
        accept: "application/json",
      },
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true, // re-registration updates the contact instead of erroring
      }),
    });

    // 201 created, 204 updated → success
    if (res.ok) return json({ ok: true });

    const errBody = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    // Already-existing contacts are fine (updateEnabled handles them)
    if (errBody.code === "duplicate_parameter") return json({ ok: true });

    console.error("Brevo error", res.status, errBody);
    return json({ ok: false, error: "Възникна грешка. Моля, опитай отново." }, 502);
  } catch (err) {
    console.error("Brevo request failed", err);
    return json({ ok: false, error: "Възникна грешка при свързване. Опитай отново." }, 502);
  }
};
