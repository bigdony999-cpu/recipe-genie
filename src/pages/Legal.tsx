import { Brand } from "@/components/Brand";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

/**
 * Shared shell for the legal pages: a simple centered prose layout with a
 * back link and the brand, so privacy/terms feel like first-class pages.
 */
function LegalLayout({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur">
        <div className="mx-auto flex h-16 w-full max-w-4xl items-center justify-between px-4 sm:px-6">
          <Link
            to="/"
            className="rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Brand />
          </Link>
          <Button asChild variant="ghost" size="sm" className="gap-1.5">
            <Link to="/">
              <ArrowLeft className="size-4" /> Back to site
            </Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto w-full max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-primary">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {updated}
        </p>
        <div className="prose-custom mt-8 space-y-6 text-[15px] leading-7 text-foreground/90">
          {children}
        </div>
      </main>

      <footer className="border-t border-border/70 py-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6">
          <Brand />
          <p className="text-sm text-muted-foreground">
            Made with 🍳 for people who can&apos;t decide what to cook.
          </p>
          <div className="flex items-center gap-4 text-sm font-medium text-muted-foreground">
            <Link to="/privacy" className="transition-colors hover:text-foreground">
              Privacy
            </Link>
            <Link to="/terms" className="transition-colors hover:text-foreground">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Section({ heading, children }: { heading: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-bold tracking-tight">{heading}</h2>
      <div className="mt-2 space-y-3">{children}</div>
    </section>
  );
}

const EMAIL_LINK = "mailto:support@whatshouldicook.app";

export function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 7, 2026">
      <p className="text-muted-foreground">
        We keep things simple: this site collects as little data as possible,
        and we never sell your information. Here&apos;s exactly what we
        collect, why, and how you stay in control.
      </p>

      <Section heading="1. What we collect">
        <p>
          <strong>Newsletter signups.</strong> When you subscribe with your
          email address, we store it so we can send you recipe updates. We
          also record roughly when you subscribed and the page you signed up
          from.
        </p>
        <p>
          <strong>Account emails.</strong> If you create an account to use the
          cook tool&apos;s saved &amp; cooked lists, we store your email so we
          can send you login codes and keep your lists synced.
        </p>
        <p>
          <strong>Cooked / saved lists.</strong> The lists of recipes you save
          or mark as cooked are tied to your account so they follow you across
          devices.
        </p>
        <p>
          <strong>Anonymous analytics.</strong> We use Simple Analytics, a
          privacy-first, cookieless analytics service, to understand which
          pages people visit and how the tool is used. It does not track you
          across sites and does not use cookies, so no consent banner is
          needed.
        </p>
      </Section>

      <Section heading="2. What we don't collect">
        <p>
          We don&apos;t use advertising trackers, we don&apos;t build
          behavioral profiles, and we never sell or rent your data to anyone.
          Your ingredients, recipe picks, and chat questions are never shared.
        </p>
      </Section>

      <Section heading="3. Who we share data with">
        <ul className="list-disc space-y-1.5 pl-6">
          <li>
            <strong>Resend</strong> — processes emails we send you (welcome,
            weekly recipes, login codes).
          </li>
          <li>
            <strong>Simple Analytics</strong> — receives aggregated, anonymous
            page-view stats (no personal data).
          </li>
          <li>
            <strong>Gumroad</strong> — handles ebook purchases. Your payment
            details go to Gumroad, never to us.
          </li>
        </ul>
        <p className="text-sm text-muted-foreground">
          We only share data with these services to make the site work, and
          never for advertising purposes.
        </p>
      </Section>

      <Section heading="4. Where data lives">
        <p>
          Data is stored with our hosting providers (Convex for app data,
          Resend and Simple Analytics for email and analytics respectively),
          which may store data in multiple regions. We apply industry-standard
          protections to everything we control.
        </p>
      </Section>

      <Section heading="5. Your rights">
        <p>
          You can unsubscribe from the newsletter at any time using the
          unsubscribe link in any email. To delete your account and all your
          data, or to request a copy of what we hold, email us at{" "}
          <a href={EMAIL_LINK} className="font-semibold text-primary underline">
            {EMAIL_LINK.replace("mailto:", "")}
          </a>
          . We&apos;ll act within 30 days.
        </p>
      </Section>

      <Section heading="6. Children's privacy">
        <p>
          This site is intended for general audiences and does not
          knowingly collect personal data from children under 13.
        </p>
      </Section>

      <Section heading="7. Changes">
        <p>
          If we change this policy, we&apos;ll update the &ldquo;last
          updated&rdquo; date above. Material changes will be highlighted on
          the site.
        </p>
      </Section>
    </LegalLayout>
  );
}

export function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="August 7, 2026">
      <p className="text-muted-foreground">
        Welcome to What Should I Cook? By using this site you agree to these
        terms. They&apos;re written in plain language on purpose.
      </p>

      <Section heading="1. Using the site">
        <p>
          The site is free to use for finding recipe ideas. You don&apos;t
          need an account to use the core tool. An optional account lets you
          save and sync your recipe lists.
        </p>
        <p>
          You agree not to misuse the service — for example, by trying to
          break it, scrape it at scale, spam the newsletter form, or
          interfere with other users.
        </p>
      </Section>

      <Section heading="2. Recipe suggestions are suggestions">
        <p>
          Recipe ideas, times, and ingredient lists are provided for general
          information and entertainment. They are not professional dietary,
          allergy, or safety advice. Always check ingredients for allergens,
          follow safe food-handling practices, and cook to safe internal
          temperatures. If you have food allergies or medical conditions,
          consult a qualified professional.
        </p>
      </Section>

      <Section heading="3. The AI Chef">
        <p>
          The AI Chef answers are generated by an AI model and can be wrong.
          Double-check any cooking times, temperatures, and substitutions
          before relying on them, and never use AI advice for food-safety
          decisions.
        </p>
      </Section>

      <Section heading="4. The ebook">
        <p>
          The Everyday Cookbook is a digital product sold through Gumroad.
          Once purchased, it&apos;s yours to keep and read on your devices;
          please don&apos;t redistribute or resell it. Purchases and refunds
          are handled under Gumroad&apos;s terms; we offer a 7-day
          money-back guarantee — just email us and we&apos;ll help.
        </p>
      </Section>

      <Section heading="5. Links to third parties">
        <p>
          Recipe links may point to external websites. We&apos;re not
          responsible for their content, privacy practices, or availability.
        </p>
      </Section>

      <Section heading="6. Intellectual property">
        <p>
          The site design, branding, and content (other than user-provided
          data) belong to us. You may share your recipe shortlists and link to
          the site freely, but don&apos;t copy the site or its content for
          commercial use without permission.
        </p>
      </Section>

      <Section heading="7. Disclaimer &amp; liability">
        <p>
          The service is provided &ldquo;as is&rdquo; without warranties of
          any kind. To the maximum extent permitted by law, we are not liable
          for damages arising from your use of the site, including anything
          you cook. Nothing here limits liability that cannot be limited by
          law.
        </p>
      </Section>

      <Section heading="8. Contact">
        <p>
          Questions about these terms? Email us at{" "}
          <a href={EMAIL_LINK} className="font-semibold text-primary underline">
            {EMAIL_LINK.replace("mailto:", "")}
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
