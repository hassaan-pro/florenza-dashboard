import { NextResponse } from "next/server";

import { renderSiteHtml } from "@/lib/export-html";
import type { Block } from "@/lib/website-data";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const blocks = body?.blocks as Block[] | undefined;

  if (!blocks || !Array.isArray(blocks)) {
    return NextResponse.json({ error: "Missing or invalid blocks." }, { status: 400 });
  }

  const html = renderSiteHtml(blocks);

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Content-Disposition": 'attachment; filename="index.html"',
    },
  });
}
