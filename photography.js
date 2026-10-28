
document.addEventListener("DOMContentLoaded", () => {
  const gallery = document.querySelector(".photo-gallery");
  const lightbox = document.querySelector(".photo-lightbox");

  if (!gallery || !lightbox) return;

  const labels = [
    "PORTRAIT",
    "EDITORIAL",
    "MOMENT",
    "CELEBRATION"
  ];

  let currentIndex = 0;
  let tiles = [];

  function getColumnCount() {
    if (window.innerWidth <= 560) return 2;
    if (window.innerWidth <= 900) return 3;
    return 4;
  }

  function buildGallery() {
    const count = getColumnCount();
    gallery.innerHTML = "";
    gallery.style.display = "grid";
    gallery.style.gridTemplateColumns = `repeat(${count}, minmax(0, 1fr))`;
    gallery.style.gap = "0";

    const columns = [];

    for (let i = 0; i < count; i++) {
      const column = document.createElement("div");
      column.className = "photo-masonry-column";
      column.style.cssText = "display:flex;flex-direction:column;gap:0;min-width:0;";
      gallery.appendChild(column);
      columns.push(column);
    }

    for (let i = 1; i <= 80; i++) {
      const number = String(i).padStart(2, "0");
      const imagePath = `images/photography/photo-${number}.jpg`;

      const tile = document.createElement("button");
      tile.type = "button";
      tile.className = "photo-tile";
      tile.dataset.full = imagePath;
      tile.setAttribute("aria-label", `View photograph ${i}`);

      const img = document.createElement("img");
      img.src = imagePath;
      img.alt = `Ngabi Events photograph ${i}`;
      img.loading = "lazy";
      img.decoding = "async";

      // Masonry heights: alternate portrait, tall, and landscape crops.
      // Replace these files with your actual photos for the best result.
      const patterns = [
        "4 / 5",
        "3 / 5",
        "1 / 1",
        "2 / 3",
        "3 / 4",
        "4 / 5",
        "3 / 5",
        "3 / 4"
      ];

      img.style.aspectRatio = patterns[(i - 1) % patterns.length];
      img.style.width = "100%";
      img.style.height = "auto";
      img.style.objectFit = "cover";
      img.style.display = "block";

      const caption = document.createElement("span");
      caption.textContent = `${number} / ${labels[(i - 1) % labels.length]}`;

      tile.append(img, caption);

      // Put each new photo in the currently shortest column.
      const shortestColumn = columns.reduce((shortest, column) => {
        return column.offsetHeight < shortest.offsetHeight ? column : shortest;
      }, columns[0]);

      shortestColumn.appendChild(tile);
    }

    tiles = [...gallery.querySelectorAll(".photo-tile")];

    tiles.forEach((tile, index) => {
      tile.addEventListener("click", () => openLightbox(index));
    });
  }

  const lightboxImage = lightbox.querySelector("img");
  const counter = lightbox.querySelector(".photo-lightbox-count");
  const closeButton = lightbox.querySelector(".photo-lightbox-close");

  function showImage(index) {
    currentIndex = (index + tiles.length) % tiles.length;

    const tile = tiles[currentIndex];
    lightboxImage.src = tile.dataset.full;
    lightboxImage.alt = tile.querySelector("img").alt;

    counter.textContent =
      `${String(currentIndex + 1).padStart(2, "0")} / ${String(tiles.length).padStart(2, "0")}`;
  }

  function openLightbox(index) {
    showImage(index);
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("photo-lightbox-open");
    closeButton.focus();
  }

  function closeLightbox() {
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("photo-lightbox-open");
  }

  closeButton.addEventListener("click", closeLightbox);

  lightbox.querySelector(".photo-lightbox-prev")
    .addEventListener("click", () => showImage(currentIndex - 1));

  lightbox.querySelector(".photo-lightbox-next")
    .addEventListener("click", () => showImage(currentIndex + 1));

  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) closeLightbox();
  });

  document.addEventListener("keydown", event => {
    if (!lightbox.classList.contains("is-open")) return;
    if (event.key === "Escape") closeLightbox();
    if (event.key === "ArrowLeft") showImage(currentIndex - 1);
    if (event.key === "ArrowRight") showImage(currentIndex + 1);
  });

  buildGallery();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(buildGallery, 200);
  });
});
