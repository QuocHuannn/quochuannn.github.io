import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import "./styles/theme-transitions.css";
import { register as registerSW, showUpdateAvailableNotification } from "./utils/serviceWorker";
import { applyBrowserOptimizations, monitorPerformance, getBrowserInfo } from "./utils/browserDetection";
import { initMobileOptimizations } from './utils/mobileOptimization';

// Apply browser-specific optimizations
applyBrowserOptimizations();

// Initialize mobile optimizations
initMobileOptimizations();

// Performance monitoring
monitorPerformance();

// Basic performance monitoring
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  const browserInfo = getBrowserInfo();
  console.log('Development mode - performance monitoring enabled');
  console.log('Browser Info:', browserInfo);
}

// Register service worker
if (import.meta.env.PROD) {
  registerSW({
    onSuccess: (registration) => {
      console.log('SW registered successfully:', registration);
    },
    onUpdate: (registration) => {
      console.log('SW updated:', registration);
      showUpdateAvailableNotification();
    }
  });
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
