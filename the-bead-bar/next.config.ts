import type { NextConfig } from "next";
import { withSentryConfig } from "@sentry/nextjs";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withSentryConfig(nextConfig, {
  // Suppress Sentry build output noise; still uploads source maps when SENTRY_AUTH_TOKEN is set
  silent:    true,
  // Upload source maps only when SENTRY_AUTH_TOKEN is present (i.e., in CI)
  authToken: process.env.SENTRY_AUTH_TOKEN,
  org:       process.env.SENTRY_ORG,
  project:   process.env.SENTRY_PROJECT,
  webpack: {
    // Disable auto-instrumentation that would fail without a DSN configured
    autoInstrumentServerFunctions: false,
  },
});
