"use client";

import { CreditCard, Info } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

const currencies = ["PKR", "USD", "AED", "GBP"];

export function PaymentsDialog({
  stripeKey,
  onStripeKeyChange,
  currency,
  onCurrencyChange,
}: {
  stripeKey: string;
  onStripeKeyChange: (key: string) => void;
  currency: string;
  onCurrencyChange: (currency: string) => void;
}) {
  const mode = stripeKey.startsWith("sk_live_") ? "live" : stripeKey.startsWith("sk_test_") ? "test" : null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <CreditCard className="size-4" />
          Payments
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Payments</DialogTitle>
          <DialogDescription>
            Connect Stripe so the cart&apos;s checkout button creates a real Stripe Checkout
            session, real hosted payment page, real card processing. Stripe handles all card
            data, this dashboard never sees or stores it.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="stripe-key">Stripe secret key</Label>
            <Input
              id="stripe-key"
              type="password"
              placeholder="sk_test_… or sk_live_…"
              value={stripeKey}
              onChange={(e) => onStripeKeyChange(e.target.value)}
            />
            <p className="text-[11px] text-muted-foreground/70">
              From your Stripe dashboard → Developers → API keys. Use a{" "}
              <span className="text-foreground">test</span> key (sk_test_…) to try the full
              checkout flow with Stripe&apos;s test card, no real charge happens.
            </p>
            {mode && (
              <Badge variant={mode === "live" ? "destructive" : "secondary"} className="w-fit mt-1">
                {mode === "live" ? "Live mode — real charges" : "Test mode — no real charges"}
              </Badge>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="currency">Currency</Label>
            <Select id="currency" value={currency} onChange={(e) => onCurrencyChange(e.target.value)}>
              {currencies.map((c) => (
                <option key={c} value={c} className="bg-card">
                  {c}
                </option>
              ))}
            </Select>
            <p className="text-[11px] text-muted-foreground/70">
              Prices in the catalogue are stored in PKR. Switching this does{" "}
              <span className="text-foreground">not</span> convert the numbers, Stripe charges
              the same figure in whatever currency you pick here. Only switch this if you&apos;re
              deliberately re-pricing for a different market, or if your Stripe account can&apos;t
              settle in PKR and you need a different currency to make checkout work at all.
            </p>
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-primary/25 bg-primary/5 px-3.5 py-3 text-xs text-foreground/85">
            <Info className="size-3.5 shrink-0 mt-0.5 text-primary" strokeWidth={1.75} />
            <div className="space-y-1.5">
              <p>
                This key is only used right here, in this browser session, to test checkout in
                the live preview below. It&apos;s never written to disk or sent anywhere except
                Stripe&apos;s API.
              </p>
              <p>
                For the <span className="text-foreground">deployed</span> site (via the Hosting
                dialog), checkout runs through a Netlify Function, not this dashboard. That
                function reads its own key from a <code className="text-[11px]">STRIPE_SECRET_KEY</code>{" "}
                environment variable you set in Netlify&apos;s site settings after deploying, it
                does not reuse the key you enter here. Keeping it there, not baked into the
                deployed code, is the whole point, secrets shouldn&apos;t travel through more
                systems than necessary.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
