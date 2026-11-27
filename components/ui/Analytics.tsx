"use client";

import React, { useEffect, useState } from "react";
import Script from "next/script";

export const Analytics: React.FC = () => {
  const [hasConsent, setHasConsent] = useState(false);
  const analyticsId = process.env.NEXT_PUBLIC_ANALYTICS_ID || "[YOUR_ANALYTICS_ID_HERE]";

  useEffect(() => {
    // Check initial consent from localStorage
    const consent = localStorage.getItem("finsmart_cookie_consent");
    if (consent === "accepted") {
      setHasConsent(true);
    }

    // Listen for live updates from CookieConsent banner
    const onConsentUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ status: string }>;
      if (customEvent.detail && customEvent.detail.status === "accepted") {
        setHasConsent(true);
      } else {
        setHasConsent(false);
      }
    };

    window.addEventListener("finsmart_consent_updated", onConsentUpdated);
    return () => {
      window.removeEventListener("finsmart_consent_updated", onConsentUpdated);
    };
  }, []);

  // Strict privacy gate: Do NOT load or inject any telemetry script without explicit consent
  if (!hasConsent || analyticsId.startsWith("[")) {
    return null;
  }

  return (
    <>
      {/* Privacy-Friendly Anonymized Telemetry Script (Loaded Only Upon Explicit Consent) */}
      <Script
        id="finsmart-telemetry"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsId}`}
      />
      <Script
        id="finsmart-telemetry-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsId}', {
              anonymize_ip: true,
              allow_google_signals: false,
              allow_ad_personalization_signals: false,
              restricted_data_processing: true
            });
          `,
        }}
      />
    </>
  );
};
