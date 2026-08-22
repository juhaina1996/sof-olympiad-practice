import { siteConfig } from "@/config/site";

export const metadata = {
  title: "Privacy Policy",
  description: `Privacy policy for ${siteConfig.name}.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-4">
      <h1 className="text-2xl font-extrabold">Privacy Policy</h1>
      <p className="text-sm text-slate-400">Last updated: {new Date().getFullYear()}</p>

      <p>
        {siteConfig.name} (&quot;we&quot;, &quot;our&quot;) provides free Olympiad exam practice content. This page
        explains what information is collected when you use this site.
      </p>

      <h2 className="mt-4 text-lg font-bold">Practice progress</h2>
      <p>
        We do not require an account or collect your name, email, or any personal information to use the practice
        questions. Your quiz answers and scores are stored only in your browser&apos;s local storage on your own
        device, and are never sent to our servers.
      </p>

      <h2 className="mt-4 text-lg font-bold">Cookies and advertising</h2>
      <p>
        This site may display advertisements served by third parties, such as Google AdSense. These providers may use
        cookies or similar technologies to serve ads based on your prior visits to this or other websites. You can opt
        out of personalised advertising by visiting{" "}
        <a href="https://adssettings.google.com" className="underline">
          Google Ads Settings
        </a>
        .
      </p>

      <h2 className="mt-4 text-lg font-bold">Analytics</h2>
      <p>
        We may use privacy-respecting analytics tools to understand overall traffic patterns (e.g. which pages are
        visited). This data is aggregated and not linked to your identity.
      </p>

      <h2 className="mt-4 text-lg font-bold">Contact</h2>
      <p>If you have questions about this policy, please contact us via the details on our homepage.</p>
    </div>
  );
}
