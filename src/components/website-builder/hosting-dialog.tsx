"use client";

import { useState } from "react";
import {
  Rocket,
  Download,
  Loader2,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  ClipboardCopy,
} from "lucide-react";

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
import { type Site } from "@/lib/website-data";
import { type Product } from "@/lib/product-data";

type DeployState = "idle" | "deploying" | "deployed" | "error";

export function HostingDialog({ site, products }: { site: Site; products: Product[] }) {
  const [open, setOpen] = useState(false);
  const [token, setToken] = useState("");
  const [siteId, setSiteId] = useState("");
  const [state, setState] = useState<DeployState>("idle");
  const [error, setError] = useState<string | null>(null);
  const [liveUrl, setLiveUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleExport() {
    const res = await fetch("/api/hosting/export", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ site, products }),
    });
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "florenza-site.zip";
    a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeploy() {
    if (!token.trim()) return;
    setState("deploying");
    setError(null);
    try {
      const res = await fetch("/api/hosting/deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ site, products, token: token.trim(), siteId: siteId.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setState("error");
        setError(data.error ?? "Deploy failed.");
        return;
      }
      setLiveUrl(data.url);
      setSiteId(data.siteId);
      setState("deployed");
    } catch {
      setState("error");
      setError("Couldn't reach the deploy service.");
    }
  }

  function copyUrl() {
    if (!liveUrl) return;
    navigator.clipboard?.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" size="sm">
          <Rocket className="size-4" />
          Hosting
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Host this site</DialogTitle>
          <DialogDescription>
            Export the static file yourself, or deploy it live to Netlify with your own account.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="rounded-lg border border-border p-3.5 flex items-center justify-between gap-3">
            <div>
              <p className="text-sm text-foreground">Download the site</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                A zip with all four real pages (<code className="text-[11px]">index.html</code>,{" "}
                <code className="text-[11px]">shop.html</code>,{" "}
                <code className="text-[11px]">product.html</code>,{" "}
                <code className="text-[11px]">cart.html</code>), upload it to any static host.
                Cart works out of the box, checkout is intentionally disabled for now pending a
                payment provider.
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={handleExport}>
              <Download className="size-3.5" />
              Download
            </Button>
          </div>

          <div className="rounded-lg border border-border p-3.5 space-y-3.5">
            <div>
              <p className="text-sm text-foreground">Deploy live to Netlify</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Uses your own Netlify account, real deploy, real URL. Get a token at{" "}
                <span className="text-foreground">
                  app.netlify.com → User settings → Applications → Personal access tokens
                </span>
                .
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="netlify-token">Netlify personal access token</Label>
              <Input
                id="netlify-token"
                type="password"
                placeholder="nfp_••••••••••••••••"
                value={token}
                onChange={(e) => {
                  setToken(e.target.value);
                  setState("idle");
                }}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="netlify-site-id">Existing site ID (optional)</Label>
              <Input
                id="netlify-site-id"
                placeholder="Leave blank to create a new Netlify site"
                value={siteId}
                onChange={(e) => setSiteId(e.target.value)}
              />
              <p className="text-[11px] text-muted-foreground/70">
                Filled in automatically after your first deploy, keep it to redeploy to the same
                URL instead of creating a new site every time.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button size="sm" onClick={handleDeploy} disabled={!token.trim() || state === "deploying"}>
                {state === "deploying" ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Rocket className="size-4" />
                )}
                Deploy
              </Button>
              {state === "deployed" && (
                <Badge variant="success">
                  <CheckCircle2 className="size-3" /> Live
                </Badge>
              )}
              {state === "error" && <Badge variant="destructive">Deploy failed</Badge>}
            </div>

            {state === "deployed" && liveUrl && (
              <div className="flex items-center gap-2 rounded-md border border-success/30 bg-success/10 px-3 py-2">
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex-1 text-xs text-foreground/90 hover:underline break-all"
                >
                  {liveUrl}
                </a>
                <button
                  onClick={copyUrl}
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Copy live URL"
                >
                  {copied ? <CheckCircle2 className="size-3.5 text-success" /> : <ClipboardCopy className="size-3.5" />}
                </button>
                <a
                  href={liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="shrink-0 rounded-md p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                  aria-label="Open live site"
                >
                  <ExternalLink className="size-3.5" />
                </a>
              </div>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}
          </div>

          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/25 bg-destructive/5 px-3.5 py-3 text-xs text-foreground/85">
            <AlertTriangle className="size-3.5 shrink-0 mt-0.5 text-destructive" strokeWidth={1.75} />
            <p>
              Your token is sent straight to Netlify&apos;s API from this app&apos;s server and isn&apos;t
              stored or logged anywhere. Checkout is intentionally disabled on the deployed site
              too, cart and quantities work, payment is coming later with a different provider.
              The deployed page is styled via a Tailwind CDN script, not a compiled stylesheet,
              fine for a real preview, not what you&apos;d want serving real production traffic
              long-term. To use the domain you verified in the{" "}
              <span className="text-foreground">Domain</span> dialog, add it as a custom domain
              on this Netlify site after your first deploy.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
