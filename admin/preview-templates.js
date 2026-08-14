/* ==========================================================================
   CUSTOM PREVIEW TEMPLATES
   ==========================================================================
   By default, Decap CMS's preview pane just lists field values as plain
   text — it has no idea what your site's fonts, colors, or layout look
   like. Everything below teaches it to reuse the SAME CSS and (as much as
   possible) the SAME rendering logic as the real pages in this repo, so
   what you see while editing closely matches what a visitor sees.

   This file must be loaded via a <script> tag AFTER the main Decap CMS
   script tag in admin/index.html, since it relies on the global `CMS`
   object that script creates.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Shared preview styling: the same Google Fonts + main.css every real page
   loads, so text, colors, and spacing match without duplicating any CSS
   here. Loaded once; every collection's preview template below uses it.
   -------------------------------------------------------------------------- */
CMS.registerPreviewStyle("https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600&family=Work+Sans:wght@300;400;500;600&display=swap");
CMS.registerPreviewStyle("https://hopegala.bz/assets/css/main.css");

/* Homepage-only styles, copied from the <style> block in index.html
   (these live inline on that page rather than in main.css, so they need
   to be registered here too or the preview would be missing them). */
CMS.registerPreviewStyle(`
  .slider { width: 100%; background-color: #042522; position: relative; overflow: hidden; height: clamp(280px, 35vh, 400px); border-bottom: 2px solid var(--gold); }
  .slider ul { position: relative; list-style: none; display: flex; width: max-content; height: 100%; animation: slide-infinite 90s linear infinite; margin: 0; padding: 0; }
  .slider li { height: 100%; flex: 0 0 auto; }
  .slide-fg { height: 100%; width: auto; display: block; }
  @keyframes slide-infinite { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
  .hero-intro { text-align: center; padding: 60px 24px 30px; max-width: 800px; margin: 0 auto; }
  .hero-intro h1 { font-family: var(--font-display); font-size: clamp(36px, 5vw, 56px); font-weight: 500; color: var(--ink); line-height: 1.1; margin-bottom: 12px; }
  .hero-intro p { color: var(--gold); font-size: 18px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase; }
  .divider { height: 2px; max-width: 100px; margin: 0 auto 50px; background: var(--gold); opacity: 0.8; border-radius: 2px; }
  .story { max-width: 1000px; margin: 0 auto; padding: 0 24px 70px; text-align: center; }
  .story h2 { font-family: var(--font-display); font-size: clamp(30px, 4vw, 40px); font-weight: 500; color: var(--ink); margin-bottom: 30px; }
  .video-wrap { position: relative; width: 100%; padding-bottom: 56.25%; height: 0; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px -10px rgba(0,0,0,0.15); border: 4px solid var(--gold); }
  .video-wrap iframe { position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0; }
  .belize-section { background-color: var(--offwhite); padding: 90px 24px; border-top: 1px solid rgba(0,0,0,0.05); border-bottom: 1px solid rgba(0,0,0,0.05); }
  .container2 { max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; align-items: center; gap: 60px; }
  .map-container { position: relative; }
  .map-container img { width: 100%; height: auto; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.1); object-fit: cover; display: block; }
  .text2 h2 { font-family: var(--font-display); color: var(--ink); font-size: 40px; font-weight: 500; margin-bottom: 24px; }
  .text2 p { font-size: 17px; color: #4a4a4a; margin-bottom: 20px; }
  .text2 p:last-child { margin-bottom: 0; font-weight: 600; color: var(--ink); }
  @media (max-width: 768px) { .container2 { grid-template-columns: 1fr; gap: 40px; } .text2 { text-align: center; } .slider { height: 280px; } }
  /* The preview pane is narrower than a real browser window, so this nudges
     the two-column "Why Belize" section to stack sooner than it would on
     the live site, keeping it readable at typical preview widths. */
  .container2 { grid-template-columns: 1fr; }
  .text2 { text-align: center; }
`);

/* --------------------------------------------------------------------------
   Homepage preview — mirrors index.html's hero, photo slideshow, video,
   and "Why Belize" sections using the exact same HTML structure/classes
   as the live page, fed with your in-progress (unsaved) edits.
   -------------------------------------------------------------------------- */
var HomePreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get("data") ? entry.get("data").toJS() : {};
    // `h` (alias for React.createElement) and `createClass` are globals
    // exposed by the decap-cms.js script tag loaded in index.html.

    var hero = data.hero || {};
    var slides = Array.isArray(data.slideshow_images) ? data.slideshow_images : [];
    var video = data.video || {};
    var whyBelize = data.whyBelize || {};
    var paragraphs = Array.isArray(whyBelize.paragraphs) ? whyBelize.paragraphs : [];

    // getAsset() resolves an image field's value (which may be a path to a
    // file already in the repo, or a freshly-picked file not saved yet) to
    // a URL the preview can actually display.
    function resolveImage(path) {
      if (!path) return "";
      var asset = this.props.getAsset ? this.props.getAsset(path) : null;
      return asset ? asset.toString() : path;
    }
    resolveImage = resolveImage.bind(this);

    var slideNodes = slides.map(function (slide, i) {
      return h("li", { key: i }, h("img", { className: "slide-fg", src: resolveImage(slide.image), alt: "" }));
    });

    var videoSection = video.show === false ? null : h(
      "section",
      { className: "story" },
      h("h2", {}, video.videoSectionHeading || "Watch Our Story"),
      h(
        "div",
        { className: "video-wrap" },
        video.youtubeId
          ? h("iframe", {
              src: "https://www.youtube.com/embed/" + video.youtubeId + "?controls=1&rel=0&modestbranding=1",
              title: "The Belize Project Story",
              allowFullScreen: true,
            })
          : h("div", { style: { padding: "40px", color: "#888" } }, "(No YouTube video ID set yet)")
      )
    );

    var paragraphNodes = paragraphs.map(function (para, i) {
      return h("p", { key: i, className: i === 0 ? "drop-cap" : "" }, para.text || "");
    });

    return h(
      "div",
      {},
      h("div", { className: "slider" }, h("ul", {}, slideNodes)),
      h(
        "div",
        { className: "hero-intro" },
        h("h1", {}, hero.heading || "(Big Title not set)"),
        h("p", {}, hero.subheading || "(Small text not set)")
      ),
      h("div", { className: "divider" }),
      videoSection,
      h(
        "section",
        { className: "belize-section" },
        h(
          "div",
          { className: "container2" },
          h(
            "div",
            { className: "text2" },
            h("h2", {}, whyBelize.whyBelizeSectionHeading || "Why Belize?"),
            paragraphNodes
          )
        )
      )
    );
  },
});

CMS.registerPreviewTemplate("home", HomePreview);
