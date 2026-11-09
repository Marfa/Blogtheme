/**
 * Ghost CDN image failover: try storage.ghost.io first; on error use
 * feeds.themarfa.name/gimg (live VPS path), then img.themarfa.name when DNS exists.
 * Paste into Ghost Admin → Settings → Code injection → Site Footer.
 */
(function () {
  var ORIGIN = "https://storage.ghost.io";
  var PROXY = "https://feeds.themarfa.name/gimg";
  var PROXY_FALLBACK = "https://img.themarfa.name";
  var FLAG = "ghostImgProxyBase";
  var ATTR = "data-ghost-img-proxy";

  /** True when url is prefix plus end or a URL boundary (/ ? #). */
  function urlHasPrefix(url, prefix) {
    if (!url || url.indexOf(prefix) !== 0) return false;
    if (url.length === prefix.length) return true;
    var c = url.charAt(prefix.length);
    return c === "/" || c === "?" || c === "#";
  }

  function srcsetHasPrefix(srcset, prefix) {
    if (!srcset) return false;
    var parts = srcset.split(",");
    for (var i = 0; i < parts.length; i++) {
      var u = parts[i].trim().split(/\s+/)[0];
      if (urlHasPrefix(u, prefix)) return true;
    }
    return false;
  }

  function getActiveProxy() {
    try {
      var v = sessionStorage.getItem(FLAG);
      if (v === PROXY || v === PROXY_FALLBACK) return v;
    } catch (e) {
      /* ignore */
    }
    return null;
  }

  function setActiveProxy(base) {
    try {
      sessionStorage.setItem(FLAG, base);
    } catch (e) {
      /* ignore */
    }
  }

  function stripKnownProxy(url) {
    if (urlHasPrefix(url, PROXY_FALLBACK)) return ORIGIN + url.slice(PROXY_FALLBACK.length);
    if (urlHasPrefix(url, PROXY)) return ORIGIN + url.slice(PROXY.length);
    return url;
  }

  function toProxy(url, base) {
    if (!url) return url;
    var originUrl = stripKnownProxy(url);
    if (!urlHasPrefix(originUrl, ORIGIN)) return url;
    return base + originUrl.slice(ORIGIN.length);
  }

  function rewriteSrcset(srcset, base) {
    if (!srcset) return srcset;
    return srcset
      .split(",")
      .map(function (part) {
        var bits = part.trim().split(/\s+/);
        if (!bits.length) return part;
        bits[0] = toProxy(bits[0], base);
        return bits.join(" ");
      })
      .join(", ");
  }

  function applyProxyToImg(img, base) {
    if (!img) return;
    base = base || getActiveProxy();
    if (!base) return;
    var src = img.getAttribute("src") || "";
    var srcset = img.getAttribute("srcset") || "";
    var current = img.currentSrc || src;
    var involved =
      urlHasPrefix(current, ORIGIN) ||
      urlHasPrefix(src, ORIGIN) ||
      srcsetHasPrefix(srcset, ORIGIN) ||
      urlHasPrefix(current, PROXY) ||
      urlHasPrefix(src, PROXY) ||
      urlHasPrefix(current, PROXY_FALLBACK) ||
      urlHasPrefix(src, PROXY_FALLBACK) ||
      srcsetHasPrefix(srcset, PROXY) ||
      srcsetHasPrefix(srcset, PROXY_FALLBACK);
    if (!involved) return;
    img.setAttribute(ATTR, base);
    if (src) img.setAttribute("src", toProxy(src, base));
    if (srcset) img.setAttribute("srcset", rewriteSrcset(srcset, base));
  }

  function applyProxyToSource(el, base) {
    if (!el) return;
    base = base || getActiveProxy();
    if (!base) return;
    var srcset = el.getAttribute("srcset") || "";
    if (
      !srcsetHasPrefix(srcset, ORIGIN) &&
      !srcsetHasPrefix(srcset, PROXY) &&
      !srcsetHasPrefix(srcset, PROXY_FALLBACK)
    ) {
      return;
    }
    el.setAttribute(ATTR, base);
    el.setAttribute("srcset", rewriteSrcset(srcset, base));
  }

  function rewriteAll(base) {
    base = base || getActiveProxy();
    if (!base) return;
    var imgs = document.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) applyProxyToImg(imgs[i], base);
    var sources = document.querySelectorAll("source[srcset]");
    for (var j = 0; j < sources.length; j++) applyProxyToSource(sources[j], base);
  }

  function onError(ev) {
    var t = ev.target;
    if (!t || t.tagName !== "IMG") return;
    var probe = t.currentSrc || t.getAttribute("src") || "";

    if (urlHasPrefix(probe, ORIGIN)) {
      setActiveProxy(PROXY);
      t.removeAttribute(ATTR);
      applyProxyToImg(t, PROXY);
      rewriteAll(PROXY);
      return;
    }

    if (urlHasPrefix(probe, PROXY) && !urlHasPrefix(probe, PROXY_FALLBACK)) {
      setActiveProxy(PROXY_FALLBACK);
      t.removeAttribute(ATTR);
      applyProxyToImg(t, PROXY_FALLBACK);
      rewriteAll(PROXY_FALLBACK);
    }
  }

  document.addEventListener("error", onError, true);

  var existing = getActiveProxy();
  if (existing) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", function () {
        rewriteAll(existing);
      });
    } else {
      rewriteAll(existing);
    }
  }

  if (typeof MutationObserver !== "undefined") {
    var obs = new MutationObserver(function (mutations) {
      var base = getActiveProxy();
      if (!base) return;
      for (var i = 0; i < mutations.length; i++) {
        var nodes = mutations[i].addedNodes;
        for (var j = 0; j < nodes.length; j++) {
          var n = nodes[j];
          if (n.nodeType !== 1) continue;
          if (n.tagName === "IMG") applyProxyToImg(n, base);
          if (n.tagName === "SOURCE") applyProxyToSource(n, base);
          if (n.querySelectorAll) {
            var imgs = n.querySelectorAll("img");
            for (var k = 0; k < imgs.length; k++) applyProxyToImg(imgs[k], base);
            var sources = n.querySelectorAll("source[srcset]");
            for (var m = 0; m < sources.length; m++) applyProxyToSource(sources[m], base);
          }
        }
      }
    });
    obs.observe(document.documentElement, { childList: true, subtree: true });
  }
})();
