#!/usr/bin/env node
/**
 * build.js — bakes the CMS content (assets/content/*.json) into the HTML pages.
 *
 * WHY THIS EXISTS
 *   The Content Manager (/admin) only ever edits the JSON files. This script
 *   copies that content into the .html files so that:
 *     - the page arrives with the correct text on the very first frame
 *       (no "old text, then new text" flash),
 *     - search engines and link previews see the real content, and
 *     - the HTML in GitHub always matches what was published in the CMS.
 *
 * HOW IT WORKS
 *   The HTML files contain marker comments. Everything between a pair of
 *   markers is generated; everything outside is hand-written and untouched.
 *
 *     Text slot (inline):   <!--cms:hero.title-->Some text<!--/cms-->
 *         Replaced with the JSON value at that path (HTML-escaped).
 *         Optional filter:  <!--cms:pledge.verseText|quote-->  (wraps in "quotes")
 *
 *     Block (own lines):    <!--cms-block:sponsor-tiers-->
 *                           ...generated markup...
 *                           <!--/cms-block:sponsor-tiers-->
 *         Replaced with the markup produced by the matching function in BLOCKS.
 *
 *   Running it twice gives identical output (idempotent), and it keeps each
 *   file's existing line endings, so it never creates noise in git diffs.
 *
 * USAGE
 *   node scripts/build.js           write the pages
 *   node scripts/build.js --check   change nothing; exit 1 if any page is stale
 *
 * No dependencies — plain Node 18+. In production this runs automatically in
 * .github/workflows/static.yml after every push (including CMS publishes).
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const CHECK_ONLY = process.argv.includes('--check');

/* ------------------------------------------------------------------ */
/* Which JSON feeds which page, and what each page must contain        */
/* ------------------------------------------------------------------ */

const PAGES = {
	'index.html': {
		data: 'home',
		blocks: ['head', 'visibility', 'slideshow', 'video-iframe', 'why-belize-paragraphs'],
		// [JSON key, CSS selector] — section is hidden when json[key].show === false
		hide: [['video', '#video-section']]
	},
	'gala.html': {
		data: 'gala',
		blocks: ['head', 'visibility', 'countdown-config', 'purpose-paragraphs', 'sponsor-tiers',
			'stewardship-paragraphs', 'pledge-contacts', 'ministries-support'],
		hide: [['countdown', '#countdown-container'], ['sponsorship', '#sponsorship-section']]
	},
	'ministries.html': {
		data: 'ministries',
		blocks: ['head', 'nav-primary', 'nav-secondary', 'ministry-sections', 'program-sections'],
		hide: []
	},
	'resources.html': {
		data: 'resources',
		blocks: ['head', 'resource-tiles', 'page-data'],
		hide: []
	},
	'gallery.html': {
		data: 'gallery',
		blocks: ['head', 'album-tiles', 'page-data'],
		hide: []
	}
};

/* ------------------------------------------------------------------ */
/* Small helpers                                                       */
/* ------------------------------------------------------------------ */

