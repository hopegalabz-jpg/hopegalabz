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
  .map-container { position: relative; text-align: center; }
  .map-container img { max-width: 100%; max-height: 420px; width: auto; height: auto; border-radius: 16px; box-shadow: 0 12px 35px rgba(0,0,0,0.1); display: block; margin: 0 auto; }
  .text2 h2 { font-family: var(--font-display); color: var(--ink); font-size: 40px; font-weight: 500; margin-bottom: 24px; }
  .text2 p { font-size: 17px; color: #4a4a4a; margin-bottom: 20px; }
  .text2 p:last-child { margin-bottom: 0; font-weight: 600; color: var(--ink); }
  @media (max-width: 768px) { .container2 { grid-template-columns: 1fr; gap: 40px; } .text2 { text-align: center; } .slider { height: 280px; } .map-container img { max-height: 280px; } }
  /* The preview pane is narrower than a real browser window, so this nudges
     the two-column "Why Belize" section to stack sooner than it would on
     the live site, keeping it readable at typical preview widths. */
  .container2 { grid-template-columns: 1fr; }
  .text2 { text-align: center; }
`, { raw: true });

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
          // The map graphic is a fixed site image (not a field in this
          // entry — there's no "map photo" box in the editor for it), so
          // it's shown here exactly as it appears on the live page rather
          // than pulled from CMS data. This was missing before, which is
          // why the map never appeared in this preview at all.
          h(
            "div",
            { className: "map-container" },
            h("img", { src: "https://hopegala.bz/assets/images/map.png", alt: "Map of Belize" })
          ),
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

/* ==========================================================================
   MINISTRIES PREVIEW
   ==========================================================================
   Mirrors ministries.html's logo tile grid (first 4 ministries in one row,
   the rest in a second row) plus the alternating white/offwhite write-up
   sections for both ministries and programs.
   ========================================================================== */
var MinistriesPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get("data") ? entry.get("data").toJS() : {};

    function resolveImage(path) {
      if (!path) return "";
      var asset = this.props.getAsset ? this.props.getAsset(path) : null;
      return asset ? asset.toString() : path;
    }
    resolveImage = resolveImage.bind(this);

    var ministries = Array.isArray(data.ministries) ? data.ministries : [];
    var programs = Array.isArray(data.programs) ? data.programs : [];

    function buildParagraphs(body) {
      var paras = (body || "").split(/\n\s*\n/);
      return paras
        .map(function (p) { return p.trim(); })
        .filter(function (p) { return p.length > 0; })
        .map(function (p, i) { return h("p", { key: i }, p); });
    }

    function buildNavTile(ministry, i) {
      return h(
        "a",
        { key: i, className: "ministry-nav-tile" },
        h("img", { src: resolveImage(ministry.logo), alt: (ministry.shortName || "") + " Logo" }),
        h("h4", {}, ministry.shortName || "(Short name not set)")
      );
    }

    function buildSection(item, nameKey, subtitleKey, bgClass, key) {
      return h(
        "section",
        { key: key, className: "ministry-section " + bgClass },
        h(
          "div",
          { className: "ministry-row" },
          h(
            "div",
            { className: "ministry-content" },
            h("h2", {}, item[nameKey] || "(Name not set)"),
            item[subtitleKey]
              ? h(
                  "h4",
                  {
                    style: {
                      color: "var(--gold)",
                      fontWeight: 600,
                      marginTop: "-15px",
                      marginBottom: "15px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      fontSize: "0.9rem",
                    },
                  },
                  item[subtitleKey]
                )
              : null,
            buildParagraphs(item.body)
          )
        )
      );
    }

    var primaryTiles = ministries.slice(0, 4).map(buildNavTile);
    var secondaryTiles = ministries.slice(4).map(function (m, i) {
      return buildNavTile(m, i + 4);
    });

    var ministrySections = ministries.map(function (m, i) {
      return buildSection(m, "ministryName", "ministrySubtitle", i % 2 === 0 ? "bg-white" : "bg-offwhite", "m" + i);
    });

    var programSections = programs.map(function (p, i) {
      return buildSection(p, "programName", "programSubtitle", i % 2 === 0 ? "bg-offwhite" : "bg-white", "p" + i);
    });

    return h(
      "div",
      {},
      h(
        "div",
        { className: "container" },
        h(
          "div",
          { className: "heading", style: { textAlign: "center", marginBottom: "40px", paddingTop: "60px" } },
          h(
            "h3",
            { style: { fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--ink)" } },
            data.pageHeading || "Our Ministries and Programs"
          ),
          h("div", { className: "divider", style: { marginTop: "20px", marginBottom: "40px" } })
        ),
        h("div", { className: "ministry-nav-grid" }, primaryTiles),
        secondaryTiles.length
          ? h(
              "div",
              {
                className: "ministry-nav-grid",
                style: { gridTemplateColumns: "repeat(3, 1fr)", maxWidth: "780px", margin: "30px auto 0" },
              },
              secondaryTiles
            )
          : null
      ),
      ministrySections,
      h(
        "div",
        { className: "container" },
        h(
          "div",
          { className: "heading", style: { textAlign: "center", marginTop: "60px", marginBottom: "40px" } },
          h(
            "h3",
            { style: { fontFamily: "var(--font-display)", fontSize: "3rem", color: "var(--ink)" } },
            data.programsPageHeading || "Our Programs"
          ),
          h("div", { className: "divider", style: { marginTop: "20px", marginBottom: "40px" } })
        )
      ),
      programSections
    );
  },
});

CMS.registerPreviewTemplate("ministries", MinistriesPreview);

/* ==========================================================================
   RESOURCES & DOCUMENTS PREVIEW
   ==========================================================================
   Mirrors resources.html's dark tile grid (one tile per category). The
   live page's click-to-open sidebar isn't reproduced here — it isn't
   needed to check that titles/descriptions/document counts look right.
   ========================================================================== */
CMS.registerPreviewStyle(`
  .resources-hero { text-align: center; padding: 60px 24px 10px; }
  .resources-hero h1 { font-family: var(--font-display); font-size: clamp(34px, 5vw, 50px); font-weight: 500; color: var(--ink); line-height: 1.1; }
  .resources-hero p { max-width: 620px; margin: 20px auto 0; color: #444; font-size: 16px; line-height: 1.7; }
  .resources-section { padding: 20px 24px 80px; }
  .resource-tile-grid { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 25px; }
  .resource-tile { position: relative; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; background: var(--dark-bg); border: 1px solid rgba(212, 175, 55, 0.3); border-radius: 4px; padding: 50px 30px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
  .resource-tile-icon { width: 64px; height: 64px; border-radius: 50%; background: rgba(212, 175, 55, 0.1); color: var(--gold-premium); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
  .resource-tile-icon svg { width: 30px; height: 30px; }
  .resource-tile h3 { font-family: var(--font-display); font-size: 1.4rem; font-weight: 500; color: #ffffff; margin-bottom: 8px; }
  .resource-tile p { font-size: 0.85rem; color: #aaa; line-height: 1.5; max-width: 240px; }
  .resource-tile-count { margin-top: 16px; font-family: var(--font-body); font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; text-transform: uppercase; color: var(--gold-premium); opacity: 0.85; }
`, { raw: true });

var RESOURCE_TILE_ICON_SVG =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  '<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
  '<path d="M15 2v5h5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>' +
  '<path d="M8 13h8M8 17h8M8 9h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>' +
  "</svg>";

var ResourcesPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get("data") ? entry.get("data").toJS() : {};
    var categories = Array.isArray(data.categories) ? data.categories : [];

    var tiles = categories.map(function (category, i) {
      var itemCount = Array.isArray(category.items) ? category.items.length : 0;
      return h(
        "div",
        { key: i, className: "resource-tile" },
        h("div", { className: "resource-tile-icon", dangerouslySetInnerHTML: { __html: RESOURCE_TILE_ICON_SVG } }),
        h("h3", {}, category.title || "(Category title not set)"),
        h("p", {}, category.description || ""),
        h("span", { className: "resource-tile-count" }, itemCount + (itemCount === 1 ? " Document" : " Documents"))
      );
    });

    return h(
      "div",
      {},
      h(
        "section",
        { className: "resources-hero" },
        h(
          "div",
          { className: "container" },
          h("h1", {}, "Resources"),
          h("div", { className: "divider" }),
          h(
            "p",
            {},
            "Brochures, sponsorship materials, and printable letters for The Belize Project and the Hope Gala. Tap a category below to browse and preview."
          )
        )
      ),
      h(
        "section",
        { className: "resources-section" },
        h("div", { className: "container" }, h("div", { className: "resource-tile-grid" }, tiles))
      )
    );
  },
});

CMS.registerPreviewTemplate("resources", ResourcesPreview);

/* ==========================================================================
   GALA PHOTO GALLERIES PREVIEW
   ==========================================================================
   Mirrors gallery.html's album tile grid (cover photo + year + type).
   The click-to-open lightbox sidebar isn't reproduced — the tiles alone
   are enough to check that cover photos and album names look right.
   ========================================================================== */
CMS.registerPreviewStyle(`
  .album-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 25px; padding: 20px 0 40px 0; }
  .album-tile { position: relative; background: var(--dark-bg); border: 1px solid rgba(212, 175, 55, 0.3); padding: 8px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.4); }
  .album-cover-wrapper { width: 100%; height: 240px; overflow: hidden; position: relative; }
  .album-cover-wrapper img { width: 100%; height: 100%; object-fit: cover; }
  .album-info { padding: 12px 5px 3px; text-align: center; }
  .album-info h4 { margin: 0; font-size: 1.15rem; color: #ffffff; font-family: var(--font-display); }
  .album-info p { margin: 3px 0 0; font-size: 0.8rem; color: #aaa; text-transform: uppercase; letter-spacing: 1.5px; }
`, { raw: true });

var GalleryPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get("data") ? entry.get("data").toJS() : {};

    function resolveImage(path) {
      if (!path) return "";
      var asset = this.props.getAsset ? this.props.getAsset(path) : null;
      return asset ? asset.toString() : path;
    }
    resolveImage = resolveImage.bind(this);

    var albums = Array.isArray(data.albums) ? data.albums : [];

    var tiles = albums.map(function (album, i) {
      return h(
        "div",
        { key: i, className: "album-tile" },
        h(
          "div",
          { className: "album-cover-wrapper" },
          h("img", { src: resolveImage(album.coverImage), alt: (album.year || "") + " Cover" })
        ),
        h(
          "div",
          { className: "album-info" },
          h("h4", {}, album.year || "(Album name not set)"),
          h("p", {}, album.category === "ministry" ? "Ministries" : "Fundraising Event")
        )
      );
    });

    return h(
      "div",
      { className: "container" },
      h(
        "div",
        { className: "heading", style: { textAlign: "center", marginBottom: "40px", paddingTop: "40px" } },
        h(
          "h3",
          { style: { fontFamily: "var(--font-display)", fontSize: "2.5rem", color: "var(--ink)" } },
          "The Belize Project ",
          h("span", { style: { color: "var(--gold)" } }, "Media Galleries")
        )
      ),
      h("div", { className: "album-grid" }, tiles)
    );
  },
});

CMS.registerPreviewTemplate("gallery", GalleryPreview);

/* ==========================================================================
   GALA EVENT PAGE PREVIEW
   ==========================================================================
   Mirrors gala.html's hero, countdown, "Purpose & Praise" section (with
   the circular photo cluster — these 6 photos are fixed site images, not
   edited here, so they're shown as-is), sponsorship tier cards,
   "Faithful Stewardship" section, and the pledge/donation details. The
   pledge card is shown inline (rather than as a click-to-open popup, like
   it works on the live site) purely so it's visible without needing to
   click anything in the preview pane.
   ========================================================================== */
CMS.registerPreviewStyle(`
  .flip-countdown { position: relative; width: 100%; max-width: 800px; margin: 0 auto 50px; display: flex; justify-content: center; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
  .flip-unit { display: flex; flex-direction: column; align-items: center; }
  .flip-unit-label { font-family: var(--font-body); font-size: 12px; font-weight: 700; letter-spacing: 0.25em; text-transform: uppercase; color: var(--gold); margin-bottom: 12px; }
  .flip-card { position: relative; width: 100px; height: 100px; border-radius: 12px; background: linear-gradient(135deg, #c7973f 0%, #d4af37 100%); padding: 3px; box-shadow: 0 15px 35px rgba(0,0,0,0.35); }
  .flip-card-face { position: relative; width: 100%; height: 100%; border-radius: 10px; background: radial-gradient(circle at bottom right, #02201d 0%, #05403a 60%, #08554d 100%); display: flex; align-items: center; justify-content: center; }
  .flip-card-number { font-family: var(--font-display); font-size: 46px; font-weight: 600; color: var(--gold-premium); text-shadow: 0 2px 8px rgba(0,0,0,0.5); }

  .bubble-cluster { position: relative; width: 100%; max-width: 600px; aspect-ratio: 1 / 1; margin: 0 auto; }
  .bubble { position: absolute; border-radius: 50%; border: 5px solid #ffffff; box-shadow: 0 10px 20px rgba(0,0,0,0.12); overflow: hidden; background-color: var(--offwhite); aspect-ratio: 1 / 1; transform: translate(-50%, -50%); }
  .bubble img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .bubble-3 { width: 50%; top: 50%; left: 84%; z-index: 5; }
  .bubble-1 { width: 38%; top: 16.7%; left: 61%; z-index: 4; }
  .bubble-4 { width: 44%; top: 29.4%; left: 22%; z-index: 3; }
  .bubble-5 { width: 44%; top: 70.6%; left: 22%; z-index: 2; }
  .bubble-2 { width: 38%; top: 83.3%; left: 61%; z-index: 1; }
  .bubble-6 { width: 44%; top: 50%; left: 50%; z-index: 6; }

  .sponsor-inline-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 60px; width: 100%; max-width: 1150px; margin: 0 auto; text-align: left; }
  .sponsor-inline-card { background: #ffffff; border-radius: 12px; padding: 25px 20px; box-shadow: 0 10px 25px rgba(0,0,0,0.08); border-top: 4px solid #c7973f; display: flex; flex-direction: column; }
  .sponsor-inline-header { display: flex; align-items: center; gap: 10px; margin-bottom: 10px; }
  .sponsor-inline-badge { width: 28px; height: 28px; border-radius: 50%; background: linear-gradient(135deg, #f9f295, #d4af37); box-shadow: inset 0 0 8px rgba(255,255,255,0.8), 0 2px 5px rgba(0,0,0,0.2); }
  .sponsor-inline-header h3 { margin: 0; font-family: var(--font-display); font-size: 1.1rem; color: #1a1a1a; text-transform: uppercase; letter-spacing: 0.5px; }
  .sponsor-inline-price { font-family: var(--font-display); font-size: 2rem; font-weight: 600; color: #1a1a1a; margin-bottom: 15px; line-height: 1; }
  .sponsor-inline-list { list-style: none; padding: 0; margin: 0; }
  .sponsor-inline-list li { font-family: var(--font-body); font-size: 13.5px; color: #3d3d3d; margin-bottom: 10px; }
  @media (max-width: 900px) { .sponsor-inline-grid { grid-template-columns: 1fr; max-width: 400px; } }

  .pledge-preview-card { max-width: 820px; margin: 40px auto 0; display: flex; border-radius: 16px; overflow: hidden; box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
  .pledge-preview-side { flex: 1.1; background: #1a1a1a; padding: 35px 30px; text-align: center; }
  .pledge-preview-side .verse-text { font-family: var(--font-display); font-size: 15px; color: #fff; font-style: italic; margin-bottom: 10px; }
  .pledge-preview-side .verse-ref { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; color: var(--gold); font-weight: 600; }
  .pledge-preview-main { flex: 1.4; padding: 35px 30px; background: #fff; }
  .pledge-preview-main h3 { font-family: var(--font-display); color: var(--ink); font-size: 24px; margin-bottom: 4px; }
  @media (max-width: 700px) { .pledge-preview-card { flex-direction: column; } }
`, { raw: true });

var GalaPreview = createClass({
  render: function () {
    var entry = this.props.entry;
    var data = entry.get("data") ? entry.get("data").toJS() : {};

    var hero = data.hero || {};
    var purposeSection = data.purposeSection || {};
    var countdown = data.countdown || {};
    var sponsorship = data.sponsorship || {};
    var stewardshipSection = data.stewardshipSection || {};
    var pledge = data.pledge || {};

    function paras(list) {
      return (Array.isArray(list) ? list : []).map(function (p, i) {
        return h("p", { key: i }, p.text || "");
      });
    }

    // The 6 circular highlight photos are fixed site images (not fields in
    // this entry), so they're shown exactly as they appear on the live
    // page rather than pulled from CMS data.
    var bubblePaths = [
      "assets/images/bubble1.png",
      "assets/images/bubble2.jpg",
      "assets/images/bubble3.png",
      "assets/images/bubble4.jpg",
      "assets/images/bubble5.jpg",
      "assets/images/bubble6.png",
    ];
    var bubbles = bubblePaths.map(function (path, i) {
      return h(
        "div",
        { key: i, className: "bubble bubble-" + (i + 1) },
        h("img", { src: "https://hopegala.bz/" + path, alt: "Gala Highlight" })
      );
    });

    var countdownEl =
      countdown.show === false
        ? null
        : (function () {
            var target = countdown.targetDate ? new Date(countdown.targetDate).getTime() : NaN;
            var now = new Date().getTime();
            var diff = isNaN(target) ? 0 : target - now;
            if (diff < 0) diff = 0;
            var d = Math.floor(diff / 86400000);
            var hrs = Math.floor((diff % 86400000) / 3600000);
            var mins = Math.floor((diff % 3600000) / 60000);
            var secs = Math.floor((diff % 60000) / 1000);
            function unit(label, value) {
              return h(
                "div",
                { className: "flip-unit" },
                h("span", { className: "flip-unit-label" }, label),
                h(
                  "div",
                  { className: "flip-card" },
                  h("div", { className: "flip-card-face" }, h("span", { className: "flip-card-number" }, String(value).padStart(2, "0")))
                )
              );
            }
            return h(
              "div",
              { className: "flip-countdown" },
              unit("Days", d),
              unit("Hours", hrs),
              unit("Minutes", mins),
              unit("Seconds", secs)
            );
          })();

    var sponsorshipEl =
      sponsorship.show === false
        ? null
        : h(
            "section",
            { style: { padding: "25px 24px 35px", textAlign: "center" } },
            h(
              "h2",
              { style: { fontFamily: "var(--font-display)", fontSize: "2.2rem", color: "var(--ink)", marginBottom: "20px" } },
              "Become a Sponsor"
            ),
            h(
              "div",
              { className: "sponsor-inline-grid" },
              (Array.isArray(sponsorship.tiers) ? sponsorship.tiers : []).map(function (tier, i) {
                return h(
                  "div",
                  { key: i, className: "sponsor-inline-card" },
                  h(
                    "div",
                    { className: "sponsor-inline-header" },
                    h("div", { className: "sponsor-inline-badge" }),
                    h("h3", {}, tier.name || "")
                  ),
                  h("div", { className: "sponsor-inline-price" }, tier.price || ""),
                  h(
                    "ul",
                    { className: "sponsor-inline-list" },
                    (Array.isArray(tier.perks) ? tier.perks : []).map(function (perkObj, j) {
                      return h("li", { key: j }, "✓ " + (perkObj.perk || ""));
                    })
                  )
                );
              })
            )
          );

    return h(
      "div",
      {},
      h(
        "div",
        { className: "hero-intro" },
        h("h1", {}, hero.title || "(Title not set)"),
        h("p", { style: { fontSize: "1.2rem", marginTop: "10px", color: "var(--gold)" } }, hero.dateLocation || ""),
        h("div", { className: "divider", style: { marginTop: "25px" } }),
        h(
          "button",
          { className: "modal-submit", style: { width: "auto", display: "inline-block", padding: "12px 35px" } },
          hero.pledgeButtonText || "Make a Pledge"
        )
      ),
      h(
        "section",
        { className: "ministry-section bg-white", style: { padding: "50px 24px", position: "relative" } },
        countdownEl,
        h(
          "div",
          { className: "ministry-row" },
          h(
            "div",
            { className: "ministry-content" },
            h("h2", {}, purposeSection.purposeHeading || "(Heading not set)"),
            paras(purposeSection.purposeParagraphs)
          ),
          h("div", { className: "ministry-visual" }, h("div", { className: "bubble-cluster" }, bubbles))
        )
      ),
      sponsorshipEl,
      h(
        "section",
        { className: "ministry-section bg-white", style: { padding: "50px 24px" } },
        h(
          "div",
          { className: "ministry-row reverse" },
          h(
            "div",
            { className: "ministry-content" },
            h("h2", {}, stewardshipSection.stewardshipHeading || "(Heading not set)"),
            paras(stewardshipSection.stewardshipParagraphs)
          ),
          h(
            "div",
            { className: "ministry-visual" },
            h("img", {
              className: "ministry-main-img",
              style: { border: "none", boxShadow: "none", objectFit: "contain", maxHeight: "400px" },
              src: "https://hopegala.bz/assets/images/chart.png",
              alt: "Budget Distribution Chart",
            })
          )
        )
      ),
      h(
        "section",
        { className: "ministry-section bg-offwhite", style: { padding: "50px 24px" } },
        h(
          "div",
          { className: "container" },
          h(
            "h2",
            {
              style: {
                fontFamily: "var(--font-display)",
                fontSize: "2rem",
                color: "var(--ink)",
                textAlign: "center",
                marginBottom: "35px",
              },
            },
            data.ministriesSupportHeading || "Ministries You Support"
          ),
          h(
            "p",
            { style: { textAlign: "center", color: "#888", fontSize: "13px" } },
            "(Ministry logos shown here come from the Ministries page — edit them there.)"
          )
        )
      ),
      h(
        "div",
        { className: "pledge-preview-card" },
        h(
          "div",
          { className: "pledge-preview-side" },
          h("p", { className: "verse-text" }, pledge.verseText ? '"' + pledge.verseText + '"' : ""),
          h("p", { className: "verse-ref" }, pledge.verseReference || "")
        ),
        h(
          "div",
          { className: "pledge-preview-main" },
          h("h3", {}, pledge.modalTitle || "Make a Pledge"),
          h("p", { style: { fontSize: "14px", color: "#555", marginBottom: "18px" } }, pledge.thanksText || ""),
          h(
            "div",
            { className: "bank-details-card" },
            h("h5", {}, pledge.bankName || ""),
            h("p", {}, "Account Name: ", h("strong", {}, pledge.bankAccountName || "")),
            h("p", {}, "Account Number: ", h("strong", {}, pledge.bankAccountNumber || ""))
          ),
          h("p", { className: "check-instruction" }, pledge.checkInstruction || ""),
          h(
            "div",
            { className: "pledge-contact-footer" },
            h("p", { className: "contact-title" }, pledge.contactsIntro || ""),
            h(
              "div",
              { className: "contact-grid" },
              (Array.isArray(pledge.contacts) ? pledge.contacts : []).map(function (c, i) {
                return h("p", { key: i }, h("strong", {}, c.name || ""), h("br"), c.phone || "");
              })
            ),
            h("p", { className: "email-line" }, h("strong", {}, "Email: "), pledge.email || "")
          )
        )
      )
    );
  },
});

CMS.registerPreviewTemplate("gala", GalaPreview);
