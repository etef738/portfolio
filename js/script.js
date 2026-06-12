// ===============================
// Etefworkie Melaku Portfolio v2.5 (2025)
// ===============================

// 🌀 Loader – EM Intro Fade-Out
window.addEventListener("load", () => {
  const loader = document.querySelector(".loader");
  if (!loader) return;
  setTimeout(() => {
    loader.style.opacity = "0";
    setTimeout(() => loader.classList.add("hidden"), 500);
  }, 1500);
});

// ✨ Particle Background
const particlesContainer = document.querySelector(".particles");
if (particlesContainer) {
  for (let i = 0; i < 60; i++) {
    const particle = document.createElement("div");
    particle.classList.add("particle");
    particle.style.left = Math.random() * 100 + "%";
    particle.style.animationDelay = Math.random() * 20 + "s";
    particle.style.animationDuration = 15 + Math.random() * 10 + "s";
    particlesContainer.appendChild(particle);
  }
}

// 🧭 Navigation Scroll Effect + Active Link Highlight
const nav = document.querySelector("nav");
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-link");
const navToggle = document.querySelector(".nav-toggle");
const navMenu = document.getElementById("main-menu");

const closeMenu = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove("menu-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
  document.body.classList.remove("nav-open");
};

if (navToggle && navMenu && nav) {
  navToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("menu-open");
    navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
    document.body.classList.toggle("nav-open", isOpen);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  document.addEventListener("click", (event) => {
    if (!nav.classList.contains("menu-open")) return;
    if (!nav.contains(event.target)) closeMenu();
  });
}

window.addEventListener("scroll", () => {
  if (nav) nav.classList.toggle("scrolled", window.scrollY > 50);

  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

// 🪶 Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", (e) => {
    const target = document.querySelector(anchor.getAttribute("href"));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      closeMenu();
    }
  });
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 900) closeMenu();
});

// 👁️ Scroll Reveal Animations
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("reveal");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15, rootMargin: "0px 0px -50px 0px" }
);

document
  .querySelectorAll(
    ".skill-card, .project-card, .story-card, .exp-card, .tool-box, .video-wrapper, .section-header"
  )
  .forEach((el) => observer.observe(el));

// 🖼️ Card Image Fallbacks
document.querySelectorAll(".card-media img").forEach((img) => {
  const media = img.closest(".card-media");
  if (!media) return;
  const fallbackLabel = img.dataset.fallbackLabel || img.alt || "Project Preview";
  media.setAttribute("data-fallback-label", fallbackLabel);

  const applyFallback = () => {
    media.classList.add("fallback");
    img.setAttribute("aria-hidden", "true");
  };

  img.addEventListener("error", applyFallback);
  if (img.complete && img.naturalWidth === 0) applyFallback();
});

// ⌨️ Typewriter Hero Subtitle
const subtitle = document.querySelector(".hero-subtitle");
if (subtitle) {
  const text = subtitle.textContent.trim();
  subtitle.textContent = "";
  let i = 0;
  const typeWriter = () => {
    if (i < text.length) {
      subtitle.textContent += text.charAt(i++);
      setTimeout(typeWriter, 80);
    }
  };
  setTimeout(typeWriter, 2000);
}

// 🌌 Hero Parallax
const heroBg = document.querySelector(".hero-bg");
if (heroBg) {
  window.addEventListener("mousemove", (e) => {
    const moveX = (e.clientX / window.innerWidth - 0.5) * 20;
    const moveY = (e.clientY / window.innerHeight - 0.5) * 20;
    heroBg.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
  });
}

// 🔢 Stats Counter — skips entries that have no "+" suffix (e.g. plain years)
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const raw = el.textContent.trim();
      const hasPlus = raw.endsWith("+");
      if (!hasPlus) return; // static value like "2027" — leave it as-is
      const finalValue = parseInt(raw, 10);
      const step = Math.ceil(finalValue / 30);
      let count = 0;
      const interval = setInterval(() => {
        count += step;
        if (count >= finalValue) {
          count = finalValue;
          clearInterval(interval);
        }
        el.textContent = count + "+";
      }, 40);
      countObserver.unobserve(el);
    });
  },
  { threshold: 0.5 }
);
document.querySelectorAll(".stats strong").forEach((s) => countObserver.observe(s));

// 💌 Contact Form (Web3Forms) – send without exposing an email address
const contactForm = document.getElementById("contactForm");
if (contactForm) {
  const status = contactForm.querySelector(".form-status");
  const submitBtn = contactForm.querySelector("button[type='submit']");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const original = submitBtn.textContent;
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending…";
    status.textContent = "";

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(contactForm),
      });
      const data = await res.json();
      if (data.success) {
        status.style.color = "var(--gold)";
        status.textContent = "Thank you! Your message has been sent.";
        contactForm.reset();
      } else {
        throw new Error(data.message || "Submission failed");
      }
    } catch (err) {
      status.style.color = "#e0625a";
      status.textContent = "Something went wrong — please try again later.";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = original;
    }
  });
}
