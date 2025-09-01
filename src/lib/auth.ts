import GoTrue from "@netlify/gotrue-js";

// NOTE: Auto-detects the deployed origin; works locally on Netlify dev too.
export const auth = new GoTrue({ APIUrl: `${window.location.origin}/.netlify/identity`, setCookie: true });

export async function identityEnabled(): Promise<boolean> {
  try {
    const res = await fetch("/.netlify/identity/settings", { cache: "no-store" });
    return res.ok;
  } catch {
    return false;
  }
}