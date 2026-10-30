const sections = [...document.querySelectorAll("main .article-section[id]")];
const sectionLinks = [...document.querySelectorAll('.contents a[href^="#"], .top-nav a[href^="#"]')];
const backToTop = document.querySelector(".back-to-top");
const imageDialog = document.querySelector(".image-dialog");
const dialogImage = imageDialog.querySelector("img");
const dialogCaption = imageDialog.querySelector(".dialog-caption");
const dialogClose = imageDialog.querySelector(".dialog-close");

function setCurrentSection(sectionId) {
  sectionLinks.forEach((link) => {
    if (link.hash === `#${sectionId}`) {
      link.setAttribute("aria-current", "location");
    } else {
      link.removeAttribute("aria-current");
    }
  });
}

if ("IntersectionObserver" in window) {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      const visibleSections = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visibleSections[0]) {
        setCurrentSection(visibleSections[0].target.id);
      }
    },
    {
      rootMargin: "-18% 0px -68% 0px",
      threshold: 0,
    },
  );

  sections.forEach((section) => sectionObserver.observe(section));
} else if (sections.length) {
  setCurrentSection(sections[0].id);
}

function updateBackToTop() {
  backToTop.classList.toggle("is-visible", window.scrollY > 420);
}

window.addEventListener("scroll", updateBackToTop, { passive: true });
updateBackToTop();

backToTop.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.addEventListener("click", (event) => {
  const image = event.target.closest("img[data-lightbox]");
  if (!image) return;

  dialogImage.src = image.currentSrc || image.src;
  dialogImage.alt = image.alt;
  dialogCaption.textContent = image.dataset.caption || image.alt;
  imageDialog.showModal();
});

dialogClose.addEventListener("click", () => imageDialog.close());

imageDialog.addEventListener("click", (event) => {
  if (event.target === imageDialog) imageDialog.close();
});

imageDialog.addEventListener("close", () => {
  dialogImage.removeAttribute("src");
  dialogImage.alt = "";
  dialogCaption.textContent = "";
});
