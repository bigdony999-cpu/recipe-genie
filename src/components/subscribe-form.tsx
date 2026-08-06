import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/convex/_generated/api";
import { useAction, useMutation } from "convex/react";
import { CheckCircle2, Loader2, Mail, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Notice =
  | { tone: "success"; text: string }
  | { tone: "error"; text: string }
  | { tone: "info"; text: string };

/** Email capture for the recipe newsletter — stored in Convex, welcome email via Resend. */
export function SubscribeForm({ className }: { className?: string }) {
  const subscribe = useMutation(api.subscribers.subscribe);
  const sendWelcomeEmail = useAction(api.resend.sendWelcomeEmail);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState<Notice | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const value = email.trim();

    if (!EMAIL_RE.test(value)) {
      setNotice({
        tone: "error",
        text: "That email doesn't look right — mind checking it?",
      });
      return;
    }

    setLoading(true);
    setNotice(null);
    try {
      const result = await subscribe({ email: value, source: "landing" });
      if (result.status === "already-subscribed") {
        setNotice({
          tone: "info",
          text: "You're already on the list — welcome back! 🍳",
        });
      } else {
        setNotice({
          tone: "success",
          text: "You're in! Watch your inbox for fresh recipe ideas. 🥘",
        });
        setEmail("");
        // Fire-and-forget welcome email via Resend; never blocks signup.
        sendWelcomeEmail({ email: value }).catch(() => {});
      }
    } catch {
      setNotice({
        tone: "error",
        text: "Something went wrong — please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Mail className="absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            aria-label="Email address"
            autoComplete="email"
            className="h-12 rounded-xl pl-10"
            disabled={loading}
            required
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="h-12 gap-2 rounded-xl px-6"
          disabled={loading}
        >
          {loading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Send className="size-4" />
          )}
          Subscribe
        </Button>
      </div>

      {notice && (
        <p
          role="status"
          className={cn(
            "mt-3 flex items-center justify-center gap-1.5 text-sm font-medium",
            notice.tone === "success" &&
              "text-emerald-600 dark:text-emerald-400",
            notice.tone === "error" && "text-destructive",
            notice.tone === "info" && "text-primary",
          )}
        >
          {notice.tone === "success" && <CheckCircle2 className="size-4 shrink-0" />}
          {notice.text}
        </p>
      )}
    </form>
  );
}
