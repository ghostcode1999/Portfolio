/*******************************************
 * Template Name: Portfolio
 * Updated: May 2024
 * Author: Ghostcode
 * PSD Designer: Codewithsadee
 *******************************************/
//

(function () {
  ("use strict");

  /** Select DOM Elements
   * @description Helper function to select DOM elements
   * @author Naim Zaaraoui
   * @param {string} selector - Element to select
   * @param {boolean} all [false] - Specify whether select all matched elements or only first one
   */
  function select(selector, all = false) {
    selector = selector.trim();
    return all
      ? [...document.querySelectorAll(selector)]
      : document.querySelector(selector);
  }

  /***
   * Attach an event listener to an element
   ***/

  function on(selector, eventType, listener, all = false) {
    let element =
      typeof selector === "string" ? select(selector, all) : selector;
    if (element) {
      all || element.length > 1
        ? element.forEach((ele) => ele.addEventListener(eventType, listener))
        : element.addEventListener(eventType, listener);
    }
  }

  function scrollto(selector) {
    const headerOffset = select("[data-header]").offsetHeight;
    if (selector) {
      window.scrollTo({
        top: selector.offsetTop - headerOffset + 20,
        behavior: "smooth",
      });
    }
  }

  /***
   * Adjust hero section top padding and portfolio items height based on header height
   ***/

  const heroSection = select(".hero");

  function adjustHeroPortfolio() {
    const headerOffset = select("[data-header]").offsetHeight;
    heroSection.style.paddingBlockStart = `${headerOffset + 20}px`;
  }

  adjustHeroPortfolio();
  on(window, "resize", adjustHeroPortfolio);

  const sections = select("[data-section]", true);
  const skillsList = select(".skills-list");
  const skillsBars = select(".skill__progress span", true);

  skillsBars.forEach((bar) => {
    bar.style.width = bar.dataset.progress;
  });

  const intersectionObserver = new IntersectionObserver(
    (entries) => {
      const skillsEntry = entries[0];
      skillsEntry.target.classList.toggle(
        "show-progress",
        skillsEntry.isIntersecting
      );

      if (skillsEntry.isIntersecting) {
        intersectionObserver.unobserve(skillsEntry.target);
      }
    },
    {
      rootMargin: "-100px",
    }
  );

  intersectionObserver.observe(skillsList);

  const sectionsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          console.log(entry.target);
          select("[data-nav-link]", true).forEach((link) =>
            link.classList.remove("is-active")
          );
          select(
            `[data-nav-link][data-scrollto="${entry.target.dataset.section}"]`
          ).classList.add("is-active");
        }
      });
    },
    {
      rootMargin: `-200px`,
    }
  );
  sections.forEach((section) => {
    sectionsObserver.observe(section);
  });


  /***
   * Header
   * Header and back top btn will be active after scrolled down to 100px of screen
   ***/

  const header = select("[data-header]"),
    backTopBtn = select("[data-back-top-btn]");

  const activeEl = function () {
    if (scrollY > 50) {
      header.classList.add("is-active");
      backTopBtn.classList.add("is-active");
    } else {
      header.classList.remove("is-active");
      backTopBtn.classList.remove("is-active");
    }
  };

  activeEl();
  on(window, "scroll", activeEl);

  /***
   * Toggle navbar
   ***/

  const navToggler = select("[data-nav-toggler]");

  on(navToggler, "click", function () {
    this.classList.toggle("is-active");
  });

  /***
   * Scroll to target section when click on a nav link
   ***/

  const scrolltoLinks = select("[data-scrollto]", true);

  on(scrolltoLinks, "click", function (e) {
    const section = `.${this.dataset.scrollto}`;
    navToggler.classList.toggle("is-active");

    e.preventDefault();
    scrollto(select(section));
  });

  /***
   * Back to top button
   ***/
  on(backTopBtn, "click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
})();
