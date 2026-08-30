import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import React, { StrictMode, Suspense, lazy, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes, useLocation } from "react-router";
import "./index.css";
import { Brand } from "@/components/Brand";
// The landing page is the first-paint route, so it stays in the initial
// bundle — splitting it out would add a network round-trip before anything
// paints. Every other page is code-split into its own lazy chunk: the heavy
// cook tool (share cards, shopping list, confetti, upsells) no longer ships
// to visitors who never open it.
import Landing from "./pages/Landing.tsx";

const CookTool = lazy(() => import("./pages/CookTool.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Privacy = lazy(() =>
  import("./pages/Legal.tsx").then((m) => ({ default: m.Privacy })),
);
const Terms = lazy(() =>
  import("./pages/Legal.tsx").then((m) => ({ default: m.Terms })),
);
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

/** Hard guard so runtime errors never leave the preview as a blank page. */
class RootErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; message: string; stack: string }
> {
  state = { hasError: false, message: "", stack: "" };
  static getDerivedStateFromError(error: Error) {
    return {
      hasError: true,
      message: error.message || "Unknown runtime error",
      stack: error.stack || "",
    };
  }
  componentDidCatch(err: Error) {
    console.error("[WebContainer preview] Root crash:", err);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground p-6">
          <div className="max-w-lg text-center">
            <p className="text-sm font-semibold">Preview runtime error</p>
            <p className="mt-2 text-xs text-muted-foreground break-words">
              {this.state.message}
            </p>
            {this.state.stack && (
              <pre className="mt-3 text-left text-[10px] leading-4 text-muted-foreground/80 max-h-40 overflow-auto rounded border border-border/60 p-2">
                {this.state.stack}
              </pre>
            )}
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-4 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-primary-foreground transition-transform hover:scale-105 active:scale-95"
            >
              Reload preview
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/** Lightweight themed loader shown while a lazy route chunk is fetched. */
function PageFallback() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
          <Brand />
        </div>
      </header>
      <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-center gap-5 px-4 py-28 text-center">
        <span className="grid size-14 animate-pulse place-items-center rounded-2xl bg-primary/10 text-3xl">
          🍳
        </span>
        <div className="space-y-2">
          <div className="mx-auto h-3 w-40 animate-pulse rounded-full bg-muted" />
          <div className="mx-auto h-3 w-64 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </div>
  );
}

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

function RouteSyncer() {
  const location = useLocation();
  useEffect(() => {
    window.parent.postMessage(
      { type: "iframe-route-change", path: location.pathname },
      "*",
    );
  }, [location.pathname]);

  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data?.type === "navigate") {
        if (event.data.direction === "back") window.history.back();
        if (event.data.direction === "forward") window.history.forward();
      }
    }
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  return null;
}

// Register the service worker for PWA installability + offline support.
// Guarded so it never interferes with dev/HMR.
if (import.meta.env.PROD && "serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/sw.js").catch(() => {});
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RootErrorBoundary>
      <ConvexAuthProvider client={convex}>
        <BrowserRouter>
          <RouteSyncer />
          <Suspense fallback={<PageFallback />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/cook" element={<CookTool />} />
              <Route
                path="/auth"
                element={<AuthPage redirectAfterAuth="/cook" />}
              />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ConvexAuthProvider>
    </RootErrorBoundary>
  </StrictMode>,
);
