"use client";

import { useMemo, useState } from "react";
import { Globe, ClipboardCopy, CheckCircle2, Loader2, ShieldCheck, AlertTriangle, RotateCw } from "lucide-react";

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
import { Badge } from "@/components/ui/badge";

type VerifyState = "idle" | "checking" | "verified" | "unverified" | "error";

function randomToken() {
  return `florenza-verify=${crypto.randomUUID().replace(/-/g, "").slice(0, 24)}`;
}

export function DomainDialog() {
  const [open, setOpen] = useState(false);
  const [domain, setDomain] = useState("");
  const [token, setToken] = useState(randomToken());
  const [state, setState] = useState<VerifyState>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const cleanDomain = useMemo(() => domain.trim().replace(/^https?:\/\//, "").replace(/\/$/, ""), [domain]);

  async function handleCheck() {
    if (!cleanDomain) return;
    setState("checking");
    setMessage(null);
    try {
      const res = await fetch("/api/domain/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: cleanDomain, token }),
      });
      const data = await res.json();
      if (data.verified) {
        setState("verified");
      } else {
        setState("unverified");
        setMessage(data.error ?? "TXT record not found yet.");
      }
    } catch {
      setState("error");
      setMessage("Couldn't reach the verification service.");
    }
  }

  function copyToken() {
    navigator.clipboard?.writeText(token);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Globe className="size-4" />
          Domain
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Connect a domain</DialogTitle>
          <DialogDescription>
            Verifies domain ownership with a real DNS lookup. Read the note at the bottom
            before you assume this makes the site live.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="domain">Domain</Label>
            <Input
              id="domain"
              placeholder="florenzaflourish.com"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setState("idle");
              }}
            />
          </div>

          <div className="rounded-lg border border-border p-3.5 space-y-2.5">
            <p className="text-xs text-muted-foreground">
              Add this as a <span className="text-foreground">TXT</span> record at your domain
              registrar (host <span className="text-foreground font-mono">@</span>), then check
              below. TXT records are the standard way Vercel, Netlify, and Shopify verify domain
              ownership.
            </p>
            <div className="flex items-center gap-2 rounded-md border border-border bg-secondary/40 px-3 py-2">
              <code className="flex-1 text-xs text-foreground/90 break-all">{token}</code>
              <button
                onClick={() => {
                  setToken(randomToken());
                  setState("idle");
                }}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Generate a new verification token"
              >
                <RotateCw className="size-3.5" />
              </button>
              <button
                onClick={copyToken}
                className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                aria-label="Copy verification token"
              >
                {copied ? <CheckCircle2 className="size-3.5 text-success" /> : <ClipboardCopy className="size-3.5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleCheck}
              disabled={!cleanDomain || state === "checking"}
              size="sm"
            >
              {state === "checking" ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <ShieldCheck className="size-4" />
              )}
              Check DNS
            </Button>

            {state === "verified" && (
              <Badge variant="success">
                <CheckCircle2 className="size-3" /> Verified
              </Badge>
            )}
            {state === "unverified" && (
              <Badge variant="destructive">Not verified yet</Badge>
            )}
            {state === "error" && <Badge variant="destructive">Lookup failed</Badge>}
          </div>

          {message && <p className="text-xs text-muted-foreground">{message}</p>}

          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-xs text-foreground/85">
            <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-destructive" strokeWidth={1.75} />
            <p>
              Being direct: this checks real DNS, so it&apos;ll genuinely verify a TXT record on
              any domain you control. What it does <span className="text-foreground">not</span> do
              is host or serve the Florenza site, there&apos;s no deployment target behind this
              dashboard yet. Verifying ownership here is step one of connecting a domain; pointing
              it at a live site (A record or CNAME to actual hosting) is a separate step for once
              the site is deployed somewhere like Vercel or Netlify.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
