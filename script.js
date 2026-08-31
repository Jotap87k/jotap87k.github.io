(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Ano no rodapé
  --------------------------------------------------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------------------------------------
     Marca a página como carregada (dispara animação de entrada da nav)
  --------------------------------------------------------- */
  window.addEventListener("load", () => {
    document.body.classList.add("loaded");
  });

  /* ---------------------------------------------------------
     Nav: fundo translúcido/blur ao rolar
  --------------------------------------------------------- */
  const navWrap = document.querySelector(".nav-wrap");
  const onScrollNav = () => {
    navWrap.classList.toggle("is-scrolled", window.scrollY > 24);
  };
  onScrollNav();
  window.addEventListener("scroll", onScrollNav, { passive: true });

  /* ---------------------------------------------------------
     Barra de progresso de leitura
  --------------------------------------------------------- */
  const progressBar = document.getElementById("scrollProgress");
  const onScrollProgress = () => {
    const doc = document.documentElement;
    const scrollTop = doc.scrollTop || document.body.scrollTop;
    const scrollHeight = (doc.scrollHeight || document.body.scrollHeight) - doc.clientHeight;
    const pct = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    progressBar.style.width = pct + "%";
  };
  onScrollProgress();
  window.addEventListener("scroll", onScrollProgress, { passive: true });

  /* ---------------------------------------------------------
     Menu mobile
  --------------------------------------------------------- */
  const navToggle = document.getElementById("navToggle");
  const mobileMenu = document.getElementById("mobileMenu");

  const closeMobileMenu = () => {
    navToggle.setAttribute("aria-expanded", "false");
    mobileMenu.classList.remove("is-open");
    document.body.style.overflow = "";
  };

  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    mobileMenu.classList.toggle("is-open", !isOpen);
    document.body.style.overflow = !isOpen ? "hidden" : "";
  });

  mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMobileMenu));

  /* ---------------------------------------------------------
     Scroll reveal (IntersectionObserver) com stagger por seção
  --------------------------------------------------------- */
  const revealEls = document.querySelectorAll("[data-reveal]");

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const groups = new Map();
    revealEls.forEach((el) => {
      const section = el.closest("section") || document.body;
      if (!groups.has(section)) groups.set(section, []);
      groups.get(section).push(el);
    });

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          const section = el.closest("section") || document.body;
          const siblings = groups.get(section) || [el];
          const index = siblings.indexOf(el);
          const delay = Math.min(index, 6) * 70;
          setTimeout(() => el.classList.add("is-visible"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
    );

    revealEls.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     Contadores numéricos (stats)
  --------------------------------------------------------- */
  const counters = document.querySelectorAll("[data-counter]");
  const animateCounter = (el) => {
    const target = parseInt(el.dataset.counter, 10);
    if (Number.isNaN(target)) return;
    if (prefersReducedMotion) {
      el.textContent = target;
      return;
    }
    const duration = 900;
    const start = performance.now();
    const startVal = 0;
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = Math.round(startVal + (target - startVal) * eased);
      if (t < 1) requestAnimationFrame(step);
      else el.textContent = target;
    };
    requestAnimationFrame(step);
  };

  const counterIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterIO.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => counterIO.observe(el));

  /* ---------------------------------------------------------
     Efeito de digitação no mini card de código do Hero
  --------------------------------------------------------- */
  const typeCodeEl = document.getElementById("typeCode");
  if (typeCodeEl) {
    const lines = [
      { text: "SELECT nome, foco", cls: "" },
      { text: "FROM candidato", cls: "" },
      { text: "WHERE stack IN ('Python','SQL','Power BI')", cls: "" },
      { text: "  AND objetivo = 'estágio em dados';", cls: "" },
    ];
    let started = false;

    const typeLines = () => {
      if (started) return;
      started = true;

      if (prefersReducedMotion) {
        typeCodeEl.textContent = lines.map((l) => l.text).join("\n");
        return;
      }

      let li = 0, ci = 0;
      let buffer = "";
      const cursor = '<span class="cursor-blink"></span>';

      const tick = () => {
        if (li >= lines.length) {
          typeCodeEl.innerHTML = buffer + cursor;
          return;
        }
        const line = lines[li].text;
        if (ci < line.length) {
          ci++;
          typeCodeEl.innerHTML = buffer + line.slice(0, ci) + cursor;
          setTimeout(tick, 18 + Math.random() * 22);
        } else {
          buffer += line + "\n";
          li++;
          ci = 0;
          setTimeout(tick, 160);
        }
      };
      tick();
    };

    const codeIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            typeLines();
            codeIO.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    codeIO.observe(document.querySelector(".data-card"));
  }

  /* ---------------------------------------------------------
     Cursor customizado (somente desktop, com hover reagindo)
  --------------------------------------------------------- */
  const isFinePointer = window.matchMedia("(pointer: fine)").matches;
  if (isFinePointer && !prefersReducedMotion) {
    const dot = document.getElementById("cursorDot");
    const ring = document.getElementById("cursorRing");
    let ringX = window.innerWidth / 2, ringY = window.innerHeight / 2;
    let mouseX = ringX, mouseY = ringY;
    let activated = false;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = mouseX + "px";
      dot.style.top = mouseY + "px";
      if (!activated) {
        document.body.classList.add("cursor-ready");
        activated = true;
      }
    });

    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
      ring.style.left = ringX + "px";
      ring.style.top = ringY + "px";
      requestAnimationFrame(animateRing);
    };
    animateRing();

    const hoverables = document.querySelectorAll("a, button, .project-card, .service-card");
    hoverables.forEach((el) => {
      el.addEventListener("mouseenter", () => ring.classList.add("is-hover"));
      el.addEventListener("mouseleave", () => ring.classList.remove("is-hover"));
    });
  }

  /* ---------------------------------------------------------
     Botões magnéticos (leve atração ao cursor)
  --------------------------------------------------------- */
  if (isFinePointer && !prefersReducedMotion) {
    document.querySelectorAll(".magnetic").forEach((btn) => {
      btn.addEventListener("mousemove", (e) => {
        const rect = btn.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        btn.style.transform = `translate(${x * 0.18}px, ${y * 0.35}px)`;
      });
      btn.addEventListener("mouseleave", () => {
        btn.style.transform = "";
      });
    });
  }

  /* ---------------------------------------------------------
     Fecha o menu mobile com Esc
  --------------------------------------------------------- */
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeMobileMenu();
  });
})();
