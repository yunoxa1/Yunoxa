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
  document.body.style.overflow = "hidden";

  // 2. Load cookieconsent script
  const script = document.createElement("script");
  script.src = "https://cdn.jsdelivr.net/npm/cookieconsent@3/build/cookieconsent.min.js";
  script.onload = () => {
    window.cookieconsent.initialise({
      palette: {
        popup: { 
          background: "var(--yunoxa-dark-red)", // Dark red for the popup background
          border: "2px solid var(--yunoxa-blue)", // Blue border for a clean, professional look
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)" // Soft shadow for depth
        },
        button: { 
          background: "var(--yunoxa-yellow)", // Default background for button
          text: "var(--yunoxa-text)", // Dark text for the button
          borderRadius: "25px", // Rounded corners for the button
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)", // Subtle shadow for button
        }
      },
      theme: "classic",
      position: "bottom-right",
      type: "opt-in",
      revokable: false, // ✅ Do not show floating consent button
      dismissOnScroll: false, // ✅ Don't auto-dismiss on scroll
      dismissOnTimeout: false, // ✅ Don't auto-dismiss after timeout
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

  // 4. Add custom style for .cc-revoke (to hide revoke button)
  const customStyle = document.createElement("style");
  customStyle.textContent = `
    .cc-revoke {
      display: none !important;
    }
    /* Add custom CSS for better popup appearance */
    .cc-popup {
      border-radius: 8px; /* Smooth rounded corners */
      padding: 20px; /* Padding inside the popup */
      font-family: 'Arial', sans-serif;
      font-size: 16px;
      line-height: 1.5;
      transition: transform 0.3s ease-out; /* Smooth slide-in animation */
      transform: translateY(100%); /* Initially off-screen */
      background: linear-gradient(45deg, var(--yunoxa-blue), var(--yunoxa-orange), var(--yunoxa-red)); /* Animated gradient background */
      background-size: 400% 400%;
      animation: gradientBG 6s ease infinite; /* Animated gradient */
    }
    .cc-popup.cc-in {
      transform: translateY(0); /* Slide in on initialization */
    }
    /* Button Styling */
    .cc-btn-allow {
      background: white !important; /* White background for Accept */
      color: var(--yunoxa-text);
      border-radius: 25px;
      padding: 10px 20px;
      font-size: 14px;
      cursor: pointer;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      transition: background-color 0.3s ease, transform 0.3s ease;
    }
    .cc-btn-allow:hover {
      background-color: var(--yunoxa-light-text);
      transform: translateY(-2px); /* Slight lift effect on hover */
    }

    .cc-btn-deny {
      background: black !important; /* Black background for Decline */
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
      transform: translateY(-2px); /* Slight lift effect on hover */
    }
    
    /* Gradient animation */
    @keyframes gradientBG {
      0% {
        background-position: 0% 50%;
      }
      50% {
        background-position: 100% 50%;
      }
      100% {
        background-position: 0% 50%;
      }
    }
  `;
  document.head.appendChild(customStyle);

  // 5. Apply custom root styles to the page (in case cookieconsent needs additional styling)
  const rootStyle = document.createElement("style");
  rootStyle.textContent = `
    :root {
      --yunoxa-red: #e02f2f;
      --yunoxa-dark-red:rgb(27, 27, 27);
      --yunoxa-yellow:rgb(218, 40, 40);
      --yunoxa-orange: #ff9500;
      --yunoxa-blue: #2e8bff;
      --yunoxa-bg: #f8f8f8;
      --yunoxa-text: #333;
      --yunoxa-light-text: #666;
    }
  `;
  document.head.appendChild(rootStyle);

  // 6. Consent handler function
  function handleConsent(status) {
    if (status === "allow") {
      document.body.style.overflow = "";
      const blocker = document.getElementById("cookie-blocker");
      if (blocker) blocker.remove();
      enableTrackingScripts();
    } else {
      document.body.style.overflow = "hidden";
      disableTrackingScripts();
      window.location.href = "/blocked.html";
    }
  }

  // 7. Tracking scripts loader
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
    // Optional: clear cookies or localStorage
  }
});
