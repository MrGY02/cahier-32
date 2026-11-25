(function () {
  var photos = window.PHOTOS || [];
  var box = document.getElementById("lightbox");
  var img = document.getElementById("lightbox-img");
  var dl = document.getElementById("lightbox-download");
  var current = 0;
  if (!box || !photos.length) return;

  function show(i) {
    if (i < 0) i = photos.length - 1;
    if (i >= photos.length) i = 0;
    current = i;
    var p = photos[i];
    img.src = p.web;
    img.alt = p.alt || "";
    dl.href = p.original;
    dl.setAttribute("download", "");
    box.hidden = false;
    document.body.classList.add("lb-open");
    var next = photos[(i + 1) % photos.length];
    var prev = photos[(i - 1 + photos.length) % photos.length];
    preload(next.web);
    preload(prev.web);
  }
  function preload(src) {
    var im = new Image();
    im.src = src;
  }
  function hide() {
    box.hidden = true;
    document.body.classList.remove("lb-open");
    img.src = "";
  }

  document.querySelectorAll("a.tile").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      show(parseInt(a.getAttribute("data-index"), 10) || 0);
    });
  });
  box.querySelector(".lb-close").addEventListener("click", hide);
  box.querySelector(".lb-prev").addEventListener("click", function (e) {
    e.stopPropagation();
    show(current - 1);
  });
  box.querySelector(".lb-next").addEventListener("click", function (e) {
    e.stopPropagation();
    show(current + 1);
  });
  box.addEventListener("click", function (e) {
    if (e.target === box) hide();
  });
  document.addEventListener("keydown", function (e) {
    if (box.hidden) return;
    if (e.key === "Escape") hide();
    if (e.key === "ArrowRight") show(current + 1);
    if (e.key === "ArrowLeft") show(current - 1);
  });

  var startX = null;
  box.addEventListener("touchstart", function (e) {
    if (e.changedTouches && e.changedTouches[0]) startX = e.changedTouches[0].clientX;
  }, { passive: true });
  box.addEventListener("touchend", function (e) {
    if (startX == null || !e.changedTouches || !e.changedTouches[0]) return;
    var dx = e.changedTouches[0].clientX - startX;
    startX = null;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) show(current + 1);
    else show(current - 1);
  }, { passive: true });
})();
