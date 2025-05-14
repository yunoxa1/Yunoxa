window.addEventListener("load", function () {
  if (window.cookieconsent) return;

  // 1. Inject blocking overlay
  const blocker = document.createElement("div");
  blocker.id = "cookie-blocker";
  blocker.style = `
    position: fixed;
    z-index: 9998;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(1px);
    pointer-events: all;
    touch-action: none;
    cursor: not-allowed;
  `;
  document.body.appendChild(blocker);

  // Block scroll on body and html
  document.body.style.overflow = "hidden";
  document.documentElement.style.overflow = "hidden";

  // Extra: Prevent touch and wheel scroll
  document.addEventListener("touchmove", preventScroll, { passive: false });
  document.addEventListener("wheel", preventScroll, { passive: false });

  function preventScroll(e) {
    e.preventDefault();
  }

  // 2. Load cookieconsent script
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
  script.onload = () => {
    window.cookieconsent.initialise({
      palette: {
        popup: {
          background: "var(--yunoxa-blkk)",
          border: "2px solid var(--yunoxa-blue)",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)"
        },
        button: {
          background: "var(--yunoxa-dark-red)",
          text: "var(--yunoxa-text)",
          borderRadius: "25px",
          boxShadow: "0 4px 12px rgba(30, 36, 0, 0.69)"
        }
      },
      theme: "classic",
      position: "bottom-right",
      type: "opt-in",
      revokable: false,
      dismissOnScroll: false,
      dismissOnTimeout: false,
      content: {
        message: "We use cookies to enhance your experience.",
        allow: "Accept",
        deny: "Decline",
        link: "Learn more",
        href: "/privacypolicy.html"
      },
      onInitialise: handleConsent,
      onStatusChange: handleConsent
    });
  };
  document.head.appendChild(script);

  // 3. Load cookieconsent stylesheet
  const style = document.createElement("link");
  style.rel = "stylesheet";
  style.href = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.css";
  document.head.appendChild(style);

  // 4. Add custom styles
  const customStyle = document.createElement("style");
  customStyle.textContent = `
    .cc-revoke {
      display: none !important;
    }
    .cc-popup {
      border-radius: 8px;
      padding: 20px;
      font-family: 'Arial', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      transition: transform 0.3s ease-out;
      transform: translateY(100%);
      background: linear-gradient(45deg, var(--yunoxa-blue), var(--yunoxa-orange), var(--yunoxa-red));
      background-size: 400% 400%;
      animation: gradientBG 6s ease infinite;
    }
    .cc-popup.cc-in {
      transform: translateY(0);
    }
    .cc-btn-allow {
      background: white !important;
      color: var(--yunoxa-text);
      border-radius: 25px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(255, 255, 255, 0.1);
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .cc-btn-allow:hover {
      background-color: var(--yunoxa-light-text);
      transform: translateY(-2px);
    }
    .cc-btn-deny {
      background: black !important;
      color: white !important;
      border-radius: 25px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .cc-btn-deny:hover {
      background-color: var(--yunoxa-light-text) !important;
      transform: translateY(-2px);
    }
    @keyframes gradientBG {
      0% { background-position: 0% 50%; }
      50% { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
  `;
  document.head.appendChild(customStyle);

  // 5. Add root CSS variables
  const rootStyle = document.createElement("style");
  rootStyle.textContent = `
    :root {
      --yunoxa-red: #e02f2f;
      --yunoxa-dark-red: rgb(201, 6, 6);
      --yunoxa-yellow: #ffd700;
      --yunoxa-blkk:rgb(48, 48, 48);
      --yunoxa-orange: #ff9500;
      --yunoxa-blue: #2e8bff;
      --yunoxa-bg: #f8f8f8;
      --yunoxa-text: #333;
      --yunoxa-light-text: #666;
    }
  `;
  document.head.appendChild(rootStyle);

  // 6. Handle consent decision
  function handleConsent(status) {
    if (status === "allow") {
      // Remove blocker and enable scroll
      const blocker = document.getElementById("cookie-blocker");
      if (blocker) blocker.remove();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
      document.removeEventListener("touchmove", preventScroll);
      document.removeEventListener("wheel", preventScroll);
      enableTrackingScripts();
    } else {
      // Keep blocked
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      disableTrackingScripts();
      window.location.href = "/blocked.html";
    }
  }

  // 7. Enable analytics/tracking if accepted
  function enableTrackingScripts() {
    if (!window.gaInitialized) {
      window.gaInitialized = true;
      const gaScript = document.createElement("script");
      gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-VQ8X8STE73";
      gaScript.async = true;
      document.head.appendChild(gaScript);

      window.dataLayer = window.dataLayer || [];
      function gtag() { dataLayer.push(arguments); }
      window.gtag = gtag;
      gtag("js", new Date());
      gtag("config", "G-VQ8X8STE73");
    }
  }

  function disableTrackingScripts() {
    console.log("Tracking declined.");
    // Optional: clear cookies/localStorage if needed
  }
});
