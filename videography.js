
/* =========================================
   NGABI EVENTS — 20 REEL CAROUSEL
   Videos: videos/reel-01.mp4 to reel-20.mp4
   Posters: images/videography/reel-01.jpg to reel-20.jpg
========================================= */

(() => {
  "use strict";

  const reelData = [
    { title: "A Story Worth Remembering", category: "WEDDINGS", description: "Every moment deserves to become a memory.", caption: "A celebration of love, beautifully told." },
    { title: "The Art of Forever", category: "WEDDINGS", description: "Two lives. One extraordinary beginning.", caption: "For the moments that last a lifetime." },
    { title: "Made for the Moment", category: "CELEBRATIONS", description: "The energy. The people. The feeling.", caption: "Some moments are simply unforgettable." },
    { title: "An Evening in Gold", category: "EVENT FILMS", description: "An atmosphere you can feel long after.", caption: "A night worth reliving." },
    { title: "Love in Every Frame", category: "WEDDINGS", description: "The little details make the biggest memories.", caption: "The beauty is in every detail." },
    { title: "The Grand Entrance", category: "CELEBRATIONS", description: "Make an entrance. Leave a memory.", caption: "Every entrance tells a story." },
    { title: "A Day Like No Other", category: "EVENT FILMS", description: "Real moments, captured with intention.", caption: "Your day, through our lens." },
    { title: "The Beautiful Details", category: "EDITORIAL", description: "A closer look at what makes it special.", caption: "The details deserve their own story." },
    { title: "The Celebration Edit", category: "CELEBRATIONS", description: "Every smile. Every dance. Every second.", caption: "Feel the celebration all over again." },
    { title: "Beyond the Ordinary", category: "BRAND FILMS", description: "A distinctive vision deserves its own film.", caption: "For brands with a story to tell." },
    { title: "The First Look", category: "WEDDINGS", description: "That one moment when everything changes.", caption: "Some reactions say it all." },
    { title: "Night in Motion", category: "EVENT FILMS", description: "An electric atmosphere, frame by frame.", caption: "When the night comes alive." },
    { title: "The People We Love", category: "CELEBRATIONS", description: "The best memories are made together.", caption: "It always comes back to the people." },
    { title: "Quietly Extraordinary", category: "EDITORIAL", description: "Understated moments. Unforgettable images.", caption: "A little restraint. A lot of feeling." },
    { title: "A Legacy in Motion", category: "BRAND FILMS", description: "Stories that move people forward.", caption: "Make your story mean something." },
    { title: "The Wedding Afterglow", category: "WEDDINGS", description: "The feeling you wish you could keep forever.", caption: "Hold on to the feeling." },
    { title: "Every Second Counts", category: "EVENT FILMS", description: "The moments between the big moments.", caption: "Nothing worth remembering is ordinary." },
    { title: "A Little More Magic", category: "CELEBRATIONS", description: "A little wonder goes a long way.", caption: "Made to be felt, not just seen." },
    { title: "The Signature Film", category: "BRAND FILMS", description: "A visual identity with a point of view.", caption: "Your vision. Our craft." },
    { title: "Forever Starts Here", category: "WEDDINGS", description: "One final frame. A thousand memories.", caption: "Let the story begin." }
  ];

  const $ = (id) => document.getElementById(id);

  const video = $("featuredVideo");
  const featuredReel = $("featuredReel");
  const playButton = $("playToggle");
  const soundButton = $("soundToggle");
  const previousButton = $("previousReel");
  const nextButton = $("nextReel");
  const reelRail = $("reelRail");
  const currentNumber = $("currentReelNumber");
  const totalNumber = $("totalReelNumber");
  const videoIndex = $("videoIndex");
  const featuredTitle = $("featuredTitle");
  const featuredCategory = $("featuredCategory");
  const featuredDescription = $("featuredDescription");
  const reelCaption = $("reelCaption");
  const videoProgress = $("videoProgress");
  const reelStage = $("reelStage");

  if (
    !video || !featuredReel || !playButton || !soundButton ||
    !previousButton || !nextButton || !reelRail
  ) {
    console.error(
      "Ngabi Events: required player elements are missing. Check the IDs in videography.html."
    );
    return;
  }

  let activeIndex = 0;
  let touchStartX = 0;
  let touchStartY = 0;
  let changeTimer = null;

  totalNumber.textContent = String(reelData.length).padStart(2, "0");

  // Build the 20 thumbnail buttons.
  reelData.forEach((reel, index) => {
    const number = String(index + 1).padStart(2, "0");

    const button = document.createElement("button");
    button.type = "button";
    button.className = "reel-thumb";
    button.setAttribute("aria-label", `Play reel ${number}: ${reel.title}`);
    button.setAttribute("aria-pressed", "false");
    button.dataset.index = String(index);

    const imageWrap = document.createElement("span");
    imageWrap.className = "reel-thumb-image";

    const image = document.createElement("img");
    image.src = `images/videography/reel-${number}.jpg`;
    image.alt = "";
    image.loading = index < 5 ? "eager" : "lazy";
    image.decoding = "async";

    image.addEventListener("error", () => {
      image.style.display = "none";
    }, { once: true });

    const badge = document.createElement("span");
    badge.className = "thumb-play";
    badge.setAttribute("aria-hidden", "true");
    badge.textContent = "▶";

    imageWrap.append(image, badge);

    const info = document.createElement("span");
    info.className = "thumb-info";

    const title = document.createElement("span");
    title.className = "thumb-title";
    title.textContent = reel.title;

    const numberLabel = document.createElement("span");
    numberLabel.className = "thumb-number";
    numberLabel.textContent = number;

    info.append(title, numberLabel);
    button.append(imageWrap, info);

    button.addEventListener("click", () => {
      selectReel(index, true);
    });

    reelRail.appendChild(button);
  });

  const thumbnails = Array.from(
    reelRail.querySelectorAll(".reel-thumb")
  );

  function updatePlayButton() {
    const playing = !video.paused && !video.ended;

    featuredReel.classList.toggle("is-playing", playing);
    playButton.setAttribute(
      "aria-label",
      playing ? "Pause featured film" : "Play featured film"
    );
  }

  function showPlaybackError(error) {
    console.error("Ngabi Events video playback failed:", error);
    console.error("Video URL:", video.currentSrc || video.src);
    console.error("Video error code:", video.error?.code);
    console.error("Video error message:", video.error?.message);

    updatePlayButton();
  }

  async function playVideo() {
    try {
      if (!video.getAttribute("src")) {
        video.src = "videos/reel-01.mp4";
        video.load();
      }

      await video.play();
    } catch (error) {
      showPlaybackError(error);
    }
  }

  function pauseVideo() {
    video.pause();
  }

  async function togglePlayback() {
    if (video.paused || video.ended) {
      await playVideo();
    } else {
      pauseVideo();
    }
  }

  function selectReel(index, autoplay = true) {
    const nextIndex =
      (index + reelData.length) % reelData.length;

    activeIndex = nextIndex;

    const reel = reelData[nextIndex];
    const number = String(nextIndex + 1).padStart(2, "0");
    const videoPath = `videos/reel-${number}.mp4`;
    const posterPath = `images/videography/reel-${number}.jpg`;

    // Stop the current film and load the selected one.
    video.pause();
    featuredReel.classList.remove("is-playing", "is-changing");
    featuredReel.classList.add("is-changing");

    video.src = videoPath;
    video.poster = posterPath;
    video.load();

    currentNumber.textContent = number;
    videoIndex.textContent = `FILM ${number}`;
    featuredTitle.textContent = reel.title;
    featuredCategory.textContent = reel.category;
    featuredDescription.textContent = reel.description;
    reelCaption.textContent = reel.caption;

    videoProgress.style.width = "0%";

    thumbnails.forEach((button, buttonIndex) => {
      const selected = buttonIndex === nextIndex;
      button.classList.toggle("is-active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });

    thumbnails[nextIndex]?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "nearest",
      inline: "center"
    });

    playButton.setAttribute("aria-label", "Play featured film");

    if (changeTimer !== null) {
      window.clearTimeout(changeTimer);
    }

    changeTimer = window.setTimeout(() => {
      featuredReel.classList.remove("is-changing");
      changeTimer = null;
    }, 360);

    if (autoplay) {
      // Report errors instead of silently swallowing them.
      playVideo();
    }
  }

  function toggleSound() {
    video.muted = !video.muted;
    updateSoundButton();
  }

  function updateSoundButton() {
    soundButton.classList.toggle("is-muted", video.muted);
    soundButton.setAttribute(
      "aria-label",
      video.muted ? "Turn sound on" : "Mute sound"
    );
  }

  function updateProgress() {
    if (Number.isFinite(video.duration) && video.duration > 0) {
      const percentage = (video.currentTime / video.duration) * 100;
      videoProgress.style.width = `${Math.min(100, percentage)}%`;
    } else {
      videoProgress.style.width = "0%";
    }
  }

  // Main playback and sound controls.
  playButton.addEventListener("click", togglePlayback);
  soundButton.addEventListener("click", toggleSound);

  previousButton.addEventListener("click", () => {
    selectReel(activeIndex - 1, true);
  });

  nextButton.addEventListener("click", () => {
    selectReel(activeIndex + 1, true);
  });

  // Keep the interface synchronized with the video player.
  video.addEventListener("play", updatePlayButton);
  video.addEventListener("pause", updatePlayButton);
  video.addEventListener("ended", () => {
    updatePlayButton();
    videoProgress.style.width = "100%";
  });

  video.addEventListener("timeupdate", updateProgress);
  video.addEventListener("durationchange", updateProgress);
  video.addEventListener("volumechange", updateSoundButton);

  video.addEventListener("error", () => {
    const error = video.error;

    console.error("Ngabi Events could not load the video:", {
      url: video.currentSrc || video.src,
      code: error?.code,
      message: error?.message
    });
  });

  video.addEventListener("loadedmetadata", () => {
    console.info("Ngabi Events video loaded:", video.currentSrc);
  });

  // Keyboard navigation.
  document.addEventListener("keydown", (event) => {
    const target = event.target;
    const tag = target?.tagName?.toLowerCase() || "";

    if (
      event.altKey || event.ctrlKey || event.metaKey ||
      tag === "input" || tag === "textarea" || tag === "select"
    ) {
      return;
    }

    if (event.key === "ArrowLeft") {
      event.preventDefault();
      selectReel(activeIndex - 1, true);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      selectReel(activeIndex + 1, true);
    } else if (
      event.code === "Space" &&
      tag !== "button" && tag !== "a"
    ) {
      event.preventDefault();
      togglePlayback();
    }
  });

  // Touch swipe navigation.
  if (reelStage) {
    reelStage.addEventListener("touchstart", (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    }, { passive: true });

    reelStage.addEventListener("touchend", (event) => {
      const touch = event.changedTouches[0];
      const dx = touch.clientX - touchStartX;
      const dy = touch.clientY - touchStartY;

      if (Math.abs(dx) < 55 || Math.abs(dx) < Math.abs(dy)) {
        return;
      }

      selectReel(
        dx < 0 ? activeIndex + 1 : activeIndex - 1,
        true
      );
    }, { passive: true });
  }

  // Initial state: load reel one, but do not autoplay.
  video.muted = true;
  updateSoundButton();
  selectReel(0, false);

})();
