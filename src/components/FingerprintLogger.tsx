"use client";

import { setGlobalDeviceFingerprint } from "@/services/baseQuery";
import Script from "next/script";
import { useEffect } from "react";

const STORAGE_KEY = "acuity_device_fp";

declare global {
  interface Window {
    Profiling: {
      fingerprint: () => Promise<{ request_id_provider_1: string | null; description?: string }>;
    };
  }
}

function handleLoad() {
  if (!window.Profiling) {
    console.warn("Profiling still undefined after proxy load");
    return;
  }
  window.Profiling.fingerprint()
    .then((response) => {
      const fp = response.request_id_provider_1 || undefined;
      // console.log("Fingerprint request_id_provider_1:", fp);
      if (fp) {
        localStorage.setItem(STORAGE_KEY, fp);
        setGlobalDeviceFingerprint(fp);
      }
    })
    .catch((response) => {
      console.info("Fingerprint error:", response?.request_id_provider_1 ?? response?.description ?? response);
    });
}

export default function FingerprintLogger() {
  useEffect(() => {
    const cached = localStorage.getItem(STORAGE_KEY);
    if (cached) {
      setGlobalDeviceFingerprint(cached);
    }
  }, []);

  return (
    <Script
      src="/api/profiling-proxy"
      strategy="afterInteractive"
      onLoad={handleLoad}
    />
  );
}