// Text inside an element: only & < > need escaping.
const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Inside a "double-quoted" attribute: quotes too.
const attr = (s) => esc(s).replace(/"/g, '&quot;');
// JSON safe to drop inside <script type="application/json">.
const jsonForScript = (o) => JSON.stringify(o)
	.replace(/</g, '\\u003c').replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
// Fallback image used by the logo tiles if a logo file is missing.
const placeholder = (label) =>
	'https://placehold.co/150x150/f4f4f4/c7973f?text=' + encodeURIComponent(label).replace(/'/g, '%27');

function getPath(obj, p) {
	return p.replace(/\[(\d+)\]/g, '.$1').split('.')
		.reduce((o, k) => (o === undefined || o === null ? undefined : o[k]), obj);
}

function readJson(name) {
	const file = path.join(ROOT, 'assets', 'content', name + '.json');
	let raw;
	try { raw = fs.readFileSync(file, 'utf8'); }
	catch (e) { throw new Error(`Missing content file assets/content/${name}.json`); }
	try { return JSON.parse(raw); }
	catch (e) { throw new Error(`assets/content/${name}.json is not valid JSON: ${e.message}`); }
}

const needArray = (value, label) => {
	if (!Array.isArray(value)) throw new Error(`"${label}" must be a list in the content file`);
	return value;
};

/* ------------------------------------------------------------------ */
/* Markup builders (mirror what the old in-browser scripts produced)   */
/* ------------------------------------------------------------------ */

const PERK_ICON = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>';

const RESOURCE_TILE_ICON = [
	'<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">',
	'\t<path d="M6 2h9l5 5v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
	'\t<path d="M15 2v5h5" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/>',
	'\t<path d="M8 13h8M8 17h8M8 9h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
	'</svg>'
].join('\n');

const paragraphs = (list) => needArray(list, 'paragraph list').map((p) => `<p>${esc(p.text)}</p>`);

function ministryNavTile(m, altSuffix, hrefPrefix) {
	return [
		`<a href="${attr(hrefPrefix + m.id)}" class="ministry-nav-tile">`,
		`\t<img src="${attr(m.logo)}" alt="${attr(m.shortName + altSuffix)}" onerror="this.src='${attr(placeholder(m.shortName))}'">`,
		`\t<h4>${esc(m.shortName)}</h4>`,
		'</a>'
	].join('\n');
}

function contentSection(entry, nameKey, subtitleKey, bgClass) {
	const lines = [
		`<section id="${attr(entry.id || '')}" class="ministry-section ${bgClass}">`,
		'\t<div class="ministry-row">',
		'\t\t<div class="ministry-content">',
		`\t\t\t<h2>${esc(entry[nameKey])}</h2>`
	];
	if (entry[subtitleKey]) {
		lines.push(`\t\t\t<h4 style="color: var(--gold); font-weight: 600; margin-top: -15px; margin-bottom: 15px; text-transform: uppercase; letter-spacing: 1px; font-size: 0.9rem;">${esc(entry[subtitleKey])}</h4>`);
	}
	String(entry.body || '').split(/\n\s*\n/).forEach((para) => {
		if (para.trim()) lines.push(`\t\t\t<p>${esc(para.trim())}</p>`);
	});
	lines.push('\t\t</div>', '\t</div>', '</section>');
	return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* Blocks. Each returns an array of markup chunks, or null to leave    */
/* the existing markup in place. ctx = { d: this page's JSON,           */
/* all: loader for other JSON files, page }                             */
/* ------------------------------------------------------------------ */

const BLOCKS = {
	// <title>, meta description and social-share tags — from the "seo" field.
	head({ d }) {
		if (!d.seo || !d.seo.title) return null;
		const out = [];
		if (d.seo.description) out.push(`<meta name="description" content="${attr(d.seo.description)}">`);
		out.push(`<title>${esc(d.seo.title)}</title>`);
		out.push(`<meta property="og:title" content="${attr(d.seo.title)}">`);
		if (d.seo.description) out.push(`<meta property="og:description" content="${attr(d.seo.description)}">`);
		out.push('<meta property="og:type" content="website">');
		return out;
	},

	// Sections the CMS can switch off ("show: false") are hidden with CSS.
	visibility({ d, page }) {
		const selectors = PAGES[page].hide
			.filter(([key]) => d[key] && d[key].show === false)
			.map(([, selector]) => selector);
		if (!selectors.length) return [];
		return ['<style>', ...selectors.map((s) => `\t${s} { display: none !important; }`), '</style>'];
	},

	/* ----- Home ----- */
	slideshow({ d }) {
		const paths = needArray(d.slideshow_images, 'slideshow_images').map((i) => i.image);
		const slide = (p, clone) =>
			`<li${clone ? ' aria-hidden="true"' : ''}><img class="slide-fg" src="${attr(p)}" alt="${clone ? '' : 'The Belize Project'}"></li>`;
		// Original set, then a clone set so the CSS animation loops without a jump.
		return [...paths.map((p) => slide(p, false)), ...paths.map((p) => slide(p, true))];
	},

	'video-iframe'({ d }) {
		if (!d.video || !d.video.youtubeId) return null;
		const id = encodeURIComponent(d.video.youtubeId);
		const src = `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&controls=1&rel=0&modestbranding=1`;
		return [
			'<iframe id="video-iframe"',
			`\tsrc="${attr(src)}"`,
			'\ttitle="The Belize Project Story"',
			'\tallow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"',
			'\tallowfullscreen>',
			'</iframe>'
		];
	},

	'why-belize-paragraphs'({ d }) {
		return needArray(d.whyBelize && d.whyBelize.paragraphs, 'whyBelize.paragraphs')
			.map((p, i) => `<p${i === 0 ? ' class="drop-cap"' : ''}>${esc(p.text)}</p>`);
	},

	/* ----- Gala ----- */
	'countdown-config'({ d }) {
		const c = d.countdown || {};
		return [`<script type="application/json" id="countdown-config">${jsonForScript({ show: c.show !== false, targetDate: c.targetDate || null })}</script>`];
	},

	'purpose-paragraphs'({ d }) { return paragraphs(d.purposeSection && d.purposeSection.purposeParagraphs); },
	'stewardship-paragraphs'({ d }) { return paragraphs(d.stewardshipSection && d.stewardshipSection.stewardshipParagraphs); },

	'sponsor-tiers'({ d }) {
		return needArray(d.sponsorship && d.sponsorship.tiers, 'sponsorship.tiers').map((tier) => [
			'<div class="sponsor-inline-card">',
			'\t<div class="sponsor-inline-header">',
			'\t\t<div class="sponsor-inline-badge"></div>',
			`\t\t<h3>${esc(tier.name)}</h3>`,
			'\t</div>',
			`\t<div class="sponsor-inline-price">${esc(tier.price)}</div>`,
			'\t<ul class="sponsor-inline-list">',
			...(tier.perks || []).map((p) => `\t\t<li>${PERK_ICON} ${esc(p.perk)}</li>`),
			'\t</ul>',
			'</div>'
		].join('\n'));
	},

	'pledge-contacts'({ d }) {
		return needArray(d.pledge && d.pledge.contacts, 'pledge.contacts')
			.map((c) => `<p><strong>${esc(c.name)}</strong><br>${esc(c.phone)}</p>`);
	},

	// "Ministries You Support" tiles come from the Ministries content file.
	'ministries-support'({ all }) {
		return needArray(all('ministries').ministries, 'ministries')
			.map((m) => ministryNavTile(m, '', 'ministries.html#').replace(` alt="${attr(m.shortName)}"`, ` alt="${attr(m.shortName)}"`));
	},

	/* ----- Ministries ----- */
	'nav-primary'({ d }) {
		return needArray(d.ministries, 'ministries').slice(0, 4).map((m) => ministryNavTile(m, ' Logo', '#'));
	},
	'nav-secondary'({ d }) {
		return needArray(d.ministries, 'ministries').slice(4).map((m) => ministryNavTile(m, ' Logo', '#'));
	},
	'ministry-sections'({ d }) {
		return needArray(d.ministries, 'ministries')
			.map((m, i) => contentSection(m, 'ministryName', 'ministrySubtitle', i % 2 === 0 ? 'bg-white' : 'bg-offwhite'));
	},
	'program-sections'({ d }) {
		return needArray(d.programs || [], 'programs')
			.map((p, i) => contentSection(p, 'programName', 'programSubtitle', i % 2 === 0 ? 'bg-offwhite' : 'bg-white'));
	},

	/* ----- Resources ----- */
	'resource-tiles'({ d }) {
		return needArray(d.categories, 'categories').map((c, i) => {
			const n = Array.isArray(c.items) ? c.items.length : 0;
			return [
				`<button type="button" class="resource-tile" data-index="${i}">`,
				'\t<div class="resource-tile-icon" aria-hidden="true">',
				RESOURCE_TILE_ICON.split('\n').map((l) => '\t\t' + l).join('\n'),
				'\t</div>',
				`\t<h3>${esc(c.title)}</h3>`,
				`\t<p>${esc(c.description || '')}</p>`,
				`\t<span class="resource-tile-count">${n} ${n === 1 ? 'Document' : 'Documents'}</span>`,
				'</button>'
			].join('\n');
		});
	},

	/* ----- Gallery ----- */
	'album-tiles'({ d }) {
		return needArray(d.albums, 'albums').map((a, i) => [
			`<div class="album-tile" data-index="${i}">`,
			'\t<div class="album-cover-wrapper">',
			`\t\t<img src="${attr(a.coverImage)}" alt="${attr(a.year + ' Cover')}" loading="lazy">`,
			'\t</div>',
			'\t<div class="album-info">',
			`\t\t<h4>${esc(a.year)}</h4>`,
			`\t\t<p>${a.category === 'ministry' ? 'Ministries' : 'Fundraising Event'}</p>`,
			'\t</div>',
			'</div>'
		].join('\n'));
	},

	// Resources and Gallery open panels/lightboxes on click. They read the
	// same content from this inline copy instead of fetching it again.
	'page-data'({ d }) {
		return [`<script type="application/json" id="page-data">${jsonForScript(d)}</script>`];
	}
};

/* ------------------------------------------------------------------ */
/* Engine                                                              */
/* ------------------------------------------------------------------ */

const SLOT_RE = /<!--cms:([A-Za-z_]\w*(?:\.[A-Za-z_]\w*|\[\d+\])*)(?:\|(\w+))?-->([\s\S]*?)<!--\/cms-->/g;
const BLOCK_RE = /^([ \t]*)<!--cms-block:([\w-]+)-->[\s\S]*?<!--\/cms-block:\2-->/gm;

const indentAll = (text, indent) => text.split('\n').map((l) => (l ? indent + l : l)).join('\n');

function buildPage(page, cfg, cache) {
	const all = (name) => (cache[name] = cache[name] || readJson(name));
	const d = all(cfg.data);
	const file = path.join(ROOT, page);
	const raw = fs.readFileSync(file, 'utf8');
	const usesCrlf = raw.includes('\r\n');
	const warnings = [];
	let html = raw.replace(/\r\n/g, '\n');

	// 1) Blocks
	const seen = new Set();
	html = html.replace(BLOCK_RE, (match, indent, name) => {
		if (!BLOCKS[name]) throw new Error(`${page}: unknown block "${name}"`);
		seen.add(name);
		let chunks;
		try { chunks = BLOCKS[name]({ d, all, page }); }
		catch (e) { throw new Error(`${page}: block "${name}" failed — ${e.message}`); }
		if (chunks === null) { warnings.push(`${page}: block "${name}" skipped (content missing), left as-is`); return match; }
		const body = chunks.length ? '\n' + chunks.map((c) => indentAll(c, indent)).join('\n') + '\n' + indent : '\n' + indent;
		return `${indent}<!--cms-block:${name}-->${body}<!--/cms-block:${name}-->`;
	});
	cfg.blocks.forEach((name) => {
		if (!seen.has(name)) throw new Error(`${page}: expected marker <!--cms-block:${name}--> not found in the HTML`);
	});

	// 2) Inline text slots
	html = html.replace(SLOT_RE, (match, p, filter) => {
		const value = getPath(d, p);
		if (value === undefined || value === null) {
			warnings.push(`${page}: no value for "${p}" in assets/content/${cfg.data}.json, left as-is`);
			return match;
		}
		let text = String(value);
		if (filter === 'quote') text = `"${text}"`;
		else if (filter) throw new Error(`${page}: unknown filter "${filter}"`);
		return `<!--cms:${p}${filter ? '|' + filter : ''}-->${esc(text)}<!--/cms-->`;
	});

	// Safety net: every opening marker must have been matched with its closing one.
	const count = (str) => html.split(str).length - 1;
	if (count('<!--cms:') !== count('<!--/cms-->')) throw new Error(`${page}: a <!--cms:...--> slot is malformed or unclosed`);
	if (count('<!--cms-block:') !== count('<!--/cms-block:')) throw new Error(`${page}: a <!--cms-block:...--> block is malformed or unclosed`);

	const out = usesCrlf ? html.replace(/\n/g, '\r\n') : html;
	return { file, raw, out, warnings };
}

function main() {
	const cache = {};
	// Phase 1: render every page in memory. If anything is wrong, we stop here
	// and no file on disk has been touched.
	const results = Object.entries(PAGES).map(([page, cfg]) => ({ page, ...buildPage(page, cfg, cache) }));

	// Phase 2: write only the pages whose content actually changed.
	let stale = 0;
	for (const { page, file, raw, out, warnings } of results) {
		warnings.forEach((w) => console.warn('  warning: ' + w));
		if (out === raw) { console.log(`  up to date  ${page}`); continue; }
		stale++;
		if (CHECK_ONLY) { console.log(`  STALE       ${page}`); continue; }
		fs.writeFileSync(file, out);
		console.log(`  updated     ${page}`);
	}
	if (CHECK_ONLY && stale) {
		console.error(`\n${stale} page(s) are out of date. Run: node scripts/build.js`);
		process.exit(1);
	}
}

try { main(); }
catch (e) {
	console.error('\nBUILD FAILED: ' + e.message);
	process.exit(1);
}
