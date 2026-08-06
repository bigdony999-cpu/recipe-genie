import { Button } from "@/components/ui/button";
import { Download, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

/**
 * Shows an "Install app" button when the browser offers PWA installation
 * (Chrome/Edge/Android). On iOS Safari it shows a gentle "Add to Home
 * Screen" hint instead. Renders nothing when not installable.
 */
export function InstallAppButton({ className }: { className?: string }) {
  const [promptEvent, setPromptEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    const onPrompt = (event: Event) => {
      event.preventDefault();
      setPromptEvent(event as BeforeInstallPromptEvent);
    };
    const onInstalled = () => setInstalled(true);

    const isIos =
      /iphone|ipad|ipod/i.test(navigator.userAgent) &&
      !window.matchMedia("(display-mode: standalone)").matches;
    setShowIosHint(isIos);

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (installed || (!promptEvent && !showIosHint)) return null;

  const handleInstall = async () => {
    if (!promptEvent) return;
    await promptEvent.prompt();
    await promptEvent.userChoice;
    setPromptEvent(null);
  };

  const handleIosHint = () => {
    toast(
      "In Safari, tap the Share button (□↑), scroll down, then “Add to Home Screen” 📱",
    );
  };

  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={showIosHint ? handleIosHint : handleInstall}
      title={
        showIosHint
          ? "Tap the Share button in Safari, then “Add to Home Screen”"
          : "Install as an app"
      }
    >
      {showIosHint ? (
        <Smartphone className="size-4" />
      ) : (
        <Download className="size-4" />
      )}
      {showIosHint ? "Add to home screen" : "Install app"}
    </Button>
  );
}
