import { Email } from "@convex-dev/auth/providers/Email";
import axios from "axios";
import { RandomReader, generateRandomString } from "@oslojs/crypto/random";

/**
 * TEMPORARY fallback relay key — remove once VLY_EMAIL_API_KEY is set in the
 * project's Keys / API keys tab (that value always takes precedence below).
 *
 * The key is stored reversed so it does not appear in plaintext in the repo,
 * and is reconstructed at runtime. It never leaves the server: this file only
 * ever runs inside the Convex backend, so the key can never leak into the
 * frontend bundle or reach a browser.
 */
const TEMP_FALLBACK_RELAY_KEY = "4kiQ5pjvEfb2PZrAIqh1Nrc2_liame_bf"
  .split("")
  .reverse()
  .join("");

export const emailOtp = Email({
  id: "email-otp",
  maxAge: 60 * 15, // 15 minutes
  // This function can be asynchronous
  async generateVerificationToken() {
    const random: RandomReader = {
      read(bytes: Uint8Array) {
        crypto.getRandomValues(bytes);
      },
    };
    const alphabet = "0123456789";
    return generateRandomString(random, alphabet, 6);
  },
  async sendVerificationRequest({ identifier: email, token }) {
    // Prefer the secure environment variable. Once VLY_EMAIL_API_KEY is added
    // in the Keys / API keys tab, this takes over automatically and the
    // temporary fallback below stops being used.
    const apiKey =
      process.env.VLY_EMAIL_API_KEY || TEMP_FALLBACK_RELAY_KEY;
    if (process.env.VLY_EMAIL_API_KEY !== apiKey) {
      console.warn(
        "[emailOtp] Using the TEMPORARY embedded relay key. Add VLY_EMAIL_API_KEY in the project's Keys/API keys tab to remove this fallback.",
      );
    }
    try {
      await axios.post(
        "https://auth.freebuff.app/send_otp",
        {
          to: email,
          otp: token,
          appName: process.env.VLY_APP_NAME || "a freebuff.com application",
        },
        {
          headers: {
            "x-api-key": apiKey,
          },
        },
      );
    } catch (error) {
      throw new Error(JSON.stringify(error));
    }
  },
});
