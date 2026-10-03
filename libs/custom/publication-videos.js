const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

document.querySelectorAll(".publication-video").forEach((video) => {
  const button = video.parentElement.querySelector(".video-toggle");
  let visible = false;
  let userPaused = false;
  let manuallyStarted = false;

  video.defaultPlaybackRate = video.playbackRate = Number(video.dataset.playbackRate) || 1;
  video.controls = false;
  button.hidden = false;

  const syncButton = () => {
    const label = `${video.paused ? "Play" : "Pause"} ${video.dataset.previewName} preview`;
    button.setAttribute("aria-label", label);
    button.title = label;
    button.querySelector("i").className = `fa fa-${video.paused ? "play" : "pause"}`;
  };

  const updatePlayback = () => {
    if (visible && !userPaused && !document.hidden && (!reducedMotion.matches || manuallyStarted)) {
      video.play().catch(syncButton);
    } else {
      video.pause();
    }
  };

  button.addEventListener("click", () => {
    userPaused = !video.paused;
    manuallyStarted = !userPaused;
    updatePlayback();
  });
  video.addEventListener("play", syncButton);
  video.addEventListener("pause", syncButton);
  document.addEventListener("visibilitychange", updatePlayback);
  reducedMotion.addEventListener("change", () => {
    manuallyStarted = false;
    updatePlayback();
  });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting && entry.intersectionRatio >= 0.15;
    updatePlayback();
  }, { threshold: 0.15 }).observe(video);
  syncButton();
});
