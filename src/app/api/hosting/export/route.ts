import JSZip from "jszip";
import { NextResponse } from "next/server";

import { renderSiteFiles } from "@/lib/export-html";
import type { Site } from "@/lib/website-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const site = body?.site as Site | undefined;

  if (!site || !Array.isArray(site.home)) {
    return NextResponse.json({ error: "Missing or invalid site." }, { status: 400 });
  }

  const files = renderSiteFiles(site);
  const zip = new JSZip();
  for (const [name, content] of Object.entries(files)) {
    zip.file(name, content);
  }
  const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

  return new NextResponse(new Uint8Array(zipBuffer), {
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": 'attachment; filename="florenza-site.zip"',
    },
  });
}
