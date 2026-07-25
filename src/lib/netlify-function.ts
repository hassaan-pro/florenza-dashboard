/**
 * Netlify config + serverless function bundled into every Hosting deploy.
 *
 * Kept as plain strings (not files on disk) because the deploy route
 * builds its zip in-memory — see src/app/api/hosting/deploy/route.ts.
 *
 * The function is intentionally zero-dependency (native fetch only,
 * no `stripe` npm package) because the deploy is a raw zip upload with
 * no `npm install` build step. It calls Stripe's REST API directly,
 * the exact same approach as src/app/api/checkout/create-session/route.ts,
 * kept in sync by hand — if that route's request-building logic changes,
 * mirror the change here.
 */

export const netlifyToml = `[functions]
  directory = "netlify/functions"
`;

export const checkoutFunctionSource = `// Netlify Function: creates a real Stripe Checkout session.
// Requires a STRIPE_SECRET_KEY environment variable set in this site's
// Netlify settings (Site configuration -> Environment variables) —
// intentionally NOT bundled into this file, secrets don't belong in
// deployed source. See the Hosting dialog in the Florenza dashboard for
// where this file comes from.

exports.handler = async (event) => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: "STRIPE_SECRET_KEY isn't set on this Netlify site yet. Add it under Site configuration -> Environment variables, then redeploy.",
      }),
    };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || "{}");
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: "Invalid request body." }) };
  }

  const items = payload.items;
  if (!Array.isArray(items) || items.length === 0) {
    return { statusCode: 400, body: JSON.stringify({ error: "Cart is empty." }) };
  }

  const currency = (payload.currency || "pkr").toLowerCase();
  const proto = event.headers["x-forwarded-proto"] || "https";
  const origin = proto + "://" + event.headers.host;

  const params = new URLSearchParams();
  items.forEach((item, i) => {
    params.set("line_items[" + i + "][price_data][currency]", currency);
    params.set("line_items[" + i + "][price_data][product_data][name]", item.name);
    params.set("line_items[" + i + "][price_data][unit_amount]", String(Math.round(item.unitAmountMajor * 100)));
    params.set("line_items[" + i + "][quantity]", String(item.quantity));
  });
  params.set("mode", "payment");
  params.set("success_url", origin + "/?checkout=success");
  params.set("cancel_url", origin + "/?checkout=cancel");

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + secretKey,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
  });

  const data = await res.json();

  if (!res.ok) {
    return {
      statusCode: res.status,
      body: JSON.stringify({ error: (data.error && data.error.message) || "Stripe rejected this request." }),
    };
  }

  return { statusCode: 200, body: JSON.stringify({ url: data.url }) };
};
`;
