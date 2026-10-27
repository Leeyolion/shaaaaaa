
const menuToggle = document.querySelector(".menu-toggle");
const navOverlay = document.querySelector(".nav-overlay");
const mainNav = document.querySelector(".main-nav");
const navLinks = document.querySelectorAll(".nav-link");

if (menuToggle && navOverlay && mainNav) {
  let isOpen = false;

  function openMenu() {
    if (isOpen) return;

    isOpen = true;

    document.body.classList.add("menu-open");

    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close navigation");

    navOverlay.setAttribute("aria-hidden", "false");
    mainNav.removeAttribute("inert");

    navLinks.forEach((link) => {
      link.removeAttribute("tabindex");
    });
  }

  function closeMenu({ restoreFocus = false } = {}) {
    if (!isOpen) return;

    isOpen = false;

    document.body.classList.remove("menu-open");

    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");

    navOverlay.setAttribute("aria-hidden", "true");
    mainNav.setAttribute("inert", "");

    navLinks.forEach((link) => {
      link.setAttribute("tabindex", "-1");
    });

    if (restoreFocus) {
      menuToggle.focus();
    }
  }

  menuToggle.addEventListener("click", () => {
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      closeMenu();
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) {
      closeMenu({ restoreFocus: true });
    }

    // Keep keyboard focus inside the open navigation.
    if (event.key === "Tab" && isOpen) {
      const focusableItems = [
        ...navLinks,
        menuToggle
      ].filter((item) => !item.hasAttribute("disabled"));

      const firstItem = focusableItems[0];
      const lastItem = focusableItems[focusableItems.length - 1];

      if (event.shiftKey && document.activeElement === firstItem) {
        event.preventDefault();
        lastItem.focus();
      } else if (
        !event.shiftKey &&
        document.activeElement === lastItem
      ) {
        event.preventDefault();
        firstItem.focus();
      }
    }
  });

  // Close the menu when the user clicks outside its panel.
  document.addEventListener("click", (event) => {
    if (!isOpen) return;

    if (
      !navOverlay.contains(event.target) &&
      !menuToggle.contains(event.target)
    ) {
      closeMenu();
    }
  });
}





















































/* =========================================
   NGABI STORY — SCROLL-TRIGGERED TYPING
   ========================================= */

const storySection = document.querySelector(".ngabi-story");
const typingLines = document.querySelectorAll(".typing-line");

if (storySection && typingLines.length) {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  let hasTyped = false;
  let typingTimers = [];

  function createTypingCharacters() {
    typingLines.forEach((line) => {
      const text = line.dataset.text || "";
      line.replaceChildren();

      [...text].forEach((character) => {
        const span = document.createElement("span");
        span.className = "typing-char";

        // Preserve spaces between words.
        span.textContent = character === " " ? "\u00A0" : character;

        line.appendChild(span);
      });
    });
  }

  function startTyping() {
    if (hasTyped) return;
    hasTyped = true;

    createTypingCharacters();

    const characters = [
      ...storySection.querySelectorAll(".typing-char")
    ];

    if (reduceMotion) {
      characters.forEach((character) => {
        character.classList.add("is-visible");
      });
      return;
    }

    characters.forEach((character, index) => {
      const timer = window.setTimeout(() => {
        character.classList.add("is-visible");
      }, index * 32);

      typingTimers.push(timer);
    });
  }

  // Start when the image strip reaches approximately
  // the lower edge of the viewport during the scroll.
  function checkStoryPosition() {
    if (hasTyped) return;

    const rect = storySection.getBoundingClientRect();
    const triggerPoint = window.innerHeight * 0.5;

    if (rect.top <= triggerPoint && rect.bottom > 0) {
      startTyping();
    }
  }

  window.addEventListener("scroll", checkStoryPosition, {
    passive: true
  });

  window.addEventListener("resize", checkStoryPosition);

  // Also handles direct links or a page restored at this section.
  checkStoryPosition();
}























































