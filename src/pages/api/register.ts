import type { APIRoute } from "astro";
// Runtime secrets via Astro's adapter-agnostic `getSecret` (astro:env/server):
// reads from `.env` in dev and from the platform's runtime env (Vercel env vars)
// in production — without baking secrets into the build bundle.
import { getSecret } from "astro:env/server";
import { registerForWebinar } from "../../lib/zoom";

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
  const apiKey = getSecret("BREVO_API_KEY")?.trim();
  const listId = Number(getSecret("BREVO_LIST_ID") ?? 4);

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

  // Register in the Zoom webinar (best-effort — a failure must not block the lead
  // capture). Store the registrant's unique join link on the Brevo contact.
  const nameParts = name.split(/\s+/).filter(Boolean);
  const zoom = await registerForWebinar({
    email,
    firstName: nameParts[0] ?? name,
    lastName: nameParts.slice(1).join(" "),
  });
  if (zoom?.joinUrl) attributes.WEBINARURL = zoom.joinUrl;

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
    if (res.ok) return json({ ok: true, joinUrl: zoom?.joinUrl ?? "" });

    const errBody = (await res.json().catch(() => ({}))) as Record<string, unknown>;
    // Already-existing contacts are fine (updateEnabled handles them)
    if (errBody.code === "duplicate_parameter") return json({ ok: true, joinUrl: zoom?.joinUrl ?? "" });

    console.error("Brevo error", res.status, errBody);
    return json({ ok: false, error: "Възникна грешка. Моля, опитай отново." }, 502);
  } catch (err) {
    console.error("Brevo request failed", err);
    return json({ ok: false, error: "Възникна грешка при свързване. Опитай отново." }, 502);
  }
};
