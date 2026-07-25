import { promises as dns } from "node:dns";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const domain = typeof body?.domain === "string" ? body.domain.trim() : "";
  const token = typeof body?.token === "string" ? body.token.trim() : "";

  if (!domain || !token) {
    return NextResponse.json(
      { verified: false, error: "Missing domain or verification token." },
      { status: 400 }
    );
  }

  try {
    const records = await dns.resolveTxt(domain);
    const flat = records.map((chunks) => chunks.join(""));
    const verified = flat.some((r) => r.includes(token));

    return NextResponse.json({ verified, records: flat });
  } catch (err: unknown) {
    const code = (err as { code?: string } | null)?.code;
    const message =
      code === "ENOTFOUND" || code === "ENODATA"
        ? "No TXT records found for this domain yet. DNS changes can take a few minutes to a few hours to propagate."
        : "Couldn't look up this domain's DNS records.";

    return NextResponse.json({ verified: false, error: message }, { status: 200 });
  }
}
