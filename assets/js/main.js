/* Injects the shared header/footer into any page that has
   <div id="site-header"></div> and <div id="site-footer"></div>.
   Slider logic stays out of here — it's homepage-only, in index.html. */

const SITE_HEADER = `
	<header>
		<nav class="navegacion">
			<div class="nav-spacer"></div>
			<a href="index.html" class="nav-logo">
				<img src="assets/images/logos/bplogo.png" alt="The Belize Project">
			</a>
			<ul class="nav-menu">
				<li><a href="index.html">Home</a></li>
				<li><a href="gala.html">Hope Gala</a></li>
				<li><a href="ministries.html">Ministries</a></li>
				<li><a href="gallery.html">Gallery</a></li>
			</ul>
		</nav>
	</header>
`;

const SITE_FOOTER = `
	<footer>
		<div class="footer-contact">
			<h3>Contact Us</h3>
			<ul class="contact-list">
				<li>
					<span class="contact-label">Email</span>
					<a href="mailto:info@thebelizeproject.org">info@thebelizeproject.org</a> <!-- TODO: real email -->
				</li>
				<li>
					<span class="contact-label">Phone</span>
					<a href="tel:+5010000000">+501 000-0000</a> <!-- TODO: real phone -->
				</li>
				<li>
					<span class="contact-label">Location</span>
					<span>Belize City, Belize</span> <!-- TODO: real location -->
				</li>
			</ul>
		</div>
		<div class="foot">
			<img src="assets/images/logos/hplogo.png" alt="Hope Gala">
		</div>
		<div class="footer-text">
			© The Belize Project Hope Gala
		</div>
	</footer>
`;

document.addEventListener('DOMContentLoaded', () => {
	const headerSlot = document.getElementById('site-header');
	const footerSlot = document.getElementById('site-footer');

	if (headerSlot) headerSlot.innerHTML = SITE_HEADER;
	if (footerSlot) footerSlot.innerHTML = SITE_FOOTER;
});
