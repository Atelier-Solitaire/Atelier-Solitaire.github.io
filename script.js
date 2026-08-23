/* ============================================================
   ATELIER SOLITAIRE — script.js
   - Lenis smooth scroll (damped) + GSAP ScrollTrigger reveals
   - Testimonial carousel, appointment form, nav state
   ============================================================ */
(function () {
  "use strict";

  var prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var hasGSAP = typeof gsap !== "undefined" && typeof ScrollTrigger !== "undefined";
  var hasLenis = typeof Lenis !== "undefined";
  var motionOK = !prefersReduced && hasGSAP;

  if (!motionOK) document.body.classList.add("no-motion");
  if (hasGSAP) gsap.registerPlugin(ScrollTrigger);

  /* ---------- Smooth scroll (Lenis) ---------- */
  var lenis = null;
  if (!prefersReduced && hasLenis) {
    lenis = new Lenis({
      duration: 1.25,               // damped, unhurried glide
      easing: function (t) { return Math.min(1, 1.001 - Math.pow(2, -10 * t)); },
      smoothWheel: true
    });
    if (hasGSAP) {
      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.add(function (time) { lenis.raf(time * 1000); });
      gsap.ticker.lagSmoothing(0);
    } else {
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(0);
    }
  }

  /* ---------- Anchor links: route through Lenis when present ---------- */
  document.querySelectorAll("[data-scroll]").forEach(function (link) {
    link.addEventListener("click", function (e) {
      var target = document.querySelector(link.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      if (lenis) {
        lenis.scrollTo(target, { offset: -64, duration: 1.4 });
      } else {
        target.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth" });
      }
    });
  });

  /* ---------- Nav: transparent -> blurred black on scroll ---------- */
  var nav = document.getElementById("siteNav");
  function updateNav(y) { nav.classList.toggle("is-scrolled", y > 40); }
  if (lenis) {
    lenis.on("scroll", function (e) { updateNav(e.scroll); });
  } else {
    window.addEventListener("scroll", function () { updateNav(window.scrollY); }, { passive: true });
  }

  /* ---------- Page load: veil fades, hero lines rise ---------- */
  function onLoaded() {
    document.body.classList.add("is-loaded");
    if (motionOK) {
      gsap.to(".hero .reveal-line > span", {
        y: 0, duration: 1.5, ease: "power4.out", stagger: 0.12, delay: 0.45
      });
    }
  }
  if (document.readyState === "complete") onLoaded();
  else window.addEventListener("load", onLoaded);
  setTimeout(onLoaded, 2600); // fail-safe: never trap the user behind the veil

  /* ---------- Scroll reveals ---------- */
  if (motionOK) {

    // Masked line reveals outside the hero
    gsap.utils.toArray(".reveal-line").forEach(function (mask) {
      if (mask.closest(".hero")) return;
      gsap.to(mask.querySelector("span"), {
        y: 0, duration: 1.3, ease: "power4.out",
        scrollTrigger: { trigger: mask, start: "top 86%", once: true }
      });
    });

    // About: image drifts in from the left, copy from the right (slight offset)
    gsap.from(".about-figure", {
      opacity: 0, x: -60, duration: 1.4, ease: "power3.out",
      scrollTrigger: { trigger: ".about-grid", start: "top 74%", once: true }
    });
    gsap.from(".about-copy", {
      opacity: 0, x: 60, duration: 1.4, ease: "power3.out", delay: 0.15,
      scrollTrigger: { trigger: ".about-grid", start: "top 74%", once: true }
    });

    // Collection: works rise one after another (0.1s stagger)
    gsap.from(".collection-grid .work-media", {
      opacity: 0, y: 56, duration: 1.2, ease: "power3.out", stagger: 0.1,
      scrollTrigger: { trigger: ".collection-grid", start: "top 80%", once: true }
    });

    // Process: the gold thread draws itself, then the steps surface
    var stepsEl = document.querySelector(".steps");
    if (stepsEl) {
      ScrollTrigger.create({
        trigger: stepsEl, start: "top 78%", once: true,
        onEnter: function () {
          stepsEl.classList.add("is-drawn");
          gsap.from(".step", {
            opacity: 0, y: 36, duration: 1.1, ease: "power3.out", stagger: 0.18, delay: 0.35
          });
        }
      });
    }

    // Team page: founder profile drifts in, members rise with a stagger
    if (document.querySelector(".founder-inner")) {
      gsap.from(".founder-figure", {
        opacity: 0, x: -50, duration: 1.4, ease: "power3.out",
        scrollTrigger: { trigger: ".founder-inner", start: "top 74%", once: true }
      });
      gsap.from(".founder-copy", {
        opacity: 0, x: 50, duration: 1.4, ease: "power3.out", delay: 0.15,
        scrollTrigger: { trigger: ".founder-inner", start: "top 74%", once: true }
      });
      gsap.from(".team-grid .member", {
        opacity: 0, y: 56, duration: 1.2, ease: "power3.out", stagger: 0.12,
        scrollTrigger: { trigger: ".team-grid", start: "top 80%", once: true }
      });
    }

    // Testimonial & Contact: quiet fades
    gsap.from(".testimonial > *", {
      opacity: 0, y: 30, duration: 1.2, ease: "power3.out", stagger: 0.12,
      scrollTrigger: { trigger: ".testimonial", start: "top 70%", once: true }
    });
    gsap.from(".contact-info, .contact-form", {
      opacity: 0, y: 44, duration: 1.3, ease: "power3.out", stagger: 0.15,
      scrollTrigger: { trigger: ".contact-grid", start: "top 74%", once: true }
    });
  } else {
    // No motion: everything simply visible
    var steps = document.querySelector(".steps");
    if (steps) steps.classList.add("is-drawn");
  }

  /* ---------- Testimonial carousel ---------- */
  var quotes = Array.prototype.slice.call(document.querySelectorAll(".quote"));
  var prevBtn = document.getElementById("quotePrev");
  var nextBtn = document.getElementById("quoteNext");
  var qi = 0, qTimer = null;

  function showQuote(next) {
    if (next === qi) return;
    quotes[qi].classList.remove("is-active");
    qi = (next + quotes.length) % quotes.length;
    var q = quotes[qi];
    q.classList.add("is-active");
    if (motionOK) {
      gsap.fromTo(q, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" });
    }
  }
  function restartAuto() {
    clearInterval(qTimer);
    qTimer = setInterval(function () { showQuote(qi + 1); }, 8000);
  }
  if (quotes.length && prevBtn && nextBtn) {
    prevBtn.addEventListener("click", function () { showQuote(qi - 1); restartAuto(); });
    nextBtn.addEventListener("click", function () { showQuote(qi + 1); restartAuto(); });
    if (!prefersReduced) restartAuto();
  }

  /* ---------- Appointment form (Formspree-ready) ---------- */
  var form = document.getElementById("appointmentForm");
  var success = document.getElementById("formSuccess");

  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) { form.reportValidity(); return; }

    var done = function () {
      success.classList.add("is-visible");
      form.reset();
      setTimeout(function () { success.classList.remove("is-visible"); }, 9000);
    };

    // Until a real Formspree endpoint is set, demonstrate the success state.
    if (form.action.indexOf("YOUR_FORM_ID") !== -1) {
      setTimeout(done, 600);
      return;
    }
    fetch(form.action, {
      method: "POST",
      body: new FormData(form),
      headers: { "Accept": "application/json" }
    }).then(function (res) {
      if (res.ok) done();
      else form.submit(); // last-resort native POST
    }).catch(function () { form.submit(); });
  });

  /* ---------- Footer: year + back to top ---------- */
  document.getElementById("footerYear").textContent = new Date().getFullYear();
  document.getElementById("toTop").addEventListener("click", function () {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
})();
