// Zoom Server-to-Server OAuth + webinar registration.
// All credentials come from the runtime env (never hard-coded / committed).

export interface ZoomEnv {
  ZOOM_ACCOUNT_ID?: string;
  ZOOM_CLIENT_ID?: string;
  ZOOM_CLIENT_SECRET?: string;
  ZOOM_WEBINAR_ID?: string;
}

export interface ZoomRegistration {
  joinUrl: string;
  registrantId: string;
}

async function getAccessToken(env: ZoomEnv): Promise<string | null> {
  // trim() guards against secrets pasted with a stray space/newline
  const ZOOM_ACCOUNT_ID = env.ZOOM_ACCOUNT_ID?.trim();
  const ZOOM_CLIENT_ID = env.ZOOM_CLIENT_ID?.trim();
  const ZOOM_CLIENT_SECRET = env.ZOOM_CLIENT_SECRET?.trim();
  if (!ZOOM_ACCOUNT_ID || !ZOOM_CLIENT_ID || !ZOOM_CLIENT_SECRET) return null;

  const basic = btoa(`${ZOOM_CLIENT_ID}:${ZOOM_CLIENT_SECRET}`);
  const res = await fetch(
    `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${encodeURIComponent(ZOOM_ACCOUNT_ID)}`,
    { method: "POST", headers: { Authorization: `Basic ${basic}` } },
  );
  if (!res.ok) {
    console.error("Zoom token error", res.status, await res.text().catch(() => ""));
    return null;
  }
  const data = (await res.json()) as { access_token?: string };
  return data.access_token ?? null;
}

/**
 * Register a person for the configured webinar.
 * Returns the registrant's unique join URL, or null on any failure (never throws).
 */
export async function registerForWebinar(
  env: ZoomEnv,
  registrant: { email: string; firstName: string; lastName: string },
): Promise<ZoomRegistration | null> {
  // Strip all spaces — Zoom shows the ID as "813 3919 0579" but the API needs "81339190579".
  const webinarId = env.ZOOM_WEBINAR_ID?.replace(/\s+/g, "");
  if (!webinarId) return null;

  try {
    const token = await getAccessToken(env);
    if (!token) return null;

    const res = await fetch(
      `https://api.zoom.us/v2/webinars/${encodeURIComponent(webinarId)}/registrants`,
      {
        method: "POST",
        headers: { Authorization: `Bearer ${token}`, "content-type": "application/json" },
        body: JSON.stringify({
          email: registrant.email,
          first_name: registrant.firstName,
          last_name: registrant.lastName || undefined,
        }),
      },
    );

    if (!res.ok) {
      console.error("Zoom register failed", res.status, await res.text().catch(() => ""));
      return null;
    }

    const data = (await res.json()) as { join_url?: string; registrant_id?: string };
    return { joinUrl: data.join_url ?? "", registrantId: data.registrant_id ?? "" };
  } catch (err) {
    console.error("Zoom register threw", err);
    return null;
  }
}
