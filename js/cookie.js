/**
 * 🌟 Ultra-Premium Cookie Consent Solution
 * - GDPR compliant with gorgeous UI
 * - Supports favorites/login via localStorage
 * - Blocks only non-essential tracking
 * - 100% responsive with flawless animations
 */
document.addEventListener("DOMContentLoaded", function() {
  // Skip if already initialized
  if (window.cookieConsentInitialized) return;
  window.cookieConsentInitialized = true;

  // 🎨 Design System Variables
  const designSystem = {
    colors: {
      primary: "#e02f2f",
      secondary: "#3f37c9",
      text: "#2b2d42",
      lightText: "#8d99ae",
      background: "#ffffff",
      error: "#ef233c",
      success: "#4cc9f0",
      border: "#edf2f4"
    },
    fonts: {
      main: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      mono: "'Roboto Mono', monospace"
    },
    shadows: {
      small: "0 1px 3px rgba(0,0,0,0.12)",
      medium: "0 4px 6px rgba(0,0,0,0.1)",
      large: "0 10px 25px rgba(0,0,0,0.1)"
    },
    spacing: {
      xs: "4px",
      sm: "8px",
      md: "16px",
      lg: "24px",
      xl: "32px"
    },
    radii: {
      sm: "4px",
      md: "8px",
      lg: "12px",
      pill: "9999px"
    }
  };

  // ✨ Inject global styles
  const styleElement = document.createElement("style");
  styleElement.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translate(-50%, 20px); opacity: 0; } to { transform: translate(-50%, 0); opacity: 1; } }
    @keyframes slideDown { to { transform: translate(-50%, 20px); opacity: 0; } }
    @keyframes pulse { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
  `;
  document.head.appendChild(styleElement);

  // 🛡️ Check existing consent
  const userConsent = localStorage.getItem("cookie_consent");
  if (userConsent === "accepted") {
    loadTrackingScripts();
    return;
  }

  // 🖼️ Create premium banner
  const banner = document.createElement("div");
  banner.id = "cookie-consent-banner";
  banner.style = `
    position: fixed;
    z-index: 9999;
    bottom: ${designSystem.spacing.lg};
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 600px;
    padding: ${designSystem.spacing.xl};
    background: ${designSystem.colors.background};
    border-radius: ${designSystem.radii.lg};
    box-shadow: ${designSystem.shadows.large};
    font-family: ${designSystem.fonts.main};
    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    border: 1px solid ${designSystem.colors.border};
    box-sizing: border-box;
  `;
  banner.innerHTML = `
    <div style="
      display: flex;
      flex-direction: column;
      gap: ${designSystem.spacing.md};
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: ${designSystem.spacing.sm};
      ">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM11 16V18H13V16H11ZM11 6V14H13V6H11Z" fill="${designSystem.colors.primary}"/>
        </svg>
        <h3 style="
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: ${designSystem.colors.text};
        ">Your Privacy Matters</h3>
      </div>
      
      <p style="
        margin: 0;
        font-size: 15px;
        line-height: 1.5;
        color: ${designSystem.colors.lightText};
      ">
        We use cookies to provide essential functionality and enhance your experience. 
        <span style="color: ${designSystem.colors.text}; font-weight: 500;">Favorites and login will always work</span>, 
        while analytics are optional.
      </p>
      
      <div style="
        display: flex;
        gap: ${designSystem.spacing.sm};
        justify-content: flex-end;
        flex-wrap: wrap;
      ">
        <button id="reject-cookies" style="
          padding: ${designSystem.spacing.sm} ${designSystem.spacing.lg};
          border-radius: ${designSystem.radii.pill};
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: transparent;
          color: ${designSystem.colors.text};
          border: 1px solid ${designSystem.colors.border};
        ">
          Essential Only
        </button>
        <button id="accept-cookies" style="
          padding: ${designSystem.spacing.sm} ${designSystem.spacing.lg};
          border-radius: ${designSystem.radii.pill};
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          background: ${designSystem.colors.primary};
          color: white;
          border: none;
          animation: pulse 2s infinite;
        ">
          Accept All
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(banner);

  // 🎯 Event Listeners with Hover Effects
  const rejectBtn = document.getElementById("reject-cookies");
  const acceptBtn = document.getElementById("accept-cookies");

  [rejectBtn, acceptBtn].forEach(btn => {
    btn.addEventListener("mouseenter", () => {
      btn.style.transform = "translateY(-2px)";
      btn.style.boxShadow = designSystem.shadows.medium;
    });
    btn.addEventListener("mouseleave", () => {
      btn.style.transform = "";
      btn.style.boxShadow = "";
    });
  });

  // ✅ Accept Handler
  acceptBtn.addEventListener("click", () => {
    localStorage.setItem("cookie_consent", "accepted");
    animateBannerExit();
    loadTrackingScripts();
    showToast("Preferences saved. Thank you!", "success");
  });

  // ❌ Reject Handler
  rejectBtn.addEventListener("click", () => {
    localStorage.setItem("cookie_consent", "rejected");
    animateBannerExit();
    clearNonEssentialCookies();
    showToast("Using essential cookies only. Favorites/login unaffected.", "info");
  });

  // ✈️ Animated Exit
  function animateBannerExit() {
    banner.style.animation = "slideDown 0.4s cubic-bezier(0.5, 0, 0.5, 1) forwards";
    setTimeout(() => banner.remove(), 400);
  }

  // 📊 Load Tracking Scripts
  function loadTrackingScripts() {
    if (localStorage.getItem("cookie_consent") !== "accepted") return;
    
    // Google Analytics Example
    const gaScript = document.createElement("script");
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VQ8X8STE73";
    gaScript.async = true;
    document.head.appendChild(gaScript);

    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    gtag("js", new Date());
    gtag("config", "G-VQ8X8STE73");
    
    // Additional trackers can be added here
  }

  // 🧹 Clean Non-Essential Cookies
  function clearNonEssentialCookies() {
    document.cookie.split(";").forEach(cookie => {
      const name = cookie.trim().split("=")[0];
      if (name.startsWith("_ga") || name.startsWith("_gid") || name.startsWith("_fbp")) {
        document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${window.location.hostname};`;
      }
    });
  }

  // 💫 Premium Toast Notification
  function showToast(message, type) {
    const toast = document.createElement("div");
    toast.style = `
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%);
      background: ${type === "success" ? designSystem.colors.success : designSystem.colors.primary};
      color: white;
      padding: ${designSystem.spacing.md} ${designSystem.spacing.lg};
      border-radius: ${designSystem.radii.pill};
      box-shadow: ${designSystem.shadows.medium};
      z-index: 10000;
      animation: fadeIn 0.3s ease-out;
      font-size: 14px;
      max-width: 80%;
      text-align: center;
      backdrop-filter: blur(10px);
      display: flex;
      align-items: center;
      gap: ${designSystem.spacing.sm};
    `;
    
    toast.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9 16.17L4.83 12L3.41 13.41L9 19L21 7L19.59 5.59L9 16.17Z" fill="white"/>
      </svg>
      ${message}
    `;
    
    document.body.appendChild(toast);
    setTimeout(() => {
      toast.style.animation = "fadeIn 0.3s ease-out reverse forwards";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // 🏁 Initialize if consent already given
  if (userConsent === "accepted") loadTrackingScripts();
});