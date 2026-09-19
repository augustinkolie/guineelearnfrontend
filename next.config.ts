import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  // twilio-video est une lib browser-only (WebRTC, DOM APIs) — ne pas bundler côté serveur
  serverExternalPackages: ['twilio-video'],
};

export default nextConfig;
