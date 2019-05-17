(function (doc, win) {
  let docEl = doc.documentElement,
    resizeEvt = "orientationchange" in window ? "orientationchange" : "resize",
    recalc = function () {
      let clientWidth = docEl.clientWidth;
      if (clientWidth >= 768) {
        clientWidth = 768;
      }
      if (!clientWidth) return;
      docEl.style.fontSize = 100 * (clientWidth / 375) + "px";
    };
  if (!doc.addEventListener) return;
  win.addEventListener(resizeEvt, recalc, false);
  doc.addEventListener("DOMContentLoaded", recalc, false);
})(document, window);
