/* ================================================
   PORTFOLIO - GAURAV MAHESHWARI
   JavaScript - Animations & Interactions
   ================================================ */

document.addEventListener("DOMContentLoaded", () => {
  // ---------- Preloader ----------
  const preloader = document.getElementById("preloader");
  window.addEventListener("load", () => {
    setTimeout(() => preloader.classList.add("hidden"), 600);
  });

  // ---------- Cursor Glow ----------
  const cursorGlow = document.getElementById("cursorGlow");
  let mouseX = 0,
    mouseY = 0;
  let glowX = 0,
    glowY = 0;

  document.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animateGlow() {
    glowX += (mouseX - glowX) * 0.08;
    glowY += (mouseY - glowY) * 0.08;
    cursorGlow.style.left = glowX + "px";
    cursorGlow.style.top = glowY + "px";
    requestAnimationFrame(animateGlow);
  }

  if (window.innerWidth > 768) {
    animateGlow();
  }

  // ---------- Particle Network Canvas ----------
  const canvas = document.getElementById("particleCanvas");
  const ctx = canvas.getContext("2d");
  let particles = [];
  let animationId;

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  class Particle {
    constructor() {
      this.reset();
    }

    reset() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 2 + 0.5;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;
      this.opacity = Math.random() * 0.5 + 0.1;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;

      if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
      if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(100, 255, 218, ${this.opacity})`;
      ctx.fill();
    }
  }

  function initParticles() {
    const count = Math.min(
      80,
      Math.floor((canvas.width * canvas.height) / 15000),
    );
    particles = [];
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }
  }

  function connectParticles() {
    const maxDist = 150;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDist) {
          const opacity = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(100, 255, 218, ${opacity})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.update();
      p.draw();
    });
    connectParticles();
    animationId = requestAnimationFrame(animateParticles);
  }

  initParticles();
  animateParticles();

  // Pause particles when hero is not visible
  const heroSection = document.getElementById("hero");
  const heroObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          cancelAnimationFrame(animationId);
        } else {
          animateParticles();
        }
      });
    },
    { threshold: 0.1 },
  );

  heroObserver.observe(heroSection);

  // ---------- Navbar Scroll ----------
  const navbar = document.getElementById("navbar");
  const navLinks = document.querySelectorAll(".nav-link");
  const sections = document.querySelectorAll(".section");

  function handleNavScroll() {
    const scrollY = window.scrollY;

    if (scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Active link
    let current = "";
    sections.forEach((section) => {
      const sectionTop = section.offsetTop - 120;
      if (scrollY >= sectionTop) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach((link) => {
      link.classList.remove("active");
      if (link.getAttribute("href") === "#" + current) {
        link.classList.add("active");
      }
    });
  }

  window.addEventListener("scroll", handleNavScroll);

  // ---------- Mobile Navigation ----------
  const navToggle = document.getElementById("navToggle");
  const navLinksContainer = document.getElementById("navLinks");
  let overlay = document.createElement("div");
  overlay.className = "mobile-nav-overlay";
  document.body.appendChild(overlay);

  function toggleMobileNav() {
    navToggle.classList.toggle("active");
    navLinksContainer.classList.toggle("open");
    overlay.classList.toggle("active");
    document.body.style.overflow = navLinksContainer.classList.contains("open")
      ? "hidden"
      : "";
  }

  navToggle.addEventListener("click", toggleMobileNav);
  overlay.addEventListener("click", toggleMobileNav);

  navLinksContainer.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      if (navLinksContainer.classList.contains("open")) {
        toggleMobileNav();
      }
    });
  });

  // ---------- Scroll Reveal ----------
  const revealElements = document.querySelectorAll(".reveal-up");

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  // ---------- Stat Counter Animation ----------
  const statNumbers = document.querySelectorAll(".stat-number");

  function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(eased * target);

      if (target >= 1000000) {
        element.textContent = formatLargeNumber(current);
      } else {
        element.textContent = current.toLocaleString();
      }

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        if (target >= 1000000) {
          element.textContent = formatLargeNumber(target);
        } else {
          element.textContent = target.toLocaleString();
        }
      }
    }

    requestAnimationFrame(update);
  }

  function formatLargeNumber(num) {
    if (num >= 1000000)
      return (num / 1000000).toFixed(num % 1000000 === 0 ? 0 : 1) + "M";
    if (num >= 1000)
      return (num / 1000).toFixed(num % 1000 === 0 ? 0 : 1) + "K";
    return num.toString();
  }

  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const statElements = entry.target.querySelectorAll(".stat-number");
          statElements.forEach((el) => animateCounter(el));
          statsObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  const heroStats = document.querySelector(".hero-stats");
  if (heroStats) statsObserver.observe(heroStats);

  // ---------- Back to Top ----------
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 500) {
      backToTop.classList.add("visible");
    } else {
      backToTop.classList.remove("visible");
    }
  });

  backToTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  // ---------- Contact Form ----------
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form values
      const name = contactForm.querySelector("#name").value;
      const email = contactForm.querySelector("#email").value;
      const subject = contactForm.querySelector("#subject").value;
      const message = contactForm.querySelector("#message").value;

      // Construct email body with user details
      const emailBody = `Hi Gaurav,\n\n${message}\n\n---\nFrom: ${name}\nReply to: ${email}`;

      // Construct mailto link
      const mailtoLink = `mailto:gaurav23122001@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(emailBody)}`;

      // Open user's email client
      window.location.href = mailtoLink;

      // Optional: Reset form after opening email client
      setTimeout(() => {
        contactForm.reset();
      }, 500);
    });
  }

  // ---------- Smooth Anchor Links ----------
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth" });
      }
    });
  });

  // ---------- Tilt Effect on Project Cards ----------
  const projectCards = document.querySelectorAll(".featured-project");

  projectCards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      if (window.innerWidth < 768) return;
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = (y - centerY) / 40;
      const rotateY = (centerX - x) / 40;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });

    card.addEventListener("mouseleave", () => {
      card.style.transform = "perspective(1000px) rotateX(0) rotateY(0)";
    });
  });

  // ---------- Skill Tags Stagger Animation ----------
  const skillCategories = document.querySelectorAll(".skill-category");

  const skillObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const tags = entry.target.querySelectorAll(".skill-tag");
          tags.forEach((tag, i) => {
            tag.style.opacity = "0";
            tag.style.transform = "translateY(10px)";
            setTimeout(() => {
              tag.style.transition = "all 0.3s ease";
              tag.style.opacity = "1";
              tag.style.transform = "translateY(0)";
            }, i * 60);
          });
          skillObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.3 },
  );

  skillCategories.forEach((cat) => skillObserver.observe(cat));

  // ---------- Navbar hide on scroll down, show on scroll up ----------
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const currentScroll = window.scrollY;

    if (currentScroll > lastScroll && currentScroll > 200) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }

    lastScroll = currentScroll;
  });

  // ---------- Typing Effect for Tagline ----------
  const tagline = document.querySelector(".hero-tagline");
  if (tagline) {
    const originalHTML = tagline.innerHTML;
    // Already rendered, skip typing for better UX on slow connections
  }

  // ---------- Rotating Roles Carousel ----------
  const roleItems = document.querySelectorAll(".role-item");
  if (roleItems.length > 0) {
    let currentRole = 0;
    setInterval(() => {
      roleItems[currentRole].classList.remove("active");
      roleItems[currentRole].classList.add("exit");
      setTimeout(() => {
        roleItems[currentRole].classList.remove("exit");
        currentRole = (currentRole + 1) % roleItems.length;
        roleItems[currentRole].classList.add("active");
      }, 300);
    }, 2500);
  }

  // ---------- Terminal Typing Effect ----------
  const terminalText = document.getElementById("terminalText");
  if (terminalText) {
    const commands = [
      'echo "Building systems that scale"',
      "docker compose up -d --scale api=3",
      "dotnet run --project Microservices.API",
      "kubectl get pods -n production",
      'echo "Scaling to 100M DAU"',
      "git push origin main && az pipelines run",
      "npm run deploy -- --env=production",
    ];
    let cmdIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isPaused = false;

    function typeCommand() {
      const currentCmd = commands[cmdIndex];

      if (!isDeleting && !isPaused) {
        terminalText.textContent = currentCmd.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentCmd.length) {
          isPaused = true;
          setTimeout(() => {
            isPaused = false;
            isDeleting = true;
            typeCommand();
          }, 2000);
          return;
        }
      } else if (isDeleting) {
        terminalText.textContent = currentCmd.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          cmdIndex = (cmdIndex + 1) % commands.length;
        }
      }

      const speed = isDeleting ? 25 : 45;
      setTimeout(typeCommand, speed);
    }

    // Start typing when terminal scrolls into view
    const terminalEl = document.querySelector(".code-terminal");
    if (terminalEl) {
      const terminalObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              typeCommand();
              terminalObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 },
      );
      terminalObserver.observe(terminalEl);
    }
  }

  // ---------- Easter Egg: Konami Code ----------
  let konamiCode = [];
  const konamiSequence = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];

  document.addEventListener("keydown", (e) => {
    konamiCode.push(e.keyCode);
    if (konamiCode.length > konamiSequence.length) {
      konamiCode.shift();
    }
    if (konamiCode.toString() === konamiSequence.toString()) {
      document.body.style.transition = "filter 0.5s";
      document.body.style.filter = "hue-rotate(180deg)";
      setTimeout(() => {
        document.body.style.filter = "";
      }, 3000);
    }
  });
});
