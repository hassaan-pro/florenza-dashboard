import JSZip from "jszip";
import { NextResponse } from "next/server";

import { renderSiteHtml } from "@/lib/export-html";
import type { Block } from "@/lib/website-data";

type NetlifySite = {
  id: string;
  url: string;
  ssl_url?: string;
  admin_url: string;
  name: string;
};

/**
 * Deploys to Netlify using the "zip deploy" API — the same mechanism
 * behind Netlify's own drag-and-drop deploy and its "Deploy to Netlify"
 * buttons. The token is the person's own Netlify personal access token,
 * sent directly to Netlify's API from this server and never logged or
 * persisted anywhere in this app.
 *
 * - No `siteId` provided -> POST /sites, creates a brand new site and
 *   deploys the zip in one call. Returns the new site's id so the caller
 *   can redeploy to the same site next time.
 * - `siteId` provided -> POST /sites/{id}/deploys, redeploys the same
 *   site (keeps the same URL).
 */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const blocks = body?.blocks as Block[] | undefined;
  const token = typeof body?.token === "string" ? body.token.trim() : "";
  const siteId = typeof body?.siteId === "string" ? body.siteId.trim() : "";

  if (!blocks || !Array.isArray(blocks)) {
    return NextResponse.json({ error: "Missing or invalid blocks." }, { status: 400 });
  }
  if (!token) {
    return NextResponse.json({ error: "Missing Netlify personal access token." }, { status: 400 });
  }

  const html = renderSiteHtml(blocks);

  const zip = new JSZip();
  zip.file("index.html", html);
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  const endpoint = siteId
    ? `https://api.netlify.com/api/v1/sites/${siteId}/deploys`
    : "https://api.netlify.com/api/v1/sites";

  const res = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/zip",
    },
    body: new Uint8Array(zipBuffer),
  });

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    const message =
      res.status === 401
        ? "Netlify rejected that token. Generate a fresh personal access token and try again."
        : data?.message ?? `Netlify responded with ${res.status}.`;
    return NextResponse.json({ error: message }, { status: res.status });
  }

  const site: NetlifySite = siteId ? { ...data, id: siteId } : data;

  return NextResponse.json({
    url: site.ssl_url ?? site.url,
    adminUrl: site.admin_url,
    siteId: site.id,
  });
}
