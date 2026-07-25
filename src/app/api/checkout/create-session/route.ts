import { NextResponse } from "next/server";

type CartLine = {
  name: string;
  unitAmountMajor: number; // price in the currency's major unit, e.g. rupees not paisa
  quantity: number;
};

function buildStripeBody(
  items: CartLine[],
  currency: string,
  successUrl: string,
  cancelUrl: string
): URLSearchParams {
  const params = new URLSearchParams();
  items.forEach((item, i) => {
    params.set(`line_items[${i}][price_data][currency]`, currency.toLowerCase());
    params.set(`line_items[${i}][price_data][product_data][name]`, item.name);
    params.set(
      `line_items[${i}][price_data][unit_amount]`,
      String(Math.round(item.unitAmountMajor * 100))
    );
    params.set(`line_items[${i}][quantity]`, String(item.quantity));
  });
  params.set("mode", "payment");
  params.set("success_url", successUrl);
  params.set("cancel_url", cancelUrl);
  return params;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const items = body?.items as CartLine[] | undefined;
  const secretKey = typeof body?.secretKey === "string" ? body.secretKey.trim() : "";
  const currency = typeof body?.currency === "string" ? body.currency : "pkr";
  const origin = request.headers.get("origin") ?? new URL(request.url).origin;

  if (!items || items.length === 0) {
    return NextResponse.json({ error: "Cart is empty." }, { status: 400 });
  }
  if (!secretKey.startsWith("sk_")) {
    return NextResponse.json(
      { error: "That doesn't look like a Stripe secret key (should start with sk_test_ or sk_live_)." },
      { status: 400 }
    );
  }

  const params = buildStripeBody(
    items,
    currency,
    `${origin}/website-builder?checkout=success`,
    `${origin}/website-builder?checkout=cancel`
  );

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json(
      { error: data?.error?.message ?? "Stripe rejected this request." },
      { status: res.status }
    );
  }

  return NextResponse.json({ url: data.url });
}
